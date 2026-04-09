import BillReconciliation from "./pages/BillReconciliation";
import ClusterMap from "./pages/ClusterMap";
import CTASection from "./pages/CTASection";
import FeaturesNav from "./pages/FeaturesNav";
import HeroSection from "./pages/HeroSection";
// import PodDrilldown from "./pages/PodDrilldown";
import RoleSplit from "./pages/RoleSplit";
import SavingsSection from "./pages/SavingsSection";
import Nav from "./pages/Nav";



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

// ── KubecostLogo ─────────────────────────────────────────────────────────────
function Logo({ size = 28 }) {
  return (
    <span style={{ display:"flex", alignItems:"center", gap:8 }}>
      <svg width={size} height={size} viewBox="0 0 40 40">
        <ellipse cx="20" cy="14" rx="9" ry="12" fill="none" stroke={G.lime} strokeWidth="2.5" transform="rotate(-30 20 14)"/>
        <ellipse cx="20" cy="14" rx="9" ry="12" fill="none" stroke={G.lime} strokeWidth="2.5" transform="rotate(30 20 14)"/>
        <circle cx="20" cy="20" r="4" fill={G.lime}/>
      </svg>
      <span style={{ fontWeight:800, fontSize: size*0.85, color: G.ink, letterSpacing:-0.5 }}>kubecost</span>
    </span>
  );
}

// ── Hexagon SVG ───────────────────────────────────────────────────────────────
function Hex({ size=22, fill="#fff", stroke=G.lime }) {
  const pts = Array.from({length:6},(_,i)=>{
    const a = (Math.PI/3)*i - Math.PI/6;
    return `${size/2+size/2*Math.cos(a)},${size/2+size/2*Math.sin(a)}`;
  }).join(" ");
  return (
    <svg width={size} height={size} style={{display:"block"}}>
      <polygon points={pts} fill={fill} stroke={stroke} strokeWidth="1.5"/>
    </svg>
  );
}

// ── Octagon node ─────────────────────────────────────────────────────────────
function OctNode({ pods=2, active=false, label="" }) {
  const c = active ? G.lime : "#e8f5ef";
  const border = active ? G.limeDark : G.muted;
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
      <div style={{
        width:90, height:90, borderRadius:"50%",
        background: c,
        border: `3px solid ${border}`,
        display:"flex", flexWrap:"wrap", gap:4,
        alignItems:"center", justifyContent:"center",
        padding:12,
        boxShadow: active ? `0 0 24px ${G.lime}88` : "none",
        transition:"all 0.4s",
      }}>
        {Array.from({length:pods}).map((_,i)=>(
          <Hex key={i} size={18} fill={active?"#fff":"#c8e8d8"} stroke={active?G.limeDark:G.muted}/>
        ))}
      </div>
      {label && <span style={{fontSize:12,fontWeight:700,color:G.ink}}>{label}</span>}
    </div>
  );
}


// ── Nav ───────────────────────────────────────────────────────────────────────


// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={styles.page}>
      <Nav
       Logo={Logo}
      />
      <HeroSection
       Logo={Logo}
      />
      <FeaturesNav
       Logo={Logo}
      />
      <ClusterMap
       OctNode={OctNode}
      />
      {/* <PodDrilldown/> */}
      <SavingsSection/>
      <BillReconciliation/>
      <RoleSplit/>
      <CTASection
       Logo={Logo}
      />
      <footer style={{
        textAlign:"center", padding:"32px 24px",
        borderTop:`1px solid ${G.border}`,
        color:G.muted, fontSize:12,
      }}>
        © 2026 Kubecost · <a href="#" style={{color:G.limeDark}}>Privacy</a> · <a href="#" style={{color:G.limeDark}}>Terms</a>
      </footer>
    </div>
  );
}
