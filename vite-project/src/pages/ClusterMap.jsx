import ClusterDrilldown from "./common/ClusterDrilldown.jsx";

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


export default function ClusterMap( {OctNode}) {
  return (
    // <div style={styles.page}>
       <section> 
        <ClusterDrilldown OctNode={OctNode} />
       </section> 
    // </div>
   )  
  }
