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


export default function SavingsSection() {
  const [ref, visible] = useInView();
  const savings = [
    { label:"Right-size your cluster nodes",      val:"$2204.35 /mo" },
    { label:"Right-size your container requests", val:"$1704.84 /mo" },
    { label:"Remedy abandoned workloads",         val:"$1122.42 /mo" },
    { label:"Reserve instances",                  val:"$982.15 /mo" },
  ];
  return (
    <section ref={ref} style={{ background:`${G.lime}0a`, padding:"80px 24px" }}>
      <div style={{ maxWidth:960, margin:"0 auto" }}>
        <div style={{ ...styles.fadeUp(visible), textAlign:"center", marginBottom:48 }}>
          <span style={styles.chip}>OPTIMIZATION INSIGHTS</span>
          <h2 style={{ fontSize:30, fontWeight:900, marginTop:14, letterSpacing:-1 }}>
            Find your savings — fast
          </h2>
          <p style={{ color:G.muted, marginTop:8 }}>
            Kubecost surfaces actionable recommendations your engineering team can act on today.
          </p>
        </div>

        <div style={{ display:"flex", gap:24, flexWrap:"wrap", justifyContent:"center", alignItems:"flex-start" }}>
          {/* Savings card */}
          <div style={{ ...styles.scaleIn(visible, 0.1), ...styles.card, maxWidth:320, flex:"1 1 280px" }}>
            {/* Corner dots */}
            {["top-left","top-right","bottom-left","bottom-right"].map(pos=>(
              <div key={pos} style={{
                position:"absolute",
                top: pos.includes("top") ? -6 : "auto",
                bottom: pos.includes("bottom") ? -6 : "auto",
                left: pos.includes("left") ? -6 : "auto",
                right: pos.includes("right") ? -6 : "auto",
                width:12, height:12, borderRadius:"50%", background:"#cde8d8", border:`2px solid ${G.border}`,
              }}/>
            ))}
            <div style={{ position:"relative" }}>
              <div style={{
                textAlign:"center", border:`1px solid ${G.lime}`, borderRadius:12, padding:"14px 16px", marginBottom:14,
              }}>
                <div style={{ fontSize:12, color:G.muted, marginBottom:4 }}>Estimated monthly savings available</div>
                <div style={{ fontSize:28, fontWeight:900, color:G.limeMid }}>$6013.76</div>
              </div>
              {savings.map((s,i)=>(
                <div key={i} style={{
                  display:"flex", justifyContent:"space-between", alignItems:"center",
                  border:`1px solid ${G.border}`, borderRadius:10, padding:"10px 14px", marginBottom:8,
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateX(0)" : "translateX(-20px)",
                  transition: `all 0.5s ease ${0.3+i*0.1}s`,
                }}>
                  <span style={{ fontSize:11, color:G.muted, maxWidth:140, lineHeight:1.3 }}>{s.label}</span>
                  <span style={{ ...styles.chip, fontSize:11, padding:"5px 10px", whiteSpace:"nowrap" }}>{s.val}</span>
                </div>
              ))}
            </div>
            <div style={{ textAlign:"center", marginTop:16 }}>
              <span style={styles.tag}>ENGINEERING</span>
            </div>
          </div>

          {/* Finance chart */}
          <div style={{ ...styles.scaleIn(visible, 0.25), ...styles.card, maxWidth:320, flex:"1 1 280px" }}>
            <div style={{ fontSize:13, color:G.muted, marginBottom:16, fontWeight:600 }}>Spending Trend</div>
            <div style={{ display:"flex", gap:6, alignItems:"flex-end", height:120, marginBottom:16 }}>
              {[60,40,80,55,90,75,95,65,85,70,88,60].map((h,i)=>(
                <div key={i} style={{
                  flex:1, borderRadius:"4px 4px 0 0",
                  background: i===10 ? G.lime : `${G.lime}55`,
                  height: visible ? `${h}%` : "0%",
                  transition: `height 0.7s ease ${0.4+i*0.04}s`,
                  position:"relative",
                }}>
                  {i===10 && (
                    <div style={{
                      position:"absolute", top:-24, left:"50%", transform:"translateX(-50%)",
                      background:G.ink, color:"#fff", borderRadius:4, fontSize:9, padding:"2px 5px", whiteSpace:"nowrap",
                    }}>Peak</div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ textAlign:"center", marginTop:16 }}>
              <span style={styles.tag}>FINANCE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}