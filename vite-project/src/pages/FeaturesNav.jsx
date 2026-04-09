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


export default function FeaturesNav( {Logo} ) {
  const [ref, visible] = useInView();
  const [active, setActive] = useState(0);
  const features = [
    { icon:"📊", label:"Cost monitoring", desc:"See exactly where every dollar goes across clusters, namespaces, and pods." },
    { icon:"💡", label:"Optimization insights", desc:"AI-powered recommendations that surface savings automatically." },
    { icon:"🔔", label:"Alerts", desc:"Budget alerts and anomaly detection so surprises never hit your cloud bill." },
  ];
  return (
    <section ref={ref} style={{ ...styles.section, textAlign:"center" }}>
      <div style={styles.fadeUp(visible)}>
        <Logo size={32}/>
        <h2 style={{ fontSize:32, fontWeight:900, margin:"20px 0 8px", letterSpacing:-1 }}>
          Three tools. One mission.
        </h2>
        <p style={{ color:G.muted, marginBottom:40 }}>Cut cloud costs without slowing your team.</p>
      </div>
      <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
        {features.map((f,i)=>(
          <div key={i}
            onClick={()=>setActive(i)}
            style={{
              ...styles.fadeUp(visible, i*0.12),
              ...styles.card,
              width:220, cursor:"pointer",
              border: active===i ? `2px solid ${G.lime}` : `1px solid ${G.border}`,
              background: active===i ? `${G.lime}18` : G.surface,
              transform: active===i ? "scale(1.04)" : "scale(1)",
              transition:"all 0.35s",
            }}>
            <div style={{
              width:64,height:64,borderRadius:16,
              background: active===i ? G.lime : "#e8f5ef",
              display:"flex",alignItems:"center",justifyContent:"center",
              margin:"0 auto 14px", fontSize:28,
              transition:"background 0.3s",
            }}>{f.icon}</div>
            <div style={{fontWeight:700,fontSize:15,marginBottom:8}}>{f.label}</div>
            <div style={{color:G.muted,fontSize:13,lineHeight:1.5}}>{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}