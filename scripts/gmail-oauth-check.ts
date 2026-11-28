import assert from 'node:assert/strict';
import { createDecipheriv, randomBytes } from 'node:crypto';
import { createGmailState, encryptRefreshToken, exchangeGmail, gmailConfig, validateGmailState } from '../lib/growth/gmail-oauth';

async function main() {
  const key = randomBytes(32);
  const owner = '11111111-1111-4111-8111-111111111111';
  const issued = 1700000000000;
  const { state, verifier, cookie } = createGmailState(owner, key, issued);
  assert.equal(validateGmailState(cookie, state, owner, key, issued), verifier);
  assert.equal(validateGmailState(cookie, randomBytes(32).toString('base64url'), owner, key, issued), null);
  assert.equal(validateGmailState(cookie, state, '22222222-2222-4222-8222-222222222222', key, issued), null);
  assert.equal(validateGmailState(cookie, state.slice(1), owner, key, issued), null);
  assert.equal(validateGmailState(cookie, state, owner, key, issued + 600001), null);
  assert.equal(validateGmailState(cookie, state, owner, key, issued - 1), null);
  assert.equal(validateGmailState(cookie, state, owner, randomBytes(32), issued), null);
  assert.equal(validateGmailState('invalid json', state, owner, key, issued), null);
  assert.equal(validateGmailState(undefined, state, owner, key, issued), null);
  assert.equal(validateGmailState(cookie, state, undefined, key, issued), null);
  const [payload, sig] = cookie.split('.');
  const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  parsed.issued = issued + 600001;
  const forged = Buffer.from(JSON.stringify(parsed)).toString('base64url') + '.' + sig;
  assert.equal(validateGmailState(forged, state, owner, key, issued + 600001), null);
  const encrypted = encryptRefreshToken('test-refresh', key);
  const [, iv, tag, ciphertext] = encrypted.split('.');
  assert.ok(!encrypted.includes('test-refresh'));
  const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'base64url'));
  decipher.setAAD(Buffer.from('growthos:gmail:refresh:v1'));
  decipher.setAuthTag(Buffer.from(tag, 'base64url'));
  assert.equal(Buffer.concat([decipher.update(Buffer.from(ciphertext, 'base64url')), decipher.final()]).toString(), 'test-refresh');
  const config = { clientId: 'id', clientSecret: 'secret', redirectUri: 'https://example.com/admin/growth-os/gmail/callback', encryptionKey: key };
  let calls = 0;
  const mock: typeof fetch = async (url, options) => {
    calls++;
    assert.equal(options?.redirect, 'error');
    if (url === 'https://oauth2.googleapis.com/token') {
      assert.equal(new URLSearchParams(options?.body as URLSearchParams).get('code_verifier'), 'verifier');
      return Response.json({ access_token: 'access', refresh_token: 'refresh', scope:'openid email https://www.googleapis.com/auth/gmail.send' });
    }
    assert.equal(url, 'https://openidconnect.googleapis.com/v1/userinfo');
    return Response.json({ email: 'kerifemdigitalventures@gmail.com', email_verified: true });
  };
  assert.match(await exchangeGmail('code', 'verifier', config, mock), /^v1\./);
  assert.equal(calls, 2);
  await assert.rejects(() => exchangeGmail('code', 'verifier', config, async (url) => url === 'https://oauth2.googleapis.com/token' ? Response.json({access_token:'access',refresh_token:'refresh',scope:'openid email https://www.googleapis.com/auth/gmail.send'}) : Response.json({email:'wrong@example.com',email_verified:true})));
  await assert.rejects(() => exchangeGmail('code','verifier',config,async () => Response.json({access_token:'access',refresh_token:'refresh',scope:'openid email'})));
  assert.equal(gmailConfig(), null);
  console.log('Gmail OAuth crypto and exchange mock checks passed; no real OAuth flow tested.');
}
main();
