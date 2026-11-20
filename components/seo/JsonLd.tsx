/**
 * Server-rendered JSON-LD. The object is stringified on the server so crawlers
 * get structured data without executing any JavaScript.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
