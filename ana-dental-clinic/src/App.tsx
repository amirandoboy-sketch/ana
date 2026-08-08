import { useState, useEffect, useRef, useCallback, MouseEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollEngineProvider, ScrollReveal, ParallaxLayer } from './ScrollEngine';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
    __ytCallbacks?: (() => void)[];
  }
}

interface Service {
  id: string;
  name: string;
  code: string;
  badge: string;
  icon: string;
  desc: string;
  notes: string;
  delay: string;
  image?: string;
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);

  // ── YouTube states & refs (UNCHANGED - KEPT EXACTLY AS REQUESTED) ──
  const [heroReady, setHeroReady] = useState(false);
  const [heroScale, setHeroScale] = useState(1);
  const heroPlayerRef = useRef<any>(null);
  const heroVideoId = "zqzE8iCYKw4";

  const comingSoonPlayerRef = useRef<any>(null);
  const comingSoonVideoId = "K8yuAgy81L4";

  const addressPlayerRef = useRef<any>(null);
  const addressVideoId = "  suDQUUd-WZY";

  const [isLightTheme, setIsLightTheme] = useState<boolean>(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('theme') === 'light';
    return true;
  });

  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [msgInput, setMsgInput] = useState('');
  const [formError, setFormError] = useState('');

  const [addressTilt, setAddressTilt] = useState({ x: 0, y: 0 });

  const handleAddressMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setAddressTilt({ x: x * 12, y: -y * 12 });
  };

  const handleAddressMouseLeave = () => {
    setAddressTilt({ x: 0, y: 0 });
  };

  const [contactTilt, setContactTilt] = useState({ x: 0, y: 0 });

  const handleContactMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setContactTilt({ x: x * 14, y: -y * 14 });
  };

  const handleContactMouseLeave = () => {
    setContactTilt({ x: 0, y: 0 });
  };

  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    document.body.classList.toggle('light-theme', isLightTheme);
  }, [isLightTheme]);

  const showToast = (message: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMsg(message);
    setToastVisible(true);
    toastTimeoutRef.current = setTimeout(() => setToastVisible(false), 4500);
  };
  const hideToast = () => setToastVisible(false);

  const toggleTheme = () => {
    setIsLightTheme(prev => {
      const next = !prev;
      localStorage.setItem('theme', next ? 'light' : 'dark');
      showToast(next ? '☀️ Light Mode' : '🌙 Dark Mode');
      return next;
    });
  };

  // ── YouTube init (UNCHANGED - KEPT EXACTLY AS REQUESTED) ──
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setHeroScale(Math.max(width / 1920, height / 1080));
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    if (!window.__ytCallbacks) window.__ytCallbacks = [];

    const initAllPlayers = () => {
      const YT = window.YT;
      if (!YT) return;

      const safeOrigin = (() => {
        const origin = window.location.origin;
        if (origin === 'null' || window.location.protocol.startsWith('file')) {
          return 'https://www.youtube.com';
        }
        return origin;
      })();

      if (document.getElementById('kena-hero-iframe') && !heroPlayerRef.current) {
        try {
          heroPlayerRef.current = new YT.Player('kena-hero-iframe', {
            videoId: heroVideoId,
            playerVars: { autoplay: 1, mute: 1, controls: 0, rel: 0, showinfo: 0, modestbranding: 1, playsinline: 1, iv_load_policy: 3, disablekb: 1, fs: 0, origin: safeOrigin, widget_referrer: window.location.href },
            events: {
              onReady: (e: any) => { try { e.target.mute(); e.target.playVideo(); } catch (err) {} },
              onStateChange: (e: any) => {
                if (e.data === 1) setHeroReady(true);
                if (e.data === 0) { try { e.target.seekTo(0); e.target.playVideo(); } catch (err) {} }
              },
              onError: () => {}
            }
          });
        } catch (e) {}
      }

      if (document.getElementById('kena-comingsoon-iframe') && !comingSoonPlayerRef.current) {
        try {
          comingSoonPlayerRef.current = new YT.Player('kena-comingsoon-iframe', {
            videoId: comingSoonVideoId,
            playerVars: { autoplay: 1, mute: 1, controls: 0, rel: 0, showinfo: 0, modestbranding: 1, playsinline: 1, iv_load_policy: 3, disablekb: 1, fs: 0, origin: safeOrigin, widget_referrer: window.location.href },
            events: {
              onReady: (e: any) => { try { e.target.mute(); e.target.playVideo(); } catch (err) {} },
              onStateChange: (e: any) => { if (e.data === 0) { try { e.target.seekTo(0); e.target.playVideo(); } catch (err) {} } },
              onError: () => {}
            }
          });
        } catch (e) {}
      }

      if (document.getElementById('kena-address-iframe') && !addressPlayerRef.current) {
        try {
          addressPlayerRef.current = new YT.Player('kena-address-iframe', {
            videoId: addressVideoId,
            playerVars: { autoplay: 1, mute: 1, controls: 0, rel: 0, showinfo: 0, modestbranding: 1, playsinline: 1, iv_load_policy: 3, disablekb: 1, fs: 0, origin: safeOrigin, widget_referrer: window.location.href },
            events: {
              onReady: (e: any) => { try { e.target.mute(); e.target.playVideo(); } catch (err) {} },
              onStateChange: (e: any) => { if (e.data === 0) { try { e.target.seekTo(0); e.target.playVideo(); } catch (err) {} } },
              onError: () => {}
            }
          });
        } catch (e) {}
      }
    };

    window.__ytCallbacks.push(initAllPlayers);
    if (!window.onYouTubeIframeAPIReady) {
      window.onYouTubeIframeAPIReady = () => {
        if (window.__ytCallbacks) {
          window.__ytCallbacks.forEach(fn => fn());
          window.__ytCallbacks = [];
        }
      };
    }

    if (window.YT && window.YT.Player) initAllPlayers();

    return () => {
      window.removeEventListener('resize', handleResize);
      try { heroPlayerRef.current?.destroy(); } catch (e) {}
      try { comingSoonPlayerRef.current?.destroy(); } catch (e) {}
      try { addressPlayerRef.current?.destroy(); } catch (e) {}
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });

    const observerOptions = {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    };

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('[class*="reveal"]');
    revealElements.forEach(el => obs.observe(el));

    return () => {
      window.removeEventListener('scroll', onScroll);
      obs.disconnect();
    };
  }, []);

  const sendMsg = () => {
    setFormError('');
    if (!nameInput.trim() || !msgInput.trim()) {
      const err = 'Please fill out both the Name and Message fields.';
      setFormError(err); showToast(err); return;
    }
    if (phoneInput.trim() && !/^[0-9+\s-]+$/.test(phoneInput.trim())) {
      const err = 'Please enter a valid phone number, or leave it blank.';
      setFormError(err); showToast(err); return;
    }
    
    const textMessage = `NEW APPOINTMENT REQUEST\n👤 Name: ${nameInput.trim()}\n📞 Phone: ${phoneInput.trim() || 'Not provided'}\n\n💬 Message:\n${msgInput.trim()}`;
    window.open(`https://wa.me/251972205858?text=${encodeURIComponent(textMessage)}`, '_blank');
    showToast('Redirecting to WhatsApp...');
    setNameInput(''); setPhoneInput(''); setMsgInput('');
  };

  const handlePhoneClick = (phoneNum: string) => {
    window.location.href = `tel:${phoneNum}`;
    showToast(`Calling Ana Dental Clinic...`);
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ── SERVICES ──
  const services: Service[] = [
    { 
      id: 's1', 
      name: 'Braces (ብሬስ)', 
      code: 'ANA DENTAL', 
      badge: 'ORTHODONTIC', 
      icon: '🦷', 
      desc: 'Advanced orthodontic braces to align teeth, correct bites, and create a perfectly structured smile – tailored for adults and children.', 
      notes: 'Custom treatment plan | Monthly progress checks', 
      delay: 'delay-1',
      image: '/1.jpg'
    },
    { 
      id: 's2', 
      name: 'Root Canal Treatment', 
      code: 'ANA DENTAL', 
      badge: 'ENDODONTIC', 
      icon: '🔬', 
      desc: 'Precision root canal therapy to save severely damaged or infected teeth, performed with modern pain‑free techniques.', 
      notes: 'Pain-free | Single or multi‑visit', 
      delay: 'delay-2',
      image: '/2.jpg'
    },
    { 
      id: 's3', 
      name: 'Teeth Whitening', 
      code: 'ANA DENTAL', 
      badge: 'COSMETIC', 
      icon: '✨', 
      desc: 'Professional whitening using premium imported American products – brighten your smile safely and effectively.', 
      notes: 'American products | Immediate results', 
      delay: 'delay-3',
      image: '/3.jpg'
    },
    { 
      id: 's4', 
      name: 'Crowns (Zirconia / Ceramic / Chrome)', 
      code: 'ANA DENTAL', 
      badge: 'RESTORATIVE', 
      icon: '👑', 
      desc: 'High‑strength crowns in zirconia, ceramic, or chrome – fully customised for durability, function, and natural aesthetics.', 
      notes: 'Multiple material options | Long‑lasting', 
      delay: 'delay-1',
      image: '/4.jpg'
    },
    { 
      id: 's5', 
      name: 'Scaling & Deep Cleaning', 
      code: 'ANA DENTAL', 
      badge: 'PREVENTIVE', 
      icon: '🧼', 
      desc: 'Thorough plaque and tartar removal with modern ultrasonic scaling – essential for gum health and fresh breath.', 
      notes: 'Ultrasonic | Gentle & effective', 
      delay: 'delay-2',
      image: '/5.jpg'
    },
    { 
      id: 's6', 
      name: 'Dentures (ዴንቸር)', 
      code: 'ANA DENTAL', 
      badge: 'PROSTHODONTIC', 
      icon: '😁', 
      desc: 'Custom full and partial dentures to replace missing teeth, restore chewing ability, and revive your natural smile with optimal comfort.', 
      notes: 'Full & partial options | Natural & comfortable fit', 
      delay: 'delay-3',
      image: '/6.jpg'
    },
    { 
      id: 's7', 
      name: 'Veneers & Tooth Jewelry', 
      code: 'ANA DENTAL', 
      badge: 'AESTHETIC', 
      icon: '💎', 
      desc: 'Porcelain veneers for a flawless smile, plus decorative tooth jewellery to add a touch of personality.', 
      notes: 'Stain‑resistant | Custom designs', 
      delay: 'delay-1',
      image: '/7.jpg'
    }
  ];

  // ── Carousel Logic (UNCHANGED) ──
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % services.length);
    }, 4000);
  }, [services.length]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % services.length);
    startTimer();
  }, [startTimer, services.length]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + services.length) % services.length);
    startTimer();
  }, [startTimer, services.length]);

  return (
    <ScrollEngineProvider>
      <>
      <style>{`
        /* ────────── NEW STRUCTURE: Every section is flipped or repositioned ────────── */
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --gold: #E5B94F;
          --gold-light: #F5D98E;
          --gold-dark: #C9A030;
          --navy: #0A1628;
          --navy-light: #1A3355;
          --navy-mid: #152A48;
          --cream: #F8F6F2;
          --bg-light: #F4F6F9;
          --surface-light: #FFFFFF;
          --text-dark: #0A1628;
          --text-dim-dark: rgba(10,22,40,0.55);
          --bg-dark: #060D18;
          --surface-dark: rgba(255,255,255,0.04);
          --text-light: #F4F6F9;
          --text-dim-light: rgba(244,246,249,0.55);
        }

        html, body {
          width: 100%;
          max-width: 100vw;
          overflow-x: hidden;
          font-family: 'Inter', sans-serif;
          transition: background 0.4s ease, color 0.4s ease;
        }

        body {
          background: var(--bg-light);
          color: var(--text-dark);
        }
        body.light-theme {
          --bg: var(--bg-light);
          --bg2: #ffffff;
          --surface: var(--surface-light);
          --border: rgba(10,22,40,0.08);
          --text: var(--text-dark);
          --text-dim: var(--text-dim-dark);
          --shadow: 0 10px 40px rgba(10,22,40,0.08);
        }
        body:not(.light-theme) {
          --bg: var(--bg-dark);
          --bg2: #0A111E;
          --surface: var(--surface-dark);
          --border: rgba(229,185,79,0.15);
          --text: var(--text-light);
          --text-dim: var(--text-dim-light);
          --shadow: 0 10px 40px rgba(0,0,0,0.5);
        }

        /* ── TOAST ── */
        #toast {
          position: fixed; bottom: 32px; left: 50%;
          transform: translateX(-50%) translateY(80px);
          background: var(--gold);
          color: var(--navy);
          padding: 13px 28px; border-radius: 30px;
          z-index: 9999; display: flex; align-items: center; gap: 12px;
          opacity: 0; transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
          pointer-events: none; font-size: 0.83rem; font-weight: 600;
          box-shadow: 0 8px 30px rgba(229,185,79,0.3);
          max-width: calc(100vw - 32px);
        }
        #toast.show { opacity: 1; transform: translateX(-50%) translateY(0); pointer-events: auto; }
        #toast-dismiss {
          background: rgba(10,22,40,0.15); border: none; color: var(--navy);
          padding: 4px 14px; border-radius: 20px; font-size: 0.6rem; cursor: pointer; font-weight: 700;
        }

        #theme-toggle-btn {
          position: fixed; bottom: 28px; right: 28px; z-index: 9999;
          background: var(--gold); border: none; color: var(--navy);
          width: 48px; height: 48px; border-radius: 50%; font-size: 1.2rem;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 20px rgba(229,185,79,0.3);
          transition: transform 0.3s ease;
        }
        #theme-toggle-btn:hover { transform: scale(1.08); }

        /* ── NAVBAR (Tooth + Full Name) ── */
        #navbar {
          position: fixed; top: 0; left: 0; width: 100%; z-index: 1000;
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 48px;
          background: rgba(10,22,40,0.92);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(229,185,79,0.12);
          transition: all 0.3s ease;
        }
        .light-theme #navbar {
          background: rgba(255,255,255,0.92);
          border-bottom: 1px solid rgba(10,22,40,0.06);
        }
        #navbar.scrolled { padding: 10px 48px; }

        .nav-logo { display: flex; align-items: center; gap: 12px; cursor: pointer; }
        .nav-logo .tooth-icon { font-size: 1.8rem; line-height: 1; }
        .nav-logo .brand-text { display: flex; flex-direction: column; line-height: 1.1; }
        .nav-logo .brand-main {
          font-family: 'Playfair Display', serif;
          font-weight: 700; font-size: 1.1rem;
          color: #fff; letter-spacing: 0.5px;
        }
        .light-theme .nav-logo .brand-main { color: var(--navy); }
        .nav-logo .brand-main .gold-accent { color: var(--gold); }
        .nav-logo .brand-sub {
          font-size: 0.5rem; letter-spacing: 2px;
          color: var(--gold); text-transform: uppercase; font-weight: 600;
        }

        .nav-links { display: flex; gap: 32px; align-items: center; }
        .nav-item {
          color: rgba(255,255,255,0.6);
          text-decoration: none; font-size: 0.7rem;
          letter-spacing: 1.5px; font-weight: 600; transition: color 0.2s;
          text-transform: uppercase;
        }
        .light-theme .nav-item { color: rgba(10,22,40,0.5); }
        .nav-item:hover { color: var(--gold); }

        .nav-cta {
          background: var(--gold); color: var(--navy);
          padding: 10px 24px; border-radius: 30px;
          font-size: 0.7rem; font-weight: 700;
          letter-spacing: 1px; border: none; cursor: pointer;
          transition: all 0.3s ease;
        }
        .nav-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(229,185,79,0.3); }

        /* ── HERO (Animation Left, Text Right) ── */
        #hero {
          position: relative; width: 100%; min-height: 92vh;
          display: flex; align-items: center; overflow: hidden;
          background: var(--navy);
          padding: 120px 48px 60px 48px;
        }
        .hero-grid {
          position: relative; z-index: 3;
          display: grid; grid-template-columns: 0.9fr 1.1fr;
          gap: 60px; max-width: 1200px; margin: 0 auto;
          align-items: center; width: 100%;
        }

        .hero-overlay-gradient {
          background: linear-gradient(135deg, rgba(10,22,40,0.5) 0%, rgba(26,51,85,0.3) 60%, rgba(10,22,40,0.6) 100%);
        }

        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(229,185,79,0.15); color: var(--gold);
          padding: 6px 16px; border-radius: 30px;
          font-size: 0.65rem; font-weight: 700; letter-spacing: 2px;
          margin-bottom: 20px; text-transform: uppercase;
        }
        .hero-title {
          font-family: 'Playfair Display', serif;
          font-weight: 400; font-size: clamp(2.8rem, 5.5vw, 4.5rem);
          color: #fff; line-height: 1.08; margin-bottom: 20px;
          text-align: left;
        }
        .hero-title .accent { color: var(--gold); font-weight: 700; }
        .hero-desc {
          font-size: 1rem; line-height: 1.9;
          color: rgba(255,255,255,0.7);
          max-width: 480px; margin-bottom: 32px;
          font-weight: 300;
          text-align: left;
        }
        .hero-btns { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 40px; justify-content: flex-start; }
        .btn-primary {
          background: var(--gold); color: var(--navy);
          padding: 16px 36px; font-size: 0.75rem; font-weight: 700;
          letter-spacing: 1.5px; border-radius: 40px; border: none;
          cursor: pointer; transition: all 0.3s ease;
        }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(229,185,79,0.4); }
        .btn-secondary {
          background: transparent; color: #fff; padding: 16px 36px;
          font-size: 0.75rem; font-weight: 600; letter-spacing: 1.5px;
          border-radius: 40px; border: 1.5px solid rgba(255,255,255,0.2);
          cursor: pointer; transition: all 0.3s ease;
        }
        .btn-secondary:hover { border-color: var(--gold); color: var(--gold); }

        .hero-stats { display: flex; gap: 48px; flex-wrap: wrap; justify-content: flex-start; }
        .hero-stat-num { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 2rem; color: var(--gold); }
        .hero-stat-label { font-size: 0.65rem; color: rgba(255,255,255,0.5); letter-spacing: 1.5px; text-transform: uppercase; margin-top: 2px; }

        /* Hero Visual - NEW Toothbrush Animation */
        .hero-visual {
          display: flex; align-items: center; justify-content: center;
          position: relative;
        }
        .hero-brush-container {
          width: 320px; height: 320px;
          display: flex; align-items: center; justify-content: center;
          position: relative;
          animation: floatSoft 6s ease-in-out infinite;
        }
        @keyframes floatSoft {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .hero-brush-container svg {
          width: 240px;
          height: 240px;
          filter: drop-shadow(0 0 40px rgba(229,185,79,0.15));
        }

        /* ── SECTIONS ── */
        section { padding: clamp(60px, 10vh, 100px) clamp(20px, 5vw, 40px); width: 100%; }
        .section-tag {
          display: inline-block; font-size: 0.6rem; letter-spacing: 4px;
          text-transform: uppercase; color: var(--gold); font-weight: 700;
          margin-bottom: 12px; background: rgba(229,185,79,0.08);
          padding: 4px 14px; border-radius: 30px;
        }
        .section-h2 {
          font-family: 'Playfair Display', serif;
          font-weight: 400; font-size: clamp(2rem, 4vw, 3rem);
          color: var(--text); margin-bottom: 16px;
        }

        /* ── SERVICES CAROUSEL (UNCHANGED MECHANICS, NEW STYLING) ── */
        #services-section { background: var(--bg2); }
        .services-header { text-align: center; margin-bottom: 54px; }
        .services-header p { color: var(--text-dim); font-size: 0.9rem; line-height: 1.8; max-width: 560px; margin: 0 auto; }

        .carousel-wrapper {
          position: relative; width: 100%; max-width: 1200px;
          margin: 0 auto; height: 540px;
          display: flex; align-items: center; justify-content: center;
          overflow: visible;
        }
        .carousel-stage {
          position: relative; width: 100%; height: 100%;
          display: flex; justify-content: center; align-items: center;
          perspective: 1600px;
        }
        .service-card-3d {
          position: absolute;
          width: 310px;
          transition: all 0.7s cubic-bezier(0.23, 1, 0.32, 1);
          backface-visibility: hidden;
          will-change: transform, opacity;
        }
        @media (min-width: 640px) { .service-card-3d { width: 340px; } }
        @media (min-width: 768px) { .service-card-3d { width: 380px; } }

        .service-card-inner {
          background: rgba(10,22,40,0.85);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(229,185,79,0.2);
          border-radius: 24px;
          padding: 28px;
          height: 500px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        }
        .light-theme .service-card-inner {
          background: rgba(255,255,255,0.9);
          border: 1px solid rgba(229,185,79,0.3);
        }
        .service-card-inner:hover { border-color: var(--gold); }

        .service-img-wrap { width: 100%; height: 180px; border-radius: 16px; overflow: hidden; margin-bottom: 18px; border: 1px solid rgba(229,185,79,0.1); flex-shrink: 0; }
        .service-img-wrap img { width: 100%; height: 100%; object-fit: cover; }

        .service-badge-tag { display: inline-block; background: rgba(229,185,79,0.15); color: var(--gold); font-size: 0.55rem; font-weight: 700; letter-spacing: 1.5px; padding: 3px 12px; border-radius: 20px; text-transform: uppercase; margin-bottom: 8px; align-self: flex-start; }
        .service-name-3d { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 1.1rem; color: var(--text); margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; }
        .service-name-3d span { font-size: 1.4rem; }
        .service-desc-3d { font-size: 0.82rem; color: var(--text-dim); line-height: 1.7; flex-grow: 1; }
        .service-notes-3d { font-size: 0.65rem; color: var(--gold); font-weight: 600; letter-spacing: 0.5px; padding-top: 16px; border-top: 1px solid rgba(229,185,79,0.1); margin-top: 12px; }

        .carousel-btn { position: absolute; top: 50%; transform: translateY(-50%); z-index: 40; padding: 14px; border-radius: 50%; background: rgba(10,22,40,0.8); backdrop-filter: blur(8px); border: 1px solid rgba(229,185,79,0.2); color: #fff; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; }
        .carousel-btn:hover { background: var(--gold); color: var(--navy); border-color: var(--gold); }
        .carousel-btn-left { left: 10px; }
        .carousel-btn-right { right: 10px; }
        @media (min-width: 768px) { .carousel-btn-left { left: 20px; } .carousel-btn-right { right: 20px; } }

        .carousel-dots { display: flex; justify-content: center; gap: 8px; margin-top: 24px; }
        .carousel-dot { height: 8px; border-radius: 20px; background: rgba(229,185,79,0.2); transition: all 0.3s; cursor: pointer; border: none; }
        .carousel-dot.active { width: 32px; background: var(--gold); }
        .carousel-dot.inactive { width: 8px; }
        .carousel-dot.inactive:hover { background: rgba(229,185,79,0.4); }

        /* ── ABOUT (Features Left, Video Right) ── NEW POSITION ── */
        #about-section { background: var(--bg); }
        .about-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 60px;
          max-width: 1100px; margin: 0 auto; align-items: center;
        }
        .about-card-premium {
          background: linear-gradient(145deg, var(--navy), var(--navy-mid));
          border: 1px solid rgba(229,185,79,0.2);
          border-radius: 24px; padding: 40px; color: #fff;
          position: relative;
        }
        .about-card-premium::before {
          content: ''; position: absolute; inset: -1px;
          border-radius: 24px; padding: 1px;
          background: linear-gradient(135deg, var(--gold), transparent, var(--gold));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          pointer-events: none;
        }
        .about-card-premium .quote-icon { font-size: 2.8rem; color: var(--gold); margin-bottom: 16px; font-family: 'Playfair Display', serif; }
        .about-card-premium p { font-size: 1rem; line-height: 1.9; color: rgba(255,255,255,0.85); font-style: italic; font-weight: 300; }
        .about-card-premium .author { margin-top: 18px; font-size: 0.8rem; font-weight: 700; color: var(--gold); letter-spacing: 1px; }

        .about-feature-list { display: flex; flex-direction: column; gap: 16px; }
        .about-feature {
          display: flex; align-items: center; gap: 16px; padding: 18px 24px;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 16px; transition: border 0.3s;
        }
        .about-feature:hover { border-color: var(--gold); }
        .about-feature .icon { font-size: 1.6rem; flex-shrink: 0; }
        .about-feature .title { font-weight: 700; font-size: 0.9rem; color: var(--text); }
        .about-feature .sub { font-size: 0.75rem; color: var(--text-dim); }

        /* ── CONTACT (3D STAGE & FLOATING STACK) ── */
        #contact-section {
          position: relative;
          background: linear-gradient(165deg, #0a1628 0%, #060d18 100%);
          padding: 90px 20px 110px 20px;
          overflow: hidden;
          perspective: 1200px;
        }

        .contact-stage-3d {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 5;
          transform-style: preserve-3d;
          transition: transform 0.25s cubic-bezier(0.1, 0.8, 0.2, 1);
        }

        .contact-grid-3d {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
          align-items: center;
        }
        @media (min-width: 900px) {
          .contact-grid-3d {
            grid-template-columns: 1fr 1.05fr;
          }
        }

        .contact-info-col-3d {
          transform-style: preserve-3d;
        }

        .contact-channel-3d {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 24px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(229, 185, 79, 0.22);
          margin-bottom: 16px;
          transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform-style: preserve-3d;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        .contact-channel-3d:hover {
          transform: translateY(-6px) translateZ(25px) rotateX(3deg);
          border-color: var(--gold);
          box-shadow: 0 18px 40px rgba(229, 185, 79, 0.25);
          background: rgba(255, 255, 255, 0.08);
        }

        .channel-icon {
          font-size: 1.6rem;
          flex-shrink: 0;
          line-height: 1;
        }
        .channel-label {
          font-size: 0.65rem;
          color: var(--gold);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          font-weight: 700;
        }
        .channel-val {
          font-size: 0.95rem;
          color: #ffffff;
          font-weight: 600;
        }

        .contact-form-box-3d {
          background: rgba(15, 30, 52, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(229, 185, 79, 0.3);
          border-radius: 28px;
          padding: clamp(28px, 4vw, 44px);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.55), 0 0 35px rgba(229, 185, 79, 0.12);
          transform-style: preserve-3d;
          transition: all 0.4s ease;
          position: relative;
          animation: contactFloat3D 7s ease-in-out infinite;
        }

        @keyframes contactFloat3D {
          0%, 100% { transform: translateY(0px) rotateZ(0deg); }
          50% { transform: translateY(-10px) rotateZ(-0.5deg); }
        }

        .contact-form-box-3d:hover {
          border-color: var(--gold);
          box-shadow: 0 30px 70px rgba(0, 0, 0, 0.7), 0 0 45px rgba(229, 185, 79, 0.25);
        }

        .form-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 24px;
        }
        .form-group { margin-bottom: 20px; }
        .form-label {
          display: block;
          font-size: 0.68rem;
          letter-spacing: 1.2px;
          color: rgba(255, 255, 255, 0.75);
          margin-bottom: 8px;
          font-weight: 600;
          text-transform: uppercase;
        }
        .form-input, .form-textarea {
          width: 100%;
          padding: 15px 20px;
          border-radius: 16px;
          background: rgba(6, 13, 24, 0.75);
          border: 1px solid rgba(229, 185, 79, 0.2);
          color: #ffffff;
          font-size: 0.92rem;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
        }
        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: var(--gold);
          box-shadow: 0 0 0 3px rgba(229, 185, 79, 0.25);
          background: rgba(6, 13, 24, 0.9);
        }
        .form-textarea { min-height: 120px; resize: vertical; }

        .btn-send {
          width: 100%;
          padding: 16px;
          border-radius: 40px;
          border: none;
          background: linear-gradient(135deg, var(--gold), var(--gold-dark));
          color: var(--navy);
          font-size: 0.82rem;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.35s ease;
          box-shadow: 0 10px 25px rgba(229, 185, 79, 0.35);
          transform: translateZ(20px);
        }
        .btn-send:hover {
          transform: translateY(-3px) translateZ(35px) scale(1.02);
          box-shadow: 0 16px 35px rgba(229, 185, 79, 0.55);
          background: linear-gradient(135deg, #f5d98e, var(--gold));
        }

        /* ── ADDRESS (3D ROADMAP WINDING PATHWAY) ── */
        #address-section {
          position: relative;
          overflow: hidden;
          background: #060d18;
          padding: 80px 20px 120px 20px;
          perspective: 1200px;
        }

        .roadmap-container {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 5;
          transition: transform 0.25s cubic-bezier(0.1, 0.8, 0.2, 1);
          transform-style: preserve-3d;
        }

        .roadmap-svg-wrap {
          position: absolute;
          top: 15%;
          left: 5%;
          width: 90%;
          height: 75%;
          pointer-events: none;
          z-index: 2;
        }

        .roadmap-path-bg {
          stroke: rgba(0, 242, 254, 0.12);
          stroke-width: 28;
          fill: none;
          stroke-linecap: round;
        }

        .roadmap-path-glow {
          stroke: url(#roadmapGrad);
          stroke-width: 12;
          fill: none;
          stroke-linecap: round;
          filter: drop-shadow(0 0 16px rgba(0, 242, 254, 0.75));
        }

        .roadmap-path-dash {
          stroke: #ffffff;
          stroke-width: 2;
          fill: none;
          stroke-dasharray: 8 8;
          animation: roadmapDash 18s linear infinite;
          opacity: 0.85;
        }

        @keyframes roadmapDash {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }

        .roadmap-steps {
          display: flex;
          flex-direction: column;
          gap: 40px;
          position: relative;
          z-index: 6;
        }

        @media (min-width: 900px) {
          .roadmap-steps {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 28px;
            align-items: stretch;
          }
        }

        .roadmap-card {
          background: rgba(10, 22, 40, 0.88);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(0, 242, 254, 0.28);
          border-radius: 22px;
          padding: 28px 24px;
          position: relative;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform-style: preserve-3d;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(0, 242, 254, 0.12);
          animation: roadmapFloat 6s ease-in-out infinite;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .roadmap-card:nth-child(2) {
          animation-delay: -2s;
        }
        @media (min-width: 900px) {
          .roadmap-card:nth-child(2) {
            transform: translateY(-24px);
          }
        }
        .roadmap-card:nth-child(3) {
          animation-delay: -4s;
        }

        .roadmap-card:hover {
          transform: translateY(-12px) scale(1.03) translateZ(35px) rotateX(4deg);
          border-color: #00f2fe;
          box-shadow: 0 25px 55px rgba(0, 0, 0, 0.75), 0 0 35px rgba(0, 242, 254, 0.35);
        }

        @keyframes roadmapFloat {
          0%, 100% { transform: translateY(0px) rotateZ(0deg); }
          50% { transform: translateY(-8px) rotateZ(0.5deg); }
        }

        .roadmap-node-badge {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0e2742, #05101c);
          border: 2px solid #00f2fe;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          box-shadow: 0 0 22px rgba(0, 242, 254, 0.55), inset 0 0 12px rgba(0, 242, 254, 0.3);
          margin-bottom: 16px;
          transition: transform 0.3s ease;
          flex-shrink: 0;
        }

        .roadmap-card:hover .roadmap-node-badge {
          transform: scale(1.12) rotate(8deg);
          border-color: #00e676;
          box-shadow: 0 0 32px rgba(0, 230, 118, 0.75);
        }

        .address-card-icon { font-size: 1.6rem; line-height: 1; }
        .map-icon { font-size: 1.6rem; line-height: 1; }

        .address-card-label {
          font-size: 0.65rem;
          color: #00f2fe;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-weight: 700;
          margin-bottom: 6px;
          display: block;
        }

        .address-card-val {
          font-size: 0.88rem;
          color: #ffffff;
          line-height: 1.7;
        }

        .map-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 4px;
        }

        .map-sub {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.75);
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .btn-map-cyan {
          margin-top: auto;
          padding: 12px 26px;
          border-radius: 40px;
          background: linear-gradient(135deg, #00f2fe, #4facfe);
          border: none;
          color: #060d18;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 0 20px rgba(0, 242, 254, 0.4);
        }

        .btn-map-cyan:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 10px 30px rgba(0, 242, 254, 0.65);
          background: linear-gradient(135deg, #00e676, #00f2fe);
        }

        /* ── FOOTER ── */
        footer {
          display: flex; justify-content: space-between; align-items: center;
          padding: 24px 48px; background: var(--navy);
          border-top: 1px solid rgba(229,185,79,0.1);
          flex-wrap: wrap; gap: 16px;
        }
        .footer-copy { font-size: 0.65rem; color: rgba(255,255,255,0.4); }
        .footer-status { display: flex; align-items: center; gap: 8px; }
        .footer-status-dot { width: 6px; height: 6px; background: var(--gold); border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        .footer-status-text { font-size: 0.6rem; color: rgba(255,255,255,0.4); letter-spacing: 2px; }
        .footer-links a { font-size: 0.65rem; color: rgba(255,255,255,0.4); text-decoration: none; }
        .footer-links a:hover { color: var(--gold); }

        /* ── SMOOTH SCROLL-REVEAL SYSTEM ── */
        .reveal, .reveal-up {
          opacity: 0;
          transform: translateY(48px);
          transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .reveal-left {
          opacity: 0;
          transform: translateX(-52px);
          transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .reveal-right {
          opacity: 0;
          transform: translateX(52px);
          transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .reveal-scale {
          opacity: 0;
          transform: scale(0.88) translateY(30px);
          transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .reveal-pop {
          opacity: 0;
          transform: scale(0.82);
          transition: opacity 0.85s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.85s cubic-bezier(0.34, 1.56, 0.64, 1);
          will-change: opacity, transform;
        }

        .reveal.visible,
        .reveal-up.visible,
        .reveal-left.visible,
        .reveal-right.visible,
        .reveal-scale.visible,
        .reveal-pop.visible {
          opacity: 1;
          transform: translateY(0) translateX(0) scale(1);
        }

        .delay-1 { transition-delay: 0.12s; }
        .delay-2 { transition-delay: 0.24s; }
        .delay-3 { transition-delay: 0.36s; }
        .delay-4 { transition-delay: 0.48s; }
        .delay-5 { transition-delay: 0.60s; }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          #navbar { padding: 14px 32px; }
          #hero { padding: 110px 32px 50px 32px; }
          .hero-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
        }

        @media (max-width: 900px) {
          #navbar { padding: 12px 20px; }
          .nav-links { display: none; }
          #hero { padding: 105px 20px 40px 20px; min-height: auto; }
          .hero-grid { grid-template-columns: 1fr; gap: 40px; text-align: center; }
          .hero-visual { order: -1; }
          .hero-desc { margin-left: auto; margin-right: auto; text-align: center; }
          .hero-title { text-align: center; }
          .hero-btns { justify-content: center; }
          .hero-stats { justify-content: center; }
          section { padding: 50px 20px; }
          .about-grid, .contact-grid, .address-grid { grid-template-columns: 1fr; gap: 32px; }
          .about-grid .about-feature-list { order: 1; }
          .about-grid .about-card-premium { order: 2; }
          footer { padding: 20px; flex-direction: column; text-align: center; }
        }

        @media (max-width: 640px) {
          .hero-brush-container { width: 200px; height: 200px; }
          .hero-brush-container svg { width: 160px; height: 160px; }
          .hero-title { font-size: 2.2rem; }
          .hero-stats { gap: 24px; }
          .service-card-inner { height: 440px; padding: 20px; }
          .service-img-wrap { height: 140px; }
          .carousel-wrapper { height: 460px; }
        }
      `}</style>

      <div id="toast" className={toastVisible ? 'show' : ''}>
        <span>✦</span>
        <span>{toastMsg}</span>
        <button id="toast-dismiss" onClick={hideToast}>DISMISS</button>
      </div>

      <button id="theme-toggle-btn" onClick={toggleTheme} title={isLightTheme ? 'Switch to Dark' : 'Switch to Light'}>
        {isLightTheme ? '🌙' : '☀️'}
      </button>

      {/* ══════════ NAVBAR (Tooth + Full Name) ══════════ */}
      <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
        <div className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="tooth-icon">🦷</span>
          <div className="brand-text">
            <span className="brand-main">ANA DENTAL <span className="gold-accent">CLINIC</span></span>
            <span className="brand-sub">ADAMA · NAZARETH</span>
          </div>
        </div>
        <div className="nav-links">
          <a href="#services-section" className="nav-item">Services</a>
          <a href="#about-section" className="nav-item">About</a>
          <a href="#contact-section" className="nav-item">Contact</a>
          <a href="#address-section" className="nav-item">Address</a>
        </div>
        <button className="nav-cta" onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })}>
          Book Now
        </button>
      </nav>

      {/* ══════════ HERO (Toothbrush Animation Left, Text Right) ══════════ */}
      <ScrollReveal variant="perspective-3d" duration="1.2s">
        <section id="hero">
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: heroReady ? 1 : 0, transition: 'opacity 1s ease-in-out', overflow: 'hidden' }}>
            <div id="kena-hero-iframe" style={{ position: 'absolute', top: '50%', left: '50%', width: '1920px', height: '1080px', transform: `translate(-50%, -50%) scale(${heroScale * 1.38}) translateZ(0)`, transformOrigin: 'center center', pointerEvents: 'none', willChange: 'transform' }} />
          </div>

          <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'transparent', pointerEvents: 'auto' }} />
          <div style={{ position: 'absolute', inset: 0, zIndex: 3, background: 'linear-gradient(135deg, rgba(10,22,40,0.6) 0%, rgba(26,51,85,0.3) 55%, rgba(10,22,40,0.7) 100%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', inset: 0, zIndex: 3, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.5) 100%)', pointerEvents: 'none' }} />

          <div className="hero-grid">
            {/* Left: Toothbrush Animation */}
            <div className="hero-visual reveal-left">
              <div className="hero-brush-container">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="toothGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="100%" stopColor="#E2E8F0" />
                    </linearGradient>
                    <linearGradient id="goldGradBrush" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#E5B94F" />
                      <stop offset="100%" stopColor="#C9A030" />
                    </linearGradient>
                  </defs>

                  {/* Tooth Shape */}
                  <path d="M100 30 C75 30 55 45 55 70 C55 90 60 100 65 115 C70 130 72 145 78 155 C82 162 88 165 95 165 C98 165 100 162 100 158 C100 162 102 165 105 165 C112 165 118 162 122 155 C128 145 130 130 135 115 C140 100 145 90 145 70 C145 45 125 30 100 30 Z" fill="url(#toothGrad)" stroke="#D1D5DB" strokeWidth="2" filter="drop-shadow(0 4px 12px rgba(0,0,0,0.1))" />
                  {/* Tooth Shine */}
                  <ellipse cx="80" cy="60" rx="10" ry="15" fill="#FFFFFF" opacity="0.4" transform="rotate(-15, 80, 60)" />

                  {/* Brush Group with Animation */}
                  <g>
                    <animateTransform attributeName="transform" type="translate" values="-12,0; 12,0; -12,0" dur="2s" repeatCount="indefinite" />
                    
                    {/* Brush Handle */}
                    <rect x="160" y="90" width="40" height="12" rx="6" fill="url(#goldGradBrush)" />
                    <rect x="155" y="95" width="10" height="4" rx="2" fill="#C9A030" />
                    
                    {/* Brush Head */}
                    <rect x="185" y="85" width="18" height="22" rx="4" fill="#E5B94F" />
                    
                    {/* Bristles */}
                    <rect x="187" y="82" width="3" height="8" rx="1" fill="#FFFFFF" opacity="0.8" />
                    <rect x="192" y="82" width="3" height="8" rx="1" fill="#FFFFFF" opacity="0.8" />
                    <rect x="197" y="82" width="3" height="8" rx="1" fill="#FFFFFF" opacity="0.8" />
                    <rect x="187" y="92" width="3" height="8" rx="1" fill="#FFFFFF" opacity="0.6" />
                    <rect x="192" y="92" width="3" height="8" rx="1" fill="#FFFFFF" opacity="0.6" />
                    <rect x="197" y="92" width="3" height="8" rx="1" fill="#FFFFFF" opacity="0.6" />
                  </g>
                  
                  {/* Sparkles */}
                  <circle cx="60" cy="30" r="4" fill="#E5B94F" opacity="0.6">
                    <animate attributeName="opacity" values="0.2;1;0.2" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="140" cy="160" r="3" fill="#E5B94F" opacity="0.4">
                    <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
                  </circle>
                </svg>
              </div>
            </div>

            {/* Right: Text Block */}
            <div>
              <h1 className="hero-title reveal-up delay-1">Your Smile, <br /><span className="accent">Our Legacy</span></h1>
              <p className="hero-desc reveal-up delay-2">Ana Dental Clinic – Adama/Nazareth provides expert dental care with modern equipment and a gentle touch, serving you in Amharic and Afaan Oromo.</p>
              <div className="hero-btns reveal-up delay-3">
                <button className="btn-primary" onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })}>
                  Book Appointment →
                </button>
                <button className="btn-secondary" onClick={() => document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' })}>
                  View Services
                </button>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ══════════ SERVICES CAROUSEL ══════════ */}
      <ScrollReveal variant="cinematic-blur" duration="1.4s">
        <section id="services-section">
          <div className="services-header reveal-scale">
            <span className="section-tag">✦ Our Services</span>
            <h2 className="section-h2">Comprehensive Dental Care</h2>
            <p>Explore our specialised treatments – from orthodontics to cosmetic dentistry.</p>
          </div>

          <div className="carousel-wrapper reveal-scale delay-1">
            <button onClick={prevSlide} className="carousel-btn carousel-btn-left" aria-label="Previous">
              <ChevronLeft size={24} />
            </button>

            <div className="carousel-stage">
              {services.map((service, index) => {
                const isActive = index === activeIndex;
                const isLeft = index === (activeIndex - 1 + services.length) % services.length;
                const isRight = index === (activeIndex + 1) % services.length;

                let transformStyle = '';
                let zIndex = 0;
                let opacity = 0;
                let pointerEvents = 'none';

                if (isActive) {
                  transformStyle = 'translateX(0) scale(1) rotateY(0deg)';
                  zIndex = 30;
                  opacity = 1;
                  pointerEvents = 'auto';
                } else if (isLeft) {
                  transformStyle = 'translateX(-75%) scale(0.82) rotateY(16deg)';
                  zIndex = 20;
                  opacity = 0.7;
                  pointerEvents = 'auto';
                } else if (isRight) {
                  transformStyle = 'translateX(75%) scale(0.82) rotateY(-16deg)';
                  zIndex = 20;
                  opacity = 0.7;
                  pointerEvents = 'auto';
                } else {
                  transformStyle = 'translateY(60px) scale(0.7)';
                  zIndex = 0;
                  opacity = 0;
                  pointerEvents = 'none';
                }

                const handleClick = () => {
                  if (isLeft) prevSlide();
                  if (isRight) nextSlide();
                };

                return (
                  <div
                    key={service.id}
                    onClick={handleClick}
                    className="service-card-3d"
                    style={{
                      transform: transformStyle,
                      opacity: opacity,
                      zIndex: zIndex,
                      pointerEvents: pointerEvents as any,
                      cursor: isLeft || isRight ? 'pointer' : 'default',
                    }}
                  >
                    <div className="service-card-inner">
                      <div className="service-img-wrap">
                        <img src={service.image} alt={service.name} referrerPolicy="no-referrer" loading="lazy" />
                      </div>
                      <span className="service-badge-tag">{service.badge}</span>
                      <div className="service-name-3d">
                        {service.name}
                        <span>{service.icon}</span>
                      </div>
                      <p className="service-desc-3d">{service.desc}</p>
                      <div className="service-notes-3d">{service.notes}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button onClick={nextSlide} className="carousel-btn carousel-btn-right" aria-label="Next">
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="carousel-dots reveal-up delay-2">
            {services.map((_, idx) => (
              <button
                key={idx}
                onClick={() => { setActiveIndex(idx); startTimer(); }}
                className={`carousel-dot ${idx === activeIndex ? 'active' : 'inactive'}`}
                aria-label={`Go to service ${idx + 1}`}
              />
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* ══════════ CONTACT (3D Interactive Stage) ══════════ */}
      <ScrollReveal variant="perspective-3d" duration="1.4s">
        <section 
          id="contact-section"
          onMouseMove={handleContactMouseMove}
          onMouseLeave={handleContactMouseLeave}
        >
          <div 
            className="contact-stage-3d"
            style={{
              transform: `perspective(1000px) rotateX(${contactTilt.y}deg) rotateY(${contactTilt.x}deg)`,
            }}
          >
            <div className="contact-grid-3d">
              {/* Info Column (Left) */}
              <div className="contact-info-col-3d reveal-left">
                <span className="section-tag reveal-left" style={{ color: 'var(--gold)', background: 'rgba(229,185,79,0.12)', border: '1px solid rgba(229,185,79,0.25)' }}>✦ Contact & Booking</span>
                <h2 className="section-h2 reveal-left delay-1" style={{ color: '#fff', marginTop: '12px', marginBottom: '16px' }}>Book Your Visit</h2>
                <p className="reveal-left delay-2" style={{ fontSize: '0.9rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.75)', marginBottom: '32px' }}>
                  Reach out to schedule an appointment or ask any questions. We are happy to help care for your smile.
                </p>
                
                <div className="contact-channel-3d reveal-left delay-2">
                  <span className="channel-icon">📞</span>
                  <div>
                    <div className="channel-label">Phone</div>
                    <div className="channel-val">0972205858 / 0902023935</div>
                  </div>
                  <button 
                    onClick={() => handlePhoneClick('0972205858')}
                    style={{ marginLeft: 'auto', background: 'var(--gold)', color: 'var(--navy)', border: 'none', padding: '8px 18px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 15px rgba(229,185,79,0.3)', transition: 'all 0.3s ease' }}
                  >
                    CALL
                  </button>
                </div>

                <div className="contact-channel-3d reveal-left delay-3">
                  <span className="channel-icon">✈️</span>
                  <div>
                    <div className="channel-label">Telegram</div>
                    <div className="channel-val">@anadent12 · Follow Us</div>
                  </div>
                  <button 
                    onClick={() => window.open('https://t.me/anadent12', '_blank')}
                    style={{ marginLeft: 'auto', background: '#229ED9', color: '#ffffff', border: 'none', padding: '8px 18px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 15px rgba(34,158,217,0.3)', transition: 'all 0.3s ease', whiteSpace: 'nowrap' }}
                  >
                    TELEGRAM CHANNEL
                  </button>
                </div>

                <div className="contact-channel-3d reveal-left delay-4">
                  <span className="channel-icon">📍</span>
                  <div>
                    <div className="channel-label">Location</div>
                    <div className="channel-val">Near Adama National Building, Tana Mestawet, 1st floor</div>
                  </div>
                </div>
              </div>

              {/* Interactive 3D Form Card (Right) */}
              <div className="contact-form-box-3d reveal-right delay-2">
                <div className="form-title reveal-up delay-1">Send a Message</div>
                {formError && (
                  <div style={{ color: '#ef4444', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.85rem' }}>
                    ⚠️ {formError}
                  </div>
                )}
                <div className="form-group reveal-up delay-2">
                  <label className="form-label">Your Name *</label>
                  <input className="form-input" type="text" placeholder="Enter your name" value={nameInput} onChange={e => { setNameInput(e.target.value); if (formError) setFormError(''); }} />
                </div>
                <div className="form-group reveal-up delay-3">
                  <label className="form-label">Phone <span style={{ fontWeight: 'normal', opacity: 0.6 }}>(Optional)</span></label>
                  <input className="form-input" type="tel" placeholder="Your phone number" value={phoneInput} onChange={e => { setPhoneInput(e.target.value); if (formError) setFormError(''); }} />
                </div>
                <div className="form-group reveal-up delay-4">
                  <label className="form-label">Message *</label>
                  <textarea className="form-textarea" placeholder="What would you like to book or ask about?" value={msgInput} onChange={e => { setMsgInput(e.target.value); if (formError) setFormError(''); }} />
                </div>
                <button className="btn-send reveal-up delay-5" onClick={sendMsg}>Send Message →</button>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ══════════ ABOUT (Features Left, Video Right) ══════════ */}
      <ScrollReveal variant="cinematic-blur" duration="1.3s">
        <section id="about-section">
          <div className="about-grid">
            <div className="about-feature-list reveal-left">
              <div className="about-feature reveal-left delay-1">
                <span className="icon">🏆</span>
                <div>
                  <div className="title">Specialist Team</div>
                  <div className="sub">Orthodontic specialists and experienced dentists</div>
                </div>
              </div>
              <div className="about-feature reveal-left delay-2">
                <span className="icon">🧼</span>
                <div>
                  <div className="title">Sterile Environment</div>
                  <div className="sub">Modern hygiene protocols for your safety</div>
                </div>
              </div>
              <div className="about-feature reveal-left delay-3">
                <span className="icon">💬</span>
                <div>
                  <div className="title">Bilingual Care</div>
                  <div className="sub">Service in Amharic and Afaan Oromo</div>
                </div>
              </div>
            </div>

            <div className="about-card-premium reveal-right delay-2">
              <div className="quote-icon">"</div>
              <p>At Ana Dental Clinic – Adama/Nazareth, we combine modern dental technology with compassionate, patient‑centred care.</p>
              <div className="author">— Dr. Lamrot Afework</div>

              <div style={{ marginTop: '24px', width: '100%', height: '180px', borderRadius: '16px', overflow: 'hidden', position: 'relative', background: '#000', border: '1px solid rgba(229,185,79,0.2)' }}>
                <div id="kena-comingsoon-iframe" style={{ position: 'absolute', top: '50%', left: '50%', width: '300%', height: '300%', transform: 'translate(-50%, -50%) scale(0.6)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', inset: 0, zIndex: 3, background: 'transparent', pointerEvents: 'auto' }} />
                <div style={{ position: 'absolute', bottom: '12px', left: '14px', zIndex: 4, pointerEvents: 'none' }}>
                  <span style={{ fontSize: '0.6rem', letterSpacing: '2px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', fontWeight: 600, background: 'rgba(0,0,0,0.5)', padding: '4px 12px', borderRadius: '6px' }}>Ana Dental Clinic</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ══════════ ADDRESS (3D Roadmap Winding Path) ══════════ */}
      <ScrollReveal variant="perspective-3d" duration="1.4s">
        <section 
          id="address-section"
          onMouseMove={handleAddressMouseMove}
          onMouseLeave={handleAddressMouseLeave}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', zIndex: 1, opacity: 0.25 }}>
            <div id="kena-address-iframe" style={{ position: 'absolute', top: '50%', left: '50%', width: '130%', height: '130%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }} />
          </div>
          <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'radial-gradient(ellipse at 50% 50%, rgba(0,242,254,0.08) 0%, rgba(6,13,24,0.95) 75%)', pointerEvents: 'none' }} />

          {/* 3D Roadmap SVG Track */}
          <div className="roadmap-svg-wrap reveal">
            <svg width="100%" height="100%" viewBox="0 0 1000 400" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
              <defs>
                <linearGradient id="roadmapGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00e676" />
                  <stop offset="50%" stopColor="#00f2fe" />
                  <stop offset="100%" stopColor="#4facfe" />
                </linearGradient>
                <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Winding road path */}
              <path d="M 80,320 C 280,320 250,120 500,200 C 750,280 720,80 920,80" className="roadmap-path-bg" />
              <path d="M 80,320 C 280,320 250,120 500,200 C 750,280 720,80 920,80" className="roadmap-path-glow" />
              <path d="M 80,320 C 280,320 250,120 500,200 C 750,280 720,80 920,80" className="roadmap-path-dash" />

              {/* Glowing Arrow at destination */}
              <g transform="translate(920, 80) rotate(-15)">
                <polygon points="-12,-16 20,0 -12,16 -4,0" fill="#00f2fe" filter="url(#neonGlow)" />
              </g>

              {/* Animated Light Pulse traveling down the path */}
              <circle r="6" fill="#ffffff" filter="url(#neonGlow)">
                <animateMotion path="M 80,320 C 280,320 250,120 500,200 C 750,280 720,80 920,80" dur="4s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>

          {/* Interactive 3D Tilting Container */}
          <div 
            className="roadmap-container"
            style={{
              transform: `perspective(1000px) rotateX(${addressTilt.y}deg) rotateY(${addressTilt.x}deg)`,
            }}
          >
            <div className="services-header reveal-scale" style={{ color: '#fff', marginBottom: '50px' }}>
              <span className="section-tag" style={{ color: '#00f2fe', background: 'rgba(0,242,254,0.12)', border: '1px solid rgba(0,242,254,0.25)' }}>✦ Location</span>
              <h2 className="section-h2" style={{ color: '#fff' }}>Find Our Clinic</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>Visit us in Adama. We are open every day to take care of your smile.</p>
            </div>

            <div className="roadmap-steps">
              {/* Node 1: Clinic Address */}
              <div className="roadmap-card reveal-scale delay-1">
                <div className="roadmap-node-badge">
                  <span className="address-card-icon">🏥</span>
                </div>
                <span className="address-card-label">Clinic Address</span>
                <div className="address-card-val">
                  Adama, Tana Mestawet<br />1st floor, near National Building
                </div>
              </div>

              {/* Node 2: Call Us */}
              <div className="roadmap-card reveal-scale delay-2">
                <div className="roadmap-node-badge">
                  <span className="address-card-icon">📞</span>
                </div>
                <span className="address-card-label">Call Us</span>
                <div className="address-card-val">
                  0972205858<br />0902023935
                </div>
              </div>

              {/* Node 3: Map Box */}
              <div className="roadmap-card reveal-scale delay-3">
                <div className="roadmap-node-badge">
                  <span className="map-icon">🦷</span>
                </div>
                <div className="map-title">Ana Dental Clinic – Adama/Nazareth</div>
                <div className="map-sub">Near Adama National Building, Tana Mestawet, 1st floor</div>
                <button className="btn-map-cyan" onClick={() => window.open('https://maps.google.com/?q=Adama+National+Building+Tana+Mestawet+Adama+Ethiopia', '_blank')}>
                  Open in Google Maps →
                </button>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ══════════ FOOTER ══════════ */}
      <ScrollReveal variant="slide-up-fade" duration="1.0s">
        <footer className="reveal-up">
          <div className="footer-copy reveal-up delay-1">© 2026 Ana Dental Clinic – Adama/Nazareth · All rights reserved.</div>
          <div className="footer-status reveal-up delay-2">
            <div className="footer-status-dot" />
            <span className="footer-status-text">Clinic Open · Adama</span>
          </div>
          <div className="footer-links reveal-up delay-3"><a href="#contact-section">Contact</a></div>
        </footer>
      </ScrollReveal>
      </>
    </ScrollEngineProvider>
  );
}
