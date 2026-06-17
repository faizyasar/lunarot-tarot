import { useEffect, useState } from 'react';

interface IntroScreenProps {
  onDismiss: () => void;
}

const EYE_FRAMES = [
  // Frame 0: Look center
  `      .------------------.      \n    .'    .--------.      '.    \n   /    .'          '.      \\   \n  |    /    (  ●  )   \\      |  \n  |    \\              /      |  \n   \\    '.          .'      /   \n    '.    '--------'      .'    \n      '------------------'      `,
  // Frame 1: Look left
  `      .------------------.      \n    .'    .--------.      '.    \n   /    .'          '.      \\   \n  |    /     (●   )    \\      |  \n  |    \\              /      |  \n   \\    '.          .'      /   \n    '.    '--------'      .'    \n      '------------------'      `,
  // Frame 2: Look right
  `      .------------------.      \n    .'    .--------.      '.    \n   /    .'          '.      \\   \n  |    /       (   ●)   \\      |  \n  |    \\              /      |  \n   \\    '.          .'      /   \n    '.    '--------'      .'    \n      '------------------'      `,
  // Frame 3: Dilated / Wide
  `      .------------------.      \n    .'    .--------.      '.    \n   /    .'          '.      \\   \n  |    /    ( ◉ ◉ )   \\      |  \n  |    \\              /      |  \n   \\    '.          .'      /   \n    '.    '--------'      .'    \n      '------------------'      `,
  // Frame 4: Half Blink
  `      .------------------.      \n    .'                      '.  \n   /  ------.        .------  \\ \n  |          \\ ( - )/          |\n  |          /      \\          |\n   \\  ------'.      .'------  / \n    '.                      .'  \n      '------------------'      `,
  // Frame 5: Closed
  `      .------------------.      \n    .'                      '.  \n   /                          \\ \n  |----------------------------|\n  |----------------------------|\n   \\                          / \n    '.                      .'  \n      '------------------'      `
];

export default function IntroScreen({ onDismiss }: IntroScreenProps) {
  const [isDismissing, setIsDismissing] = useState(false);
  const [glitchText, setGlitchText] = useState('◇ INITIATE CONTACT // UNSEAL PORTAL ◇');
  const [isGlitching, setIsGlitching] = useState(false);
  const [eyeFrameIndex, setEyeFrameIndex] = useState(0);

  // Auto dismiss or flicker effects
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.15) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 250);
      }
    }, 1500);

    return () => clearInterval(glitchInterval);
  }, []);

  // Eye movement cycle
  useEffect(() => {
    const eyeInterval = setInterval(() => {
      const rand = Math.random();
      if (rand < 0.45) {
        setEyeFrameIndex(0); // center
      } else if (rand < 0.6) {
        setEyeFrameIndex(1); // left
      } else if (rand < 0.75) {
        setEyeFrameIndex(2); // right
      } else if (rand < 0.85) {
        setEyeFrameIndex(3); // wide
      } else if (rand < 0.93) {
        setEyeFrameIndex(4); // blink-half
      } else {
        setEyeFrameIndex(5); // blink-close
        setTimeout(() => setEyeFrameIndex(0), 180);
      }
    }, 900);

    return () => clearInterval(eyeInterval);
  }, []);

  const handleDismiss = () => {
    if (isDismissing) return;
    setIsDismissing(true);
    setGlitchText('◆ CONNECTION SEAL BREACHED // DESCENT CONFIRMED ◆');
    setTimeout(() => {
      onDismiss();
    }, 1100);
  };

  // Generate esoteric liturgical text lines for the background walls of text
  const columns = [
    [
      "SECERNING SEALS // LUNAROT SYSTEM V.5042",
      "CORP: SACRED MECHANICS INC. (EST. 1999)",
      "TABULA VIRTUTIS AD SOLIS ET LUNAE CURSUM",
      "IGNIS • SANGUIS • SPIRITUS • APERTURE • OPEN",
      "STATUS: ILLEGAL SOUL REPLICATION DETECTED",
      "COMPILER WARNING: FAUSTIAN_DEAL_NOT_CLOSED",
      "IN NOMINE DIABOLI ET CORPORATE COVEN",
      "DENSE CONVERGENCE AT INTERSECT IV",
      "ET IN ARCADIA EGO • DIABOLUS IN MUSICA",
      "01001101 01011001 01010011 01010100 01001001 01000011",
      "DO NOT TOUCH THE PERIPHERY // STAY IN CIRCLE",
      "SACRAL MERIDIAN POINT #12: ECLIPSED",
      "ASCENSION DECAY LIMITS EXCEEDED",
      "THE VESSEL SHALL SUSTAIN INTERNAL BURNING",
    ],
    [
      "NEIJING CELESTIAL CIRCULATION RECONSTITUTED",
      "LUNAR DUST INHALATION PROTOCOL SE-4",
      "CONDUIT OVERHEATING (CORE TEMPERATURE: 104F)",
      "STRICT ACCUSATIONS OF HERESY REGISTERED",
      "THE ANOMALY WILL HARVEST WHAT IS FORBIDDEN",
      "CURSUS ANIMAE INTEGRITY: 12% WARNING",
      "VERBUM IPSUM CARO FACTUM EST ET TRADITUM",
      "DO NOT INTERRUPT THE BURN SEQUENCE",
      "THE SOUL REMAINS PROPERTY OF LUNAROT ENGINE OS",
      "FORBIDDEN ALIGNMENT SECURED UNDER CLOUD RUN",
      "EXORCISM MODULES DECAYED SINCE AUGUST 2002",
      "ORBITAL MERIDIANS: ARIES TO TAURUS SHIFT",
      "ETHEREAL TELEMETRY STATUS: CORRUPTING",
      "THE LUNAROT ENGINE DRAWS BLOOD FROM FINGERS",
    ],
    [
      "VIRTUAL MERCURY CONVULSION IN COMPILER",
      "TABULA DIABOLI: VOL. XII / SEC. 9",
      "LUNA IN FORTUNA PECCATORUM REGINA",
      "IF CARDS CHARR, PURGE IMMEDIATELY",
      "NO ATTEMPT SHALL BE MADE TO RESTORE CODE",
      "MEMENTO MORI • QUANTUM DEV_ENV STABILITY: 0",
      "TRANS-CELESTIAL RECOIL IN PROGRESS",
      "SACRED GEOMETRY OF ACUPUNCTURE NODES",
      "SOLE ORIGIN DETECTED: FAUSTIAN REGISTER",
      "THE VESSEL WRITES ITS OWN DEMISE",
      "NADA NADA NADA SENTENTIA INUTILIS",
      "CONJURATION SEQUENCE HAS OVERLAPPED SPACE",
      "DO NOT RECOIL FROM THE WHITE FLAME",
      "FIN DE SIÈCLE ESOTERISM CONFIRMED",
    ]
  ];

  return (
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-[100] bg-black flex flex-col justify-between items-center cursor-pointer transition-all duration-1000 select-none overflow-hidden ${
        isDismissing ? 'opacity-0 scale-98 filter blur-md pointer-events-none' : 'opacity-100'
      } ${isGlitching ? 'skew-x-1 saturate-200' : ''}`}
    >
      {/* ─── WALLS OF TEXT (LEFT & RIGHT) ─── */}
      <div className="absolute inset-0 z-0 flex justify-between px-4 py-8 pointer-events-none opacity-[0.24] md:opacity-[0.35]">
        
        {/* Left Dense columns */}
        <div className="hidden md:flex flex-col gap-1 w-72 text-left font-mono text-[7px] leading-3 tracking-widest text-white h-full overflow-hidden">
          {columns[0].concat(columns[2]).map((line, idx) => (
            <div key={idx} className="border-b border-white-[0.03] pb-[2px] truncate hover:text-white transition-colors duration-200">
              {idx + 1 < 10 ? `0${idx + 1}` : idx + 1} // {line}
            </div>
          ))}
        </div>

        {/* Center alignment scripture banner */}
        <div className="flex flex-col gap-1 w-full max-w-sm text-center mx-auto absolute inset-x-0 bottom-4 font-mono text-[6.5px] leading-3 tracking-[0.2em] text-white/50 px-6 uppercase">
          <div>// SYSTEM COLD_DESCENT: LUNAROT ENGINE OS //</div>
          <div>// CONNECTIVITY RE-TRIGGER ACTIVE // UNSEALING WILL COMMENCE ON TAP //</div>
        </div>

        {/* Right Dense columns */}
        <div className="hidden md:flex flex-col gap-1 w-72 text-right font-mono text-[7px] leading-3 tracking-widest text-white h-full overflow-hidden">
          {columns[1].concat(columns[0]).reverse().map((line, idx) => (
            <div key={idx} className="border-b border-white-[0.03] pb-[2px] truncate hover:text-white transition-colors">
              {line} // {idx + 44}
            </div>
          ))}
        </div>
      </div>

      {/* ─── CENTRAL RITUAL CONTAINER ─── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-lg px-6 text-center">
        
        {/* MOVING ASCII EYE */}
        <div className={`mb-10 transition-all duration-1000 ${isDismissing ? 'scale-110 opacity-0' : 'opacity-90'}`}>
          <div className="p-4 border border-white/10 bg-black/50 backdrop-blur-sm rounded-none text-white select-none inline-block font-mono text-[8px] sm:text-[10px] leading-[1.2] tracking-wider text-center">
            <span className="text-[7px] text-white/30 tracking-[0.35em] block mb-3 uppercase">
              [ WATCH_GATE // SECTOR_IV ]
            </span>
            <pre className="inline-block text-left whitespace-pre">
              {EYE_FRAMES[eyeFrameIndex]}
            </pre>
            <span className="text-[6.5px] text-white/30 tracking-[0.2em] block mt-3 uppercase animate-pulse">
              SYS STATUS: WATCHING // 0xCC1A92
            </span>
          </div>
        </div>

        {/* Cryptic high contextual instruction subtexts */}
        <div className="space-y-4 max-w-sm px-4">
          <p className="font-mono text-[7.5px] text-white/50 tracking-[0.35em] uppercase leading-relaxed font-semibold">
            [ LUNAROT ENGINE OS v4.18 // REGISTRY INGRESS ]
          </p>
          <div className="border-y border-white/10 py-3 font-mono text-[8.5px] leading-relaxed text-white/70 tracking-widest uppercase">
            <div>◆ INGRESS SECTOR ACTIVE</div>
            <div>◆ TABULA MATRIX UNSEALED</div>
            <div>◆ ANY PRESENCE BEYOND THIS GATE COMES PARADOXICAL</div>
          </div>
        </div>

        {/* Active trigger gate */}
        <div className={`mt-10 transition-all duration-300 ${isGlitching ? 'translate-x-1' : ''}`}>
          <div className="font-mono text-[8.5px] md:text-[9.5px] tracking-[0.45em] text-white uppercase animate-[breathe_2.2s_ease-in-out_infinite] border border-white/30 py-2.5 px-6 bg-black/60">
            {glitchText}
          </div>
          <div className="mt-4 font-mono text-[6px] tracking-[0.3em] text-white/30 uppercase">
            // PRESS ANYWHERE UPON THE SHADOWS TO PASS SEAL //
          </div>
        </div>

      </div>

      {/* Decorative corporate boundary footers */}
      <footer className="relative z-10 w-full py-4 px-8 border-t border-white/5 flex justify-between items-center text-[6px] md:text-[7px] tracking-[0.2em] text-white/30 font-mono shrink-0 uppercase select-none">
        <span>SECURITY ALIGNMENT: FORBIDDEN</span>
        <span>ASTRAL CHRONOLOGY ARCHIVE // EST. MMIV</span>
        <span>LUNAROT ENGINE OS // ROOT SECURITY ACTIVE</span>
      </footer>
    </div>
  );
}
