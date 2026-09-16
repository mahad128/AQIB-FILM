import { useState, useEffect, useRef, useCallback } from 'react'

// ── Shared hooks ──────────────────────────────────────────────────────────────

function useFadeUp(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

function useCounter(target: number, duration = 2200) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const fired = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || fired.current) return
        fired.current = true
        const t0 = performance.now()
        const run = (now: number) => {
          const p = Math.min((now - t0) / duration, 1)
          setValue(Math.round((1 - (1 - p) ** 3) * target))
          if (p < 1) requestAnimationFrame(run)
        }
        requestAnimationFrame(run)
      },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [target, duration])
  return { value, ref }
}

// ── Navbar ────────────────────────────────────────────────────────────────────

function Navbar() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const links = ['Work', 'About', 'Services', 'Contact']

  useEffect(() => {
    const fn = () => setSolid(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid
          ? 'bg-black/96 backdrop-blur-md py-4 border-b border-white/[0.04]'
          : 'bg-transparent py-7'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#hero" className="font-display text-[1.2rem] tracking-widest text-white">
          AQIB<span className="text-[#00b4d8]">.</span>
        </a>

        <div className="hidden md:flex items-center gap-9">
          {links.map(l => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="text-[11px] tracking-[0.28em] uppercase text-white/50 hover:text-[#00b4d8] transition-colors duration-300"
            >
              {l}
            </a>
          ))}
          <a
            href="#contact"
            className="px-5 py-2.5 border border-[#00b4d8]/50 text-[#00b4d8] text-[11px] tracking-[0.28em] uppercase hover:bg-[#00b4d8] hover:text-black hover:border-[#00b4d8] transition-all duration-300"
          >
            Hire Me
          </a>
        </div>

        <button
          onClick={() => setOpen(o => !o)}
          className="md:hidden text-white/60 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {open ? (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 4l14 14M18 4L4 18" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 6h16M3 11h16M3 16h16" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-black/96 border-t border-white/[0.06] px-6 py-6 flex flex-col gap-5">
          {links.map(l => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="text-sm tracking-[0.22em] uppercase text-white/55 hover:text-[#00b4d8] transition-colors"
            >
              {l}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section id="hero" className="relative h-screen min-h-[660px] flex items-center overflow-hidden bg-[#030608]">
      {/* Cinematic background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop&auto=format"
          alt="Cinematic film set"
          className="w-full h-full object-cover"
          style={{
            filter: 'brightness(0.42) saturate(0.65)',
            animation: 'hero-zoom 2.8s ease-out forwards',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030608]/30 via-transparent to-[#050810]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030608]/65 via-[#030608]/10 to-transparent" />
        {/* Equipment glow — cool blue rim */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 80% at 78% 40%, rgba(0,100,200,0.09) 0%, transparent 65%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-24">
        <div style={{ animation: 'fade-up 0.65s ease-out 0.35s both' }}>
          <div className="flex items-center gap-3 mb-8 text-[#00b4d8]">
            <span className="w-10 h-px bg-current opacity-70" />
            <span className="text-[9px] tracking-[0.45em] uppercase opacity-70">Lahore, Pakistan</span>
          </div>
        </div>

        <div style={{ animation: 'fade-up 0.65s ease-out 0.5s both' }}>
          <h1
            className="font-display leading-[0.9] uppercase text-white"
            style={{ fontSize: 'clamp(5.5rem,16vw,13rem)' }}
          >
            Aqib
          </h1>
          <h1
            className="font-display leading-[0.9] uppercase"
            style={{
              fontSize: 'clamp(5.5rem,16vw,13rem)',
              WebkitTextStroke: '1.5px rgba(255,255,255,0.16)',
              color: 'transparent',
            }}
          >
            Hayat
          </h1>
        </div>

        <div style={{ animation: 'fade-up 0.65s ease-out 0.65s both' }}>
          <p className="mt-7 text-[10px] tracking-[0.55em] uppercase text-white/45">
            Filmmaker
            <span className="text-[#00b4d8] mx-3">|</span>
            Cinematographer
            <span className="text-[#00b4d8] mx-3">|</span>
            Editor
          </p>
        </div>

        <div
          className="mt-10 flex flex-wrap gap-4"
          style={{ animation: 'fade-up 0.65s ease-out 0.8s both' }}
        >
          <a
            href="#work"
            className="px-8 py-3.5 bg-[#00b4d8] text-black text-[10px] tracking-[0.35em] uppercase font-bold hover:bg-white transition-colors duration-300"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="px-8 py-3.5 border border-white/18 text-white text-[10px] tracking-[0.35em] uppercase hover:border-[#00b4d8]/55 hover:text-[#00b4d8] transition-all duration-300"
          >
            Get In Touch
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5"
        style={{ animation: 'fade-up 0.65s ease-out 1.1s both' }}
      >
        <span className="text-[8px] tracking-[0.45em] uppercase text-white/20">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent" />
      </div>
    </section>
  )
}

// ── Featured Work ─────────────────────────────────────────────────────────────

// ── HOW TO ADD YOUR OWN PROJECTS ──────────────────────────────────────────────
// For each project set:
//   src       → thumbnail image URL
//   videoUrl  → video link that opens in new tab when clicked
//              (YouTube, Instagram, Vimeo, Google Drive, any URL)
//
// Quick YouTube thumbnail from video link:
//   src: ytThumb('VIDEO_ID')   e.g. youtube.com/watch?v=VIDEO_ID
//
// size: 'tall' (portrait), 'wide' (landscape 2-col), 'normal' (square)
// accent: 'amber' (orange), 'cyan' (blue), 'none' (neutral)

function unsplash(id: string, w: number, h: number) {
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format`
}

function ytThumb(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}

interface Work {
  id: number
  src: string
  videoUrl: string
  label: string
  title: string
  size: 'tall' | 'wide' | 'normal'
  accent: 'amber' | 'cyan' | 'none'
}

const WORKS: Work[] = [
  {
    id: 1,
    src: '/images/work-1.svg',
    videoUrl: 'https://res.cloudinary.com/qihhar33/video/upload/v1789484902/food.mp4',
    label: 'Food Videography',
    title: 'CRISPY. JUICY. UNFORGETTABLE.',
    size: 'tall',
    accent: 'amber',
  },
  {
    id: 2,
    src: '/images/work-2.svg',
    videoUrl: 'https://res.cloudinary.com/qihhar33/video/upload/v1789484465/echos_of_tomoorow.mp4',
    label: 'Short Film',
    title: 'ECHOES OF TOMORROW',
    size: 'wide',
    accent: 'cyan',
  },
  {
    id: 3,
    src: '/images/work-3.svg',
    videoUrl: 'https://res.cloudinary.com/qihhar33/video/upload/v1789484897/gym.mp4',
    label: 'Gym Portrait',
    title: 'STRENGTH. DISCIPLINE. POWER.',
    size: 'normal',
    accent: 'none',
  },
  {
    id: 4,
    src: '/images/work-4.svg',
    videoUrl: 'https://res.cloudinary.com/qihhar33/video/upload/v1789484902/coffee_2.mp4',
    label: 'Restaurant',
    title: 'BOLD BREW. CINEMATIC POUR.',
    size: 'normal',
    accent: 'amber',
  },
  {
    id: 5,
    src: '/images/work-5.svg',
    videoUrl: 'https://res.cloudinary.com/qihhar33/video/upload/v1789484899/product_compain.mp4',
    label: 'Commercial',
    title: 'PRODUCT CAMPAIGN',
    size: 'normal',
    accent: 'none',
  },
  {
    id: 6,
    src: '/images/work-6.svg',
    videoUrl: 'https://res.cloudinary.com/qihhar33/video/upload/v1789486293/documentry.mp4',
    label: 'Documentary',
    title: 'ANDROON LAHORE',
    size: 'wide',
    accent: 'cyan',
  },
]

function WorkCard({ work }: { work: Work }) {
  const [hov, setHov] = useState(false)
  const isAmber = work.accent === 'amber'
  const isCyan = work.accent === 'cyan'

  function openVideo() {
    window.open(work.videoUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      className="relative overflow-hidden cursor-pointer bg-[#0a1628]"
      style={{
        gridRow: work.size === 'tall' ? 'span 2' : undefined,
        gridColumn: work.size === 'wide' ? 'span 2' : undefined,
        minHeight: '260px',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={openVideo}
    >
      {work.videoUrl.toLowerCase().includes('.mp4') ? (
        <video
          src={work.videoUrl}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={work.src}
          style={{
            transform: hov ? 'scale(1.07)' : 'scale(1)',
            transition: 'transform 0.75s cubic-bezier(0.25,0.46,0.45,0.94)',
          }}
        />
      ) : (
        <img
          src={work.src}
          alt={work.title}
          className="w-full h-full object-cover"
          style={{
            transform: hov ? 'scale(1.07)' : 'scale(1)',
            transition: 'transform 0.75s cubic-bezier(0.25,0.46,0.45,0.94)',
          }}
        />
      )}

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

      {/* Category pill */}
      <div className="absolute top-4 left-4 z-10">
        <span
          className={`text-[9px] tracking-[0.28em] uppercase px-3 py-1.5 font-bold ${
            isAmber
              ? 'bg-[#f59e0b] text-black'
              : isCyan
              ? 'bg-[#00b4d8] text-black'
              : 'bg-black/55 text-white/75 backdrop-blur-sm border border-white/8'
          }`}
        >
          {work.label}
        </span>
      </div>

      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 p-5 z-10">
        <h3
          className={`font-display text-[1.4rem] leading-tight ${
            isAmber ? 'text-[#f59e0b]' : isCyan ? 'text-[#00b4d8]' : 'text-white'
          }`}
          style={{
            opacity: hov ? 0 : 1,
            transform: hov ? 'translateY(6px)' : 'none',
            transition: 'opacity 0.35s, transform 0.35s',
          }}
        >
          {work.title}
        </h3>

        <div
          style={{
            opacity: hov ? 1 : 0,
            transform: hov ? 'none' : 'translateY(6px)',
            transition: 'opacity 0.35s, transform 0.35s',
          }}
        >
          <div className="flex items-center gap-3 mt-1">
            <span className="w-6 h-px bg-white/55" />
            <span className="text-[9px] tracking-[0.35em] uppercase text-white/60">
              {work.label === 'Gym Portrait' ? 'Gym Energy' : 'Watch Video'}
            </span>
          </div>
        </div>
      </div>

      {/* Hover tint */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: hov ? 1 : 0,
          background: isAmber ? 'rgba(245,158,11,0.07)' : 'rgba(0,180,216,0.06)',
        }}
      />
    </div>
  )
}

function FeaturedWork() {
  const { ref, visible } = useFadeUp()

  return (
    <section id="work" className="py-24 px-6 max-w-7xl mx-auto">
      <div
        ref={ref}
        className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      >
        <div className="mb-14 flex items-end justify-between flex-wrap gap-6">
          <div>
            <span className="text-[#00b4d8] text-[9px] tracking-[0.4em] uppercase block mb-4 opacity-80">
              Portfolio
            </span>
            <h2
              className="font-display leading-none text-white uppercase"
              style={{ fontSize: 'clamp(3rem,9vw,8rem)' }}
            >
              Featured
              <br />
              Work
            </h2>
          </div>
          <p className="text-white/38 text-sm max-w-[280px] leading-relaxed">
            From sizzling food commercials to moody cinematic short films — every frame tells a story.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:auto-rows-[280px] gap-3">
          {WORKS.map(w => (
            <WorkCard key={w.id} work={w} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ── About ─────────────────────────────────────────────────────────────────────

function About() {
  const { ref, visible } = useFadeUp()
  const tools = ['DaVinci Resolve', 'After Effects', 'Lightroom']
  const gear = ['Sony FX3', 'DJI Ronin', 'Sigma Art Lenses', 'DJI Mini 4 Pro']

  return (
    <section id="about" className="py-24 bg-[#080e18]">
      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        {/* Photo */}
        <div className="relative">
          <div className="relative aspect-[3/4] max-w-[360px] mx-auto md:mx-0 overflow-hidden bg-[#0a1628]">
            <img
              src="https://res.cloudinary.com/qihhar33/image/upload/v1789486084/aqib_dp.jpg"
              alt="Aqib Hayat — Filmmaker"
              className="w-full h-full object-cover"
              style={{ filter: 'grayscale(80%) contrast(1.18) brightness(0.82)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-transparent to-transparent" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(135deg, rgba(0,65,140,0.18) 0%, transparent 55%)',
              }}
            />
          </div>

          {/* Badge */}
          <div className="absolute -bottom-5 right-6 md:-right-5 bg-[#00b4d8] text-black px-6 py-4">
            <div className="font-display text-[2.2rem] leading-none">3+</div>
            <div className="text-[9px] tracking-[0.25em] uppercase font-bold mt-0.5">Years Active</div>
          </div>
        </div>

        {/* Text */}
        <div className="pt-6 md:pt-0">
          <span className="text-[#00b4d8] text-[9px] tracking-[0.4em] uppercase block mb-5 opacity-80">
            About
          </span>
          <h2
            className="font-display leading-none text-white uppercase mb-7"
            style={{ fontSize: 'clamp(2.8rem,5vw,5rem)' }}
          >
            Crafting
            <br />
            Visual
            <br />
            <span className="text-[#f59e0b]">Stories</span>
          </h2>

          <p className="text-white/52 text-[15px] leading-[1.8] mb-4">
            Based in Lahore, Pakistan, I am a filmmaker, cinematographer, and editor with a passion
            for capturing authentic moments and crafting compelling visual narratives. From sizzling
            food commercials to moody cinematic short films, every project pushes the limits of
            visual storytelling.
          </p>
          <p className="text-white/52 text-[15px] leading-[1.8] mb-9">
            My work spans commercial production, documentary, and narrative filmmaking — always with
            a commitment to technical excellence and distinctive artistic vision.
          </p>

          <div className="mb-6">
            <div className="text-white/28 text-[9px] tracking-[0.28em] uppercase mb-3">Software</div>
            <div className="flex flex-wrap gap-2">
              {tools.map(t => (
                <span
                  key={t}
                  className="px-3 py-2 border border-white/10 text-white/55 text-[11px] tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:border-[#00b4d8]/60 hover:text-[#00b4d8] hover:bg-[#00b4d8]/5 hover:shadow-[0_0_20px_rgba(0,180,216,0.12)]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="text-white/28 text-[9px] tracking-[0.28em] uppercase mb-3">Camera Gear</div>
            <div className="flex flex-wrap gap-2">
              {gear.map(g => (
                <span
                  key={g}
                  className="px-3 py-2 border border-[#00b4d8]/22 bg-[#00b4d8]/[0.05] text-[#00b4d8]/75 text-[11px] tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:border-[#00b4d8]/60 hover:bg-[#00b4d8]/10 hover:text-[#8ee7ff] hover:shadow-[0_0_22px_rgba(0,180,216,0.18)]"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Services ──────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    label: 'SHOOT.',
    title: 'Cinematography',
    desc: 'Cinematic camera work that tells your story with clarity and depth — from golden-hour landscapes to controlled studio setups.',
    accent: 'cyan' as const,
  },
  {
    label: 'GRADE.',
    title: 'Color Grading',
    desc: 'Professional color grading in DaVinci Resolve — transforming raw footage into polished, emotionally resonant visuals.',
    accent: 'amber' as const,
  },
  {
    label: 'TASTE.',
    title: 'Food & Commercial',
    desc: 'High-appetite food videography and commercial production that makes your product impossible to scroll past.',
    accent: 'amber' as const,
  },
  {
    label: 'FEEL.',
    title: 'Short Films',
    desc: 'Narrative short films with the visual grammar of feature cinema — story-driven, character-focused, atmospherically rich.',
    accent: 'cyan' as const,
  },
]

function Services() {
  const { ref, visible } = useFadeUp()

  return (
    <section id="services" className="py-24 px-6 max-w-7xl mx-auto">
      <div
        ref={ref}
        className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      >
        <div className="text-center mb-16">
          <span className="text-[#00b4d8] text-[9px] tracking-[0.4em] uppercase block mb-4 opacity-80">
            What I Do
          </span>
          <h2
            className="font-display leading-none text-white uppercase"
            style={{ fontSize: 'clamp(3rem,9vw,8rem)' }}
          >
            Services
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.04]">
          {SERVICES.map(s => {
            const isAmber = s.accent === 'amber'
            return (
              <div
                key={s.title}
                className="bg-[#050810] p-8 group hover:bg-[#07101e] transition-colors duration-300 cursor-pointer"
              >
                <div
                  className={`font-display text-[3rem] mb-6 transition-transform duration-300 group-hover:scale-105 origin-left ${
                    isAmber ? 'text-[#f59e0b]' : 'text-[#00b4d8]'
                  }`}
                >
                  {s.label}
                </div>
                <h3 className="text-white font-semibold mb-3 tracking-wide text-[15px]">{s.title}</h3>
                <p className="text-white/42 text-sm leading-relaxed">{s.desc}</p>
                <div
                  className={`mt-8 h-px transition-all duration-500 group-hover:w-full w-8 ${
                    isAmber ? 'bg-[#f59e0b]' : 'bg-[#00b4d8]'
                  }`}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ── Before / After Slider ─────────────────────────────────────────────────────

function BeforeAfter() {
  const [pos, setPos] = useState(50)
  const boxRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const { ref, visible } = useFadeUp()

  const move = useCallback((x: number) => {
    const el = boxRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setPos(Math.max(3, Math.min(97, ((x - r.left) / r.width) * 100)))
  }, [])

  return (
    <section className="py-24 bg-[#080e18]">
      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-6 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        <div className="text-center mb-12">
          <span className="text-[#f59e0b] text-[9px] tracking-[0.4em] uppercase block mb-4 opacity-80">
            Color Grading
          </span>
          <h2
            className="font-display leading-none text-white uppercase"
            style={{ fontSize: 'clamp(3rem,9vw,8rem)' }}
          >
            Before / After
          </h2>
          <p className="mt-5 text-white/30 text-[9px] tracking-[0.4em] uppercase">
            Drag the handle to compare
          </p>
        </div>

        <div
          ref={boxRef}
          className="relative overflow-hidden cursor-ew-resize select-none bg-[#0a1628]"
          style={{ aspectRatio: '16/9', maxHeight: '72vh' }}
          onMouseDown={() => { dragging.current = true }}
          onMouseUp={() => { dragging.current = false }}
          onMouseLeave={() => { dragging.current = false }}
          onMouseMove={e => { if (dragging.current) move(e.clientX) }}
          onTouchMove={e => move(e.touches[0].clientX)}
        >
          {/* BEFORE — flat/raw */}
          <img
            src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&h=900&fit=crop&auto=format"
            alt="Before color grading — raw footage"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'saturate(0.2) contrast(0.78) brightness(1.18)' }}
            draggable={false}
          />

          {/* AFTER — graded */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          >
            <img
              src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&h=900&fit=crop&auto=format"
              alt="After color grading — graded footage"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: 'saturate(1.55) contrast(1.22) brightness(0.88) hue-rotate(-4deg)' }}
              draggable={false}
            />
          </div>

          {/* Labels */}
          <span className="absolute top-4 left-4 bg-black/65 backdrop-blur-sm px-3 py-1.5 text-[9px] tracking-[0.32em] uppercase text-white/65">
            RAW
          </span>
          <span className="absolute top-4 right-4 bg-[#00b4d8] px-3 py-1.5 text-[9px] tracking-[0.32em] uppercase text-black font-bold">
            GRADED
          </span>

          {/* Divider line */}
          <div
            className="absolute top-0 bottom-0 w-px bg-white"
            style={{
              left: `${pos}%`,
              boxShadow: '0 0 18px 3px rgba(0,180,216,0.65)',
              animation: 'pulse-glow 2.5s ease-in-out infinite',
            }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white shadow-2xl flex items-center justify-center">
              <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
                <path
                  d="M1 5h16M1 5L5 1M1 5L5 9M17 5l-4-4M17 5l-4 4"
                  stroke="#050810"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Stats ─────────────────────────────────────────────────────────────────────

function StatItem({
  target,
  suffix,
  label,
}: {
  target: number
  suffix: string
  label: string
}) {
  const { value, ref } = useCounter(target)
  return (
    <div ref={ref} className="text-center py-12 px-6">
      <div
        className="font-display leading-none text-white"
        style={{ fontSize: 'clamp(2.5rem,5.5vw,5rem)' }}
      >
        {value.toLocaleString()}
        {suffix}
      </div>
      <div className="text-white/32 text-[9px] tracking-[0.38em] uppercase mt-4">{label}</div>
    </div>
  )
}

function Stats() {
  const { ref, visible } = useFadeUp()
  return (
    <section className="border-t border-b border-white/[0.04] bg-[#050810]">
      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-6 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.04]">
          <StatItem target={2400} suffix="K+" label="Project Views" />
          <StatItem target={1200} suffix="+" label="Appreciations" />
          <StatItem target={850} suffix="+" label="Followers" />
          <StatItem target={120} suffix="+" label="Projects Completed" />
        </div>
      </div>
    </section>
  )
}

// ── Contact ───────────────────────────────────────────────────────────────────

const SOCIALS = [
  {
    name: 'Instagram',
    handle: '@aqibhayat_films',
    hoverColor: '#f59e0b',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  },
  {
    name: 'YouTube',
    handle: 'Aqib Hayat Films',
    hoverColor: '#00b4d8',
    path: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
  {
    name: 'LinkedIn',
    handle: 'Aqib Hayat',
    hoverColor: '#00b4d8',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
]

function Contact() {
  const { ref, visible } = useFadeUp()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
    setForm({ name: '', email: '', message: '' })
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <section id="contact" className="py-24 bg-[#080e18]">
      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        {/* Left panel */}
        <div>
          <span className="text-[#00b4d8] text-[9px] tracking-[0.4em] uppercase block mb-5 opacity-80">
            Get In Touch
          </span>
          <h2
            className="font-display leading-none text-white uppercase mb-9"
            style={{ fontSize: 'clamp(2.8rem,6.5vw,6rem)' }}
          >
            {"Let's"}
            <br />
            Create
            <br />
            <span className="text-[#f59e0b]">Together</span>
          </h2>

          <p className="text-white/42 text-sm leading-relaxed mb-10 max-w-[320px]">
            Available for commercial projects, short films, food videography, and creative
            collaborations. Based in Lahore — working worldwide.
          </p>

          {/* Social list */}
          <div className="space-y-4 mb-10">
            {SOCIALS.map(s => (
              <div key={s.name} className="flex items-center gap-4 group cursor-pointer">
                <span className="text-white/22 text-[9px] tracking-widest uppercase w-20 shrink-0">
                  {s.name}
                </span>
                <span className="w-5 h-px bg-white/12 group-hover:w-10 group-hover:bg-[#00b4d8] transition-all duration-300" />
                <span className="text-white/55 text-sm group-hover:text-white transition-colors">
                  {s.handle}
                </span>
              </div>
            ))}
          </div>

          {/* Icon links */}
          <div className="flex gap-3">
            {SOCIALS.map(s => (
              <a
                key={s.name}
                href="#"
                title={s.name}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/35 transition-all duration-300"
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.color = s.hoverColor
                  el.style.borderColor = s.hoverColor
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.color = ''
                  el.style.borderColor = ''
                }}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-6 pt-2">
          {(
            [
              { id: 'name', label: 'Your Name', type: 'text', placeholder: 'Ahmad Raza', key: 'name' as const },
              { id: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com', key: 'email' as const },
            ] as const
          ).map(field => (
            <div key={field.id}>
              <label
                htmlFor={field.id}
                className="block text-white/28 text-[9px] tracking-[0.28em] uppercase mb-2.5"
              >
                {field.label}
              </label>
              <input
                id={field.id}
                type={field.type}
                value={form[field.key]}
                onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                required
                className="w-full bg-transparent border border-white/10 text-white text-sm px-4 py-3.5 focus:outline-none focus:border-[#00b4d8]/55 transition-colors duration-300 placeholder:text-white/12"
              />
            </div>
          ))}

          <div>
            <label
              htmlFor="message"
              className="block text-white/28 text-[9px] tracking-[0.28em] uppercase mb-2.5"
            >
              Project Details
            </label>
            <textarea
              id="message"
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              placeholder="Tell me about your project — scope, timeline, vision..."
              rows={5}
              required
              className="w-full bg-transparent border border-white/10 text-white text-sm px-4 py-3.5 focus:outline-none focus:border-[#00b4d8]/55 transition-colors duration-300 placeholder:text-white/12 resize-none"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-4 text-[10px] tracking-[0.38em] uppercase font-bold transition-all duration-300 ${
              sent
                ? 'bg-green-500/90 text-white'
                : 'bg-[#00b4d8] text-black hover:bg-white'
            }`}
          >
            {sent ? 'Message Sent — Thank You!' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-black border-t border-white/[0.04] py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
        <div className="font-display text-[1.1rem] tracking-widest text-white">
          AQIB<span className="text-[#00b4d8]">.</span>HAYAT
        </div>
        <div className="text-white/22 text-[9px] tracking-[0.25em] uppercase">
          © 2025 — Lahore, Pakistan
        </div>
        <div className="text-white/14 text-[9px] tracking-[0.22em] uppercase">
          Filmmaker · Cinematographer · Editor
        </div>
      </div>
    </footer>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="bg-[#050810] text-white antialiased">
      <Navbar />
      <Hero />
      <FeaturedWork />
      <About />
      <Services />
      <BeforeAfter />
      <Stats />
      <Contact />
      <Footer />
    </div>
  )
}
