export default function EventHeader() {
  return (
    <header className="pt-12 pb-6 px-5 flex flex-col items-center">
      {/* Badge with glow */}
      <div className="relative mb-5">
        {/* Radial glow behind badge — dark blue/charcoal, faint */}
        <div
          className="absolute inset-0 rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, #1a2a4a 0%, #0a0a0f 70%)',
            transform: 'scale(1.8)',
          }}
        />
        <div
          className="relative rounded-full overflow-hidden"
          style={{
            width: 140,
            height: 140,
            filter: 'drop-shadow(0 4px 24px rgba(10,15,30,0.6))',
          }}
        >
          <img
            src="/sgc-logo.png"
            alt="Starch Golf Club"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'scale(1.22)',
            }}
          />
        </div>
      </div>

      {/* Event Title */}
      <h1 className="text-[18px] font-[800] tracking-[0.25em] uppercase text-accent-warm">
        RALLY IN THE VALLEY
      </h1>
      <p className="text-[12px] font-medium tracking-[0.15em] uppercase mt-1.5" style={{ color: '#d4c9a8', fontVariantCaps: 'all-small-caps' }}>
        CUP · 2026
      </p>
    </header>
  )
}
