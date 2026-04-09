import { useState, useEffect, useRef } from "react";

// ── Utility: useInView hook ──────────────────────────────────────────────────
function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

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

// ── Shared styles ────────────────────────────────────────────────────────────
const styles = {
  page: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    background: G.bg,
    color: G.ink,
    overflowX: "hidden",
  },
  section: {
    padding: "80px 24px",
    maxWidth: 960,
    margin: "0 auto",
  },
  fadeUp: (visible, delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(40px)",
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  }),
  scaleIn: (visible, delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "scale(1)" : "scale(0.85)",
    transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
  }),
  card: {
    background: G.surface,
    borderRadius: 20,
    border: `1px solid ${G.border}`,
    padding: "24px",
    boxShadow: "0 4px 24px rgba(82,232,154,0.08)",
  },
  chip: {
    background: G.lime,
    color: G.ink,
    borderRadius: 8,
    padding: "6px 14px",
    fontWeight: 700,
    fontSize: 13,
    display: "inline-block",
  },
  tag: {
    background: G.limeMid,
    color: "#fff",
    borderRadius: 10,
    padding: "10px 20px",
    fontWeight: 800,
    fontSize: 14,
    letterSpacing: 1,
    display: "inline-block",
  },
};

export default function HeroSection( {Logo} ) {
  const [ref, visible] = useInView(0.1);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1800);
    return () => clearInterval(id);
  }, []);
  const currencies = ["€","¥","£","$","₣"];
  return (
    <section ref={ref} style={{
      minHeight:"100vh", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      background:`radial-gradient(ellipse at 60% 40%, ${G.lime}22 0%, transparent 70%), ${G.bg}`,
      textAlign:"center", padding:"40px 24px", position:"relative", overflow:"hidden",
    }}>
      {/* Floating currency icons */}
      {currencies.map((c,i)=>(
        <div key={c} style={{
          position:"absolute",
          left: `${15 + i*18}%`,
          top: `${30 + (i%2===0?5:-5)}%`,
          opacity: visible ? 0.18 + (i%3)*0.08 : 0,
          transform: visible ? `translateY(${Math.sin(tick*0.3+i)*12}px)` : "translateY(30px)",
          transition: `opacity 1s ease ${i*0.15}s, transform 0.8s ease ${i*0.15}s`,
          fontSize: 28+i*4,
          color: G.limeMid,
          fontWeight:900,
          filter:"blur(0.5px)",
          userSelect:"none",
          pointerEvents:"none",
        }}>{c}</div>
      ))}

      <div style={styles.fadeUp(visible, 0.1)}>
        <Logo size={42}/>
      </div>

      <h1 style={{
        ...styles.fadeUp(visible, 0.25),
        fontSize:"clamp(36px,6vw,72px)",
        fontWeight:900,
        lineHeight:1.1,
        margin:"28px 0 16px",
        letterSpacing:-2,
        maxWidth:700,
      }}>
        Know exactly what your<br/>
        <span style={{color:G.limeMid}}>Kubernetes costs.</span>
      </h1>

      <p style={{
        ...styles.fadeUp(visible, 0.4),
        fontSize:18, color:G.muted, maxWidth:480, lineHeight:1.65, margin:"0 auto 36px",
      }}>
        Real-time cost monitoring, optimization insights, and savings recommendations — all in one platform.
      </p>

      <div style={{...styles.fadeUp(visible, 0.55), display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center"}}>
        <button style={{
          background:G.lime, color:G.ink, border:"none", borderRadius:12,
          padding:"14px 28px", fontWeight:800, fontSize:16, cursor:"pointer",
          boxShadow:`0 6px 20px ${G.lime}66`,
          transition:"transform 0.2s, box-shadow 0.2s",
        }}
          onMouseEnter={e=>{e.target.style.transform="scale(1.04)";e.target.style.boxShadow=`0 10px 28px ${G.lime}88`}}
          onMouseLeave={e=>{e.target.style.transform="scale(1)";e.target.style.boxShadow=`0 6px 20px ${G.lime}66`}}
        >Get Started Free</button>
        <button style={{
          background:"transparent", color:G.ink, border:`2px solid ${G.border}`,
          borderRadius:12, padding:"14px 28px", fontWeight:700, fontSize:16, cursor:"pointer",
          transition:"border-color 0.2s",
        }}
          onMouseEnter={e=>e.target.style.borderColor=G.lime}
          onMouseLeave={e=>e.target.style.borderColor=G.border}
        >View Demo</button>
      </div>

      {/* Animated green block */}
      <div style={{
        ...styles.scaleIn(visible, 0.7),
        width:48, height:48, background:G.lime, borderRadius:12,
        marginTop:56, boxShadow:`0 12px 36px ${G.lime}66`,
        animation: visible ? "pulse 2.5s ease-in-out infinite" : "none",
      }}/>

      <style>{`
        @keyframes pulse {
          0%,100%{transform:scale(1);box-shadow:0 12px 36px ${G.lime}66;}
          50%{transform:scale(1.08);box-shadow:0 16px 48px ${G.lime}99;}
        }
      `}</style>
    </section>
  );
}