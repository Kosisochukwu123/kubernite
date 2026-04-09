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


export default function BillReconciliation() {
  const [ref, visible] = useInView();
  return (
    <section ref={ref} style={{ ...styles.section }}>
      <div style={{ ...styles.fadeUp(visible), textAlign:"center", marginBottom:48 }}>
        <span style={styles.chip}>BILLING RECONCILIATION</span>
        <h2 style={{ fontSize:30, fontWeight:900, marginTop:14, letterSpacing:-1 }}>
          Connect your cloud bill
        </h2>
        <p style={{ color:G.muted, marginTop:8 }}>
          Kubecost maps your internal cost data directly to your cloud provider bill — no more mystery charges.
        </p>
      </div>

      <div style={{
        display:"flex", gap:32, alignItems:"center", justifyContent:"center", flexWrap:"wrap",
      }}>
        {/* Left: Kubecost data panel */}
        <div style={{ ...styles.scaleIn(visible, 0.1), ...styles.card, maxWidth:280, flex:"1 1 240px" }}>
          <div style={{ fontSize:12, color:G.muted, marginBottom:12, fontWeight:700 }}>KUBECOST DATA</div>
          <div style={{ display:"flex", gap:6, alignItems:"flex-end", height:80, marginBottom:12 }}>
            {[90,40,60,35,55].map((h,i)=>(
              <div key={i} style={{
                flex:1, borderRadius:"4px 4px 0 0",
                background: i===0?G.lime:i===2?G.limeMid:`${G.lime}66`,
                height: visible ? `${h}%` : "0%",
                transition:`height 0.6s ease ${i*0.08}s`,
              }}/>
            ))}
          </div>
          <div style={{ fontSize:10, color:G.muted }}>
            {[["$79.95","$3.75","$45.80","$7.06","$2.87","$0.69","$147.97"],
              ["$8.29","$12.30","$0.57","$18.23","$18.17","$9.69","$89.58"],
              ["$58.00","$87.70","$12.10","$0.46","$12.21","$1.05","$47.77"]].map((row,r)=>(
              <div key={r} style={{display:"flex",gap:6,justifyContent:"space-between",marginBottom:2}}>
                <div style={{width:12,height:6,borderRadius:2,background:r===0?G.lime:r===1?G.limeMid:"#cde",marginTop:2}}/>
                {row.map((v,j)=><span key={j} style={{fontSize:9}}>{v}</span>)}
              </div>
            ))}
          </div>
        </div>

        {/* Arrow */}
        <div style={{
          ...styles.fadeUp(visible, 0.3),
          display:"flex", flexDirection:"column", alignItems:"center", gap:4,
        }}>
          <div style={{ width:60, height:2, background:`linear-gradient(to right, ${G.lime}, ${G.limeDark})`, borderRadius:2 }}/>
          <span style={{ fontSize:10, color:G.muted }}>reconciled</span>
        </div>

        {/* Right: Cloud bill */}
        <div style={{ ...styles.scaleIn(visible, 0.2), ...styles.card, maxWidth:240, flex:"1 1 200px", textAlign:"center" }}>
          <div style={{ fontSize:24, marginBottom:4 }}>☁️</div>
          <div style={{ fontWeight:900, fontSize:22, color:G.muted, letterSpacing:3, marginBottom:12 }}>BILL</div>
          <div style={{ fontSize:11, color:G.muted, marginBottom:4, fontWeight:600 }}>Cloud Services</div>
          <div style={{ height:1, background:G.border, margin:"6px 0" }}/>
          <div style={{ height:1, background:G.border, margin:"6px 0" }}/>
          <div style={{ display:"flex", justifyContent:"flex-end", alignItems:"center", gap:6, marginTop:8 }}>
            <span style={{ fontSize:12, color:G.muted }}>Total:</span>
            <span style={{ ...styles.chip, fontSize:13 }}>$$$</span>
          </div>
          <div style={{ height:1, background:G.border, margin:"10px 0" }}/>
          <div style={{ height:1, background:G.border, margin:"6px 0" }}/>
        </div>
      </div>
    </section>
  );
}