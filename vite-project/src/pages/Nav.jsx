
import { useState, useEffect, useRef } from "react";

// ── Colour tokens ────────────────────────────────────────────────────────────
const G = {
  lime:    "#52e89a",
  limeMid: "#3dd180",
  limeDark:"#1a9956",
  bg:      "#f4f6f4",
  surface: "#ffffff",
  ink:     "#0e2a1f",
  muted:   "#7a9e8e",
  border:  "#d6ede1",
};



const NAV_LINKS = ["Pricing", "Docs", "Blog"];


export default function Nav( {Logo} ) {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 40);
      // close menu on scroll
      if (window.scrollY > 40) setMenuOpen(false);
    };
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const fn = (e) => {
      if (!e.target.closest(".kc-nav")) setMenuOpen(false);
    };
    document.addEventListener("click", fn);
    return () => document.removeEventListener("click", fn);
  }, [menuOpen]);

  const navBg = scrolled || menuOpen
    ? "rgba(244,246,244,0.96)"
    : "transparent";

  return (
    <>
      <style>{`
        /* ── Nav shell ── */
        .kc-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 200;
          transition: background 0.35s, border-color 0.35s, box-shadow 0.35s;
        }

        /* ── Top row ── */
        .kc-nav-bar {
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 clamp(16px, 4vw, 32px);
          box-sizing: border-box;
        }

        /* ── Desktop links ── */
        .kc-nav-links {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .kc-nav-link {
          color: ${G.ink};
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          opacity: 0.72;
          transition: opacity 0.18s;
        }
        .kc-nav-link:hover { opacity: 1; }

        .kc-nav-cta {
          background: ${G.lime};
          color: ${G.ink};
          border: none;
          border-radius: 10px;
          padding: 8px 18px;
          font-weight: 800;
          font-size: 13px;
          cursor: pointer;
          transition: transform 0.18s, box-shadow 0.18s;
          box-shadow: 0 3px 12px ${G.lime}55;
        }
        .kc-nav-cta:hover {
          transform: scale(1.04);
          box-shadow: 0 5px 18px ${G.lime}88;
        }

        /* ── Hamburger button — hidden on desktop ── */
        .kc-hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 36px;
          height: 36px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 8px;
          transition: background 0.2s;
        }
        .kc-hamburger:hover { background: ${G.lime}22; }

        .kc-hamburger span {
          display: block;
          height: 2px;
          border-radius: 2px;
          background: ${G.ink};
          transition: transform 0.3s ease, opacity 0.3s ease, width 0.3s ease;
          transform-origin: center;
        }

        /* X state */
        .kc-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .kc-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .kc-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* ── Mobile drawer ── */
        .kc-mobile-menu {
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.38s cubic-bezier(0.4, 0, 0.2, 1),
                      opacity 0.28s ease;
          opacity: 0;
          background: rgba(244,246,244,0.98);
          border-top: 1px solid ${G.border};
          backdrop-filter: blur(14px);
        }
        .kc-mobile-menu.open {
          max-height: 260px;
          opacity: 1;
        }

        .kc-mobile-links {
          display: flex;
          flex-direction: column;
          padding: 16px clamp(16px, 4vw, 32px) 20px;
          gap: 2px;
        }

        .kc-mobile-link {
          display: block;
          color: ${G.ink};
          text-decoration: none;
          font-size: 16px;
          font-weight: 600;
          padding: 10px 0;
          border-bottom: 1px solid ${G.border};
          opacity: 0.8;
          transition: opacity 0.18s, padding-left 0.18s;
        }
        .kc-mobile-link:last-of-type { border-bottom: none; }
        .kc-mobile-link:hover { opacity: 1; padding-left: 6px; }

        .kc-mobile-cta {
          display: block;
          width: 100%;
          margin-top: 12px;
          background: ${G.lime};
          color: ${G.ink};
          border: none;
          border-radius: 12px;
          padding: 13px 20px;
          font-weight: 800;
          font-size: 15px;
          cursor: pointer;
          box-shadow: 0 4px 16px ${G.lime}55;
          text-align: center;
          transition: transform 0.18s;
        }
        .kc-mobile-cta:hover { transform: scale(1.02); }

        /* ── Responsive breakpoint ── */
        @media (max-width: 640px) {
          .kc-nav-links   { display: none; }
          .kc-hamburger   { display: flex; }
        }

        @media (min-width: 641px) {
          .kc-mobile-menu { display: none !important; }
        }
      `}</style>

      <nav
        className="kc-nav"
        style={{
          background: navBg,
          backdropFilter: scrolled || menuOpen ? "blur(14px)" : "none",
          borderBottom: scrolled || menuOpen ? `1px solid ${G.border}` : "none",
          boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.05)" : "none",
        }}
      >
        {/* ── Top row ── */}
        <div className="kc-nav-bar">
          <Logo size={22} />

          {/* Desktop links */}
          <div className="kc-nav-links">
            {NAV_LINKS.map(l => (
              <a key={l} href="#" className="kc-nav-link">{l}</a>
            ))}
            <button className="kc-nav-cta">Get Started</button>
          </div>

          {/* Hamburger */}
          <button
            className={`kc-hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span style={{ width: "22px" }} />
            <span style={{ width: "16px" }} />
            <span style={{ width: "22px" }} />
          </button>
        </div>

        {/* ── Mobile drawer ── */}
        <div className={`kc-mobile-menu${menuOpen ? " open" : ""}`}>
          <div className="kc-mobile-links">
            {NAV_LINKS.map(l => (
              <a key={l} href="#" className="kc-mobile-link"
                onClick={() => setMenuOpen(false)}>{l}</a>
            ))}
            <button className="kc-mobile-cta"
              onClick={() => setMenuOpen(false)}>Get Started Free →</button>
          </div>
        </div>
      </nav>
    </>
  );
}
