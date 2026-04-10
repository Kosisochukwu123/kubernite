import { useState, useEffect, useRef, useCallback } from "react";
import "./ClusterDrilldown.css";

const WINDOW = "30d";

// Utility functions
const fmt = (n) => (n == null ? "$0" : n);
const fmtEff = (n) => (n == null ? "-" : n);

function rowsToBars(rows) {
  if (!rows || rows.length === 0) return [];
  const totals = rows.map((r) => {
    const total = parseInt(String(r.total).replace(/[$,]/g, "")) || 0;
    return total;
  });
  const max = Math.max(...totals, 1);

  return rows.map((r) => {
    const total = parseInt(String(r.total).replace(/[$,]/g, "")) || 0;
    return {
      label: r.name?.length > 20 ? r.name.substring(0, 20) + "..." : r.name,
      height: Math.max(4, Math.min(100, Math.round((total / max) * 100))),
      fullLabel: r.name,
      total: total,
      originalRow: r,
    };
  });
}

async function fetchClusterData(
  proxyUrl,
  clusterName = null,
  namespaceName = null,
) {
  const url = `${proxyUrl}/api/cluster-drilldown`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    let currentData = data;

    if (clusterName) {
      const clusterIndex = currentData.rows.findIndex(
        (r) => r.name === clusterName,
      );
      if (
        clusterIndex !== -1 &&
        currentData.children &&
        currentData.children[clusterIndex]
      ) {
        currentData = currentData.children[clusterIndex];

        if (namespaceName && currentData.children) {
          const namespaceIndex = currentData.rows.findIndex(
            (r) => r.name === namespaceName,
          );
          if (namespaceIndex !== -1 && currentData.children[namespaceIndex]) {
            currentData = currentData.children[namespaceIndex];
          }
        }
      }
    }

    return currentData;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("Request timeout - please try again");
    }
    throw err;
  }
}

// Bar Component
function Bar({ bar, index, clickable, onClick }) {
  const [grown, setGrown] = useState(false);
  const rafRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(() => {
      timerRef.current = setTimeout(() => setGrown(true), index * 65);
    });
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [index]);

  return (
    <div
      className={`cd-bar-col${clickable ? " clickable" : ""}`}
      onClick={clickable ? onClick : undefined}
      title={clickable ? `Drill into ${bar.fullLabel || bar.label}` : undefined}
    >
      <div
        className="cd-bar"
        style={{ height: grown ? `${bar.height}%` : "0%" }}
      />
      <span className="cd-bar-label">{bar.label}</span>
    </div>
  );
}

// Table Row Component
function TableRow({ row, index }) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(
      () => setVisible(true),
      Math.min(index * 50 + 80, 500),
    );
    return () => clearTimeout(timerRef.current);
  }, [index]);

  const effPct = parseInt(String(row.eff), 10) || 0;

  return (
    <tr className={visible ? "row-visible" : "row-hidden"}>
      <td className="cell-ink" title={row.name}>
        {row.name}
      </td>
      <td className="cell-muted">{row.cpu}</td>
      <td className="cell-muted">{row.ram}</td>
      <td className="cell-muted">{row.storage}</td>
      <td className="cell-muted col-net">{row.net}</td>
      <td className="cell-muted col-gpu">{row.gpu}</td>
      <td className={effPct >= 40 ? "cell-eff-good" : "cell-eff-bad"}>
        {row.eff}
      </td>
      <td className="cell-total">{row.total}</td>
    </tr>
  );
}

// Breadcrumb Component
function BreadcrumbPill({ text, aggregatedBy }) {
  const [show, setShow] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => setShow(true), 120);
    return () => clearTimeout(timerRef.current);
  }, []);

  const parts = text.split(" > ");

  return (
    <div className="cd-breadcrumb-wrap">
      <div className={`cd-breadcrumb-pill ${show ? "visible" : "hidden"}`}>
        {parts.map((p, i) => (
          <span key={i} className="cd-breadcrumb-seg">
            {i > 0 && <span className="cd-breadcrumb-sep"> › </span>}
            <span
              className={
                i === parts.length - 1
                  ? "cd-breadcrumb-last"
                  : "cd-breadcrumb-prev"
              }
            >
              {p}
            </span>
          </span>
        ))}
      </div>

      <div className={`cd-tooltip ${show ? "visible" : "hidden"}`}>
        <span className="cd-tooltip-label">Aggregated by: </span>
        <span className="cd-tooltip-value">{aggregatedBy}</span>
      </div>
    </div>
  );
}

// Skeleton Components
function SkeletonRows({ count = 4 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="row-visible">
          {Array.from({ length: 8 }).map((__, j) => (
            <td key={j}>
              <div
                className="cd-skeleton"
                style={{ width: j === 0 ? "80px" : "50px" }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function SkeletonBars({ count = 4 }) {
  const heights = [85, 60, 45, 25];
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="cd-bar-col">
          <div
            className="cd-skeleton cd-bar-skeleton"
            style={{ height: `${heights[i] || 30}%` }}
          />
          <div
            className="cd-skeleton"
            style={{ width: 48, height: 9, marginTop: 4 }}
          />
        </div>
      ))}
    </>
  );
}

// Main Component
export default function ClusterDrilldown() {
  // Connection config
  const [proxyUrl, setProxyUrl] = useState(
    import.meta.env.VITE_API_URL || "http://localhost:5000",
  );
  const [configured, setConfigured] = useState(false);
  const [urlInput, setUrlInput] = useState(
    import.meta.env.VITE_API_URL || "http://localhost:5000",
  );

  // Nav stack
  const [navStack, setNavStack] = useState([
    {
      depth: 0,
      cluster: null,
      namespace: null,
      label: "All Clusters",
      aggregatedBy: "Cluster",
    },
  ]);

  // Data state
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [animKey, setAnimKey] = useState(0);

  const current = navStack[navStack.length - 1];
  const depth = current.depth;
  const isLeaf = depth >= 2;

  // Load data
  const load = useCallback(async () => {
    if (!configured) return;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchClusterData(
        proxyUrl,
        current.cluster,
        current.namespace,
      );
      setData(result);
      setAnimKey((k) => k + 1);
    } catch (e) {
      setError(e.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [configured, proxyUrl, current.cluster, current.namespace]);

  useEffect(() => {
    load();
  }, [load]);

  // Navigation
  const drillInto = (rowIndex) => {
    if (isLeaf || !data?.children?.[rowIndex]) return;

    const row = data.rows[rowIndex];
    if (!row) return;

    const nextDepth = depth + 1;
    let nextState = { depth: nextDepth, label: row.name };

    if (depth === 0) {
      nextState.cluster = row.name;
      nextState.namespace = null;
      nextState.aggregatedBy = "Namespace";
    } else if (depth === 1) {
      nextState.cluster = current.cluster;
      nextState.namespace = row.name;
      nextState.aggregatedBy = "Pod";
    }

    setNavStack((s) => [...s, nextState]);
  };

  const goBack = () => {
    if (navStack.length <= 1) return;
    setNavStack((s) => s.slice(0, -1));
  };

  const goToDepth = (d) => {
    if (d >= navStack.length - 1) return;
    setNavStack((s) => s.slice(0, d + 1));
  };

  const crumbText = navStack.map((f) => f.label).join(" > ");
  const currentAggregatedBy =
    current.aggregatedBy || data?.aggregatedBy || "Cluster";
  const bars = data?.bars || (data?.rows ? rowsToBars(data.rows) : []);
  const rows = data?.rows || [];

  // Setup Screen
  if (!configured) {
    return (
      <section className="cd-section">
        <div className="cd-setup-wrap">
          <div className="cd-setup-card">
            <div className="cd-setup-icon">🔌</div>
            <h3 className="cd-setup-title">Connect to Kubecost</h3>
            <p className="cd-setup-desc">
              Enter the URL of your backend server (default:
              http://localhost:5000)
            </p>
            <div className="cd-setup-row">
              <input
                className="cd-setup-input"
                type="url"
                placeholder="http://localhost:5000"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
            </div>
            <div className="cd-setup-row" style={{ marginTop: 8 }}>
              <button
                className="cd-setup-btn"
                onClick={() => {
                  setProxyUrl(urlInput.replace(/\/$/, ""));
                  setConfigured(true);
                }}
              >
                Connect →
              </button>
            </div>
            <p className="cd-setup-hint">
              Make sure your backend is running: <code>node server.js</code>
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Main View
  return (
    <section className="cd-section">
      <div className="cd-intro">
        <span className="cd-chip">LIVE DATA • {proxyUrl}</span>
        <h2>Drill into any cost, anywhere</h2>
        <p>Click any bar to explore cluster → namespace → pod.</p>
      </div>

      <div className="cd-card-wrap">
        <div className="cd-card">
          {/* Top bar */}
          <div className="cd-topbar">
            <div className="cd-topbar-left">
              {navStack.length > 1 && (
                <button className="cd-back-btn" onClick={goBack}>
                  ← Back
                </button>
              )}
              <span className="cd-date-pill">Last 30 Days</span>
              <button
                className="cd-back-btn"
                onClick={() => {
                  setConfigured(false);
                  setNavStack([
                    {
                      depth: 0,
                      cluster: null,
                      namespace: null,
                      label: "All Clusters",
                      aggregatedBy: "Cluster",
                    },
                  ]);
                }}
                title="Change connection"
              >
                🔌 Reconnect
              </button>
            </div>

            <BreadcrumbPill
              key={`bc-${animKey}`}
              text={crumbText}
              aggregatedBy={currentAggregatedBy}
            />
          </div>

          {/* Depth stepper */}
          <div className="cd-stepper">
            {["Clusters", "Namespaces", "Pods"].map((label, i) => (
              <div key={i} className="cd-stepper-item">
                <div
                  className={`cd-stepper-dot ${i < depth ? "past" : i === depth ? "current" : "future"}`}
                  onClick={() => goToDepth(i)}
                />
                <span
                  className={`cd-stepper-label${i === depth ? " current" : ""}`}
                >
                  {label}
                </span>
                {i < 2 && (
                  <div
                    className={`cd-stepper-line${i < depth ? " filled" : ""}`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Error banner */}
          {error && (
            <div className="cd-error">
              <span>⚠️ {error}</span>
              <button onClick={load}>Retry</button>
            </div>
          )}

          {/* Bar chart */}
          <div className="cd-chart">
            {[0, 33, 66, 100].map((pct) => (
              <div
                key={pct}
                className="cd-gridline"
                style={{ top: `${100 - pct}%` }}
              />
            ))}
            {loading ? (
              <SkeletonBars count={4} />
            ) : (
              bars
                .slice(0, 8)
                .map((bar, i) => (
                  <Bar
                    key={`${animKey}-bar-${i}`}
                    bar={bar}
                    index={i}
                    clickable={!isLeaf && data?.children?.[i]}
                    onClick={() => drillInto(i)}
                  />
                ))
            )}
          </div>

          {!isLeaf && !loading && rows.length > 0 && (
            <p className="cd-hint">↑ Click a bar to drill down</p>
          )}

          {/* Table */}
          <div className="cd-table-wrap">
            <table className="cd-table">
              <thead>
                <tr>
                  <th>Resource</th>
                  <th>CPU</th>
                  <th>RAM</th>
                  <th>Storage</th>
                  <th className="col-net">Network</th>
                  <th className="col-gpu">GPU</th>
                  <th>Efficiency</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <SkeletonRows count={4} />
                ) : rows.length === 0 && !error ? (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        color: "#7a9e8e",
                      }}
                    >
                      No data available
                    </td>
                  </tr>
                ) : (
                  rows.map((row, i) => (
                    <TableRow key={`${animKey}-row-${i}`} row={row} index={i} />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Export button */}
          {!loading && rows.length > 0 && (
            <div
              style={{
                padding: "12px 0 0",
                borderTop: "1px solid var(--cd-border)",
                marginTop: "12px",
              }}
            >
              <button
                className="cd-back-btn"
                onClick={() => {
                  const csv = [
                    [
                      "Resource",
                      "CPU",
                      "RAM",
                      "Storage",
                      "Network",
                      "GPU",
                      "Efficiency",
                      "Total",
                    ],
                    ...rows.map((r) => [
                      r.name,
                      r.cpu,
                      r.ram,
                      r.storage,
                      r.net,
                      r.gpu,
                      r.eff,
                      r.total,
                    ]),
                  ]
                    .map((row) => row.join(","))
                    .join("\n");
                  const blob = new Blob([csv], { type: "text/csv" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `cost-data-${Date.now()}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                📥 Export CSV
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
