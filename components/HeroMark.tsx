export default function HeroMark() {
  return (
    <div className="kv-mark-board" aria-hidden="true">
      <div className="kv-mark-meta">
        <span>KERIFEM / DESIGN SYSTEM</span>
        <span>01</span>
      </div>
      <svg viewBox="0 0 440 300" fill="none" focusable="false">
        <path
          className="kv-draft"
          d="M74 30H366V270H74ZM74 75H366M74 225H366M135 30V270M305 30V270M220 30V270M74 150H366"
        />
        <path className="kv-draft-dashed" d="M74 270 366 30M74 30l292 240" />
        <circle className="kv-draft" cx="220" cy="150" r="102" />
        <path
          className="kv-draft-accent"
          d="M69 30h10m-5-5v10m287 235h10m-5-5v10M69 270h10m-5-5v10m287-245h10m-5-5v10"
        />
        <path
          className="kv-draft-outline"
          d="M151 75H190V225H151ZM203 150 266 75H314L247 150l67 75h-48Z"
          transform="translate(-8 8)"
        />
        <path
          className="kv-draft-fill"
          d="M151 75H190V225H151ZM203 150 266 75H314L247 150l67 75h-48Z"
        />
        <path className="kv-draft-highlight" d="M151 225V75h39m13 75 63-75h48" />
      </svg>
      <div className="kv-mark-meta">
        <span>FORM / K</span>
        <span>MONOGRAM STUDY</span>
      </div>
    </div>
  );
}
