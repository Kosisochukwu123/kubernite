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


export default function RoleSplit() {
  const [ref, visible] = useInView();
  const roles = [
    {
      icon:"⚙️", label:"PERFORMANCE",
      color: G.lime,
      desc:"Engineering teams get granular cluster and pod-level cost breakdowns they can act on immediately.",
      sub:"Engineering",
    },
    {
      icon:"💲", label:"SPENDING",
      color: G.limeMid,
      desc:"Finance teams get clean budget reports, trend charts, and variance analysis — no Kubernetes knowledge required.",
      sub:"Finance",
    },
  ];
  return (
    <section ref={ref} style={{ background:`${G.lime}0a`, padding:"80px 24px" }}>
      <div style={{ maxWidth:960, margin:"0 auto" }}>
        <div style={{ ...styles.fadeUp(visible), textAlign:"center", marginBottom:48 }}>
          <h2 style={{ fontSize:30, fontWeight:900, letterSpacing:-1 }}>Built for every team</h2>
          <p style={{ color:G.muted, marginTop:8 }}>One platform, two lenses. Engineering precision. Finance clarity.</p>
        </div>
        <div style={{ display:"flex", gap:24, flexWrap:"wrap", justifyContent:"center" }}>
          {roles.map((r,i)=>(
            <div key={i} style={{
              ...styles.scaleIn(visible, i*0.15),
              ...styles.card,
              flex:"1 1 280px", maxWidth:340, textAlign:"center",
            }}>
              <div style={{
                width:72, height:72, borderRadius:18, background:r.color,
                display:"flex", alignItems:"center", justifyContent:"center",
                margin:"0 auto 16px", fontSize:32,
                boxShadow:`0 8px 24px ${r.color}66`,
              }}>{r.icon}</div>
              <div style={{ fontWeight:900, fontSize:18, letterSpacing:1, marginBottom:10 }}>{r.label}</div>
              <p style={{ color:G.muted, fontSize:13, lineHeight:1.6, marginBottom:20 }}>{r.desc}</p>
              <span style={{ ...styles.tag, background:r.color }}>{r.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}