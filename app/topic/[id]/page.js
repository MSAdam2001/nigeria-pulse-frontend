"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-NG", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function Skeleton({ h = 20, w = "100%", mb = 0 }) {
  return (
    <div style={{ height: h, width: w, background: "linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: 6, marginBottom: mb }} />
  );
}

const SOURCE_DOMAINS = {
  "Punch Nigeria": "punchng.com",
  "Vanguard Nigeria": "vanguardngr.com",
  "Premium Times": "premiumtimesng.com",
  "Channels TV": "channelstv.com",
  "Daily Trust": "dailytrust.com",
  "Nairametrics": "nairametrics.com",
  "BBC Africa": "bbc.com",
  "BusinessDay Nigeria": "businessday.ng",
  "The Cable": "thecable.ng",
  "Sahara Reporters": "saharareporters.com",
  "ThisDay": "thisdaylive.com",
  "Leadership Nigeria": "leadership.ng",
  "Sun Nigeria": "sunnewsonline.com",
  "Tribune Nigeria": "tribuneonlineng.com",
  "Al Jazeera": "aljazeera.com",
};

function getFavicon(source) {
  const domain = SOURCE_DOMAINS[source];
  if (!domain) return null;
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
}

export default function TopicDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const accentColors = ["#008751", "#2563eb", "#dc2626", "#d97706", "#7c3aed"];
  const color = accentColors[parseInt(id)] || "#008751";

  useEffect(() => {
    if (id === undefined || id === null) return;
    fetch(`${API}/api/topic/${id}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
        else setError(json.error || "Topic not found");
      })
      .catch(() => setError("Connection error."))
      .finally(() => setLoading(false));
  }, [id]);

  const topic = data?.topic;
  const articles = data?.articles || [];
  const relatedAlerts = data?.related_alerts || [];
  const sentiment = data?.sentiment_breakdown || {};
  const sentimentTotal = (sentiment.positive || 0) + (sentiment.negative || 0) + (sentiment.neutral || 0);
  const sentimentPct = (val) => sentimentTotal > 0 ? Math.round((val / sentimentTotal) * 100) : 0;

  const sources = [...new Set(articles.map(a => a.source))];
  const filtered = activeFilter === "all" ? articles : articles.filter(a => a.source === activeFilter);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Source Serif 4', Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,700&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .article-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important; transform: translateY(-2px); }
        .article-card { transition: box-shadow 0.2s, transform 0.2s; }
        .filter-btn:hover { background: #f1f5f9 !important; }
        .back-btn:hover { color: #111827 !important; }

        .page-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 28px;
          align-items: start;
        }

        .articles-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }

        @media (max-width: 960px) {
          .page-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 640px) {
          .hero-section { padding: 28px 16px 24px !important; }
          .main-section { padding: 20px 16px 60px !important; }
          .hero-title { font-size: 26px !important; }
          .stats-row { gap: 8px !important; }
          .filter-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 4px; }
          .filter-scroll::-webkit-scrollbar { display: none; }
        }
      `}</style>

      {/* TOP NAV */}
      <header style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(14px)", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 100, padding: "0 16px" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button onClick={() => router.push("/")} className="back-btn"
              style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: "13px", fontFamily: "inherit", padding: "5px 0" }}>
              ← Back
            </button>
            <span style={{ color: "#d1d5db" }}>|</span>
            <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: "#008751", flexShrink: 0 }} />
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "15px", fontWeight: 800, color: "#111827" }}>Nigeria <span style={{ color: "#008751" }}>Pulse</span></span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "10px", color: "#6b7280", background: "#f1f5f9", border: "1px solid #e5e7eb", borderRadius: "20px", padding: "3px 10px", letterSpacing: "0.06em" }}>TOPIC #{parseInt(id) + 1} OF 5</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "#dcfce7", border: "1px solid #86efac", borderRadius: "20px", padding: "3px 9px" }}>
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#16a34a", display: "inline-block", animation: "pulse 1.5s infinite" }} />
              <span style={{ fontSize: "9px", color: "#15803d", fontWeight: 700, letterSpacing: "0.1em" }}>LIVE</span>
            </span>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      {loading ? (
        <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "40px 24px" }}>
          <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
            <Skeleton h={12} w="140px" mb={20} />
            <Skeleton h={44} w="75%" mb={14} />
            <Skeleton h={18} w="90%" mb={8} />
            <Skeleton h={18} w="80%" mb={0} />
          </div>
        </div>
      ) : error ? (
        <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "80px 24px", textAlign: "center" }}>
          <p style={{ fontSize: "16px", color: "#dc2626", marginBottom: "16px" }}>⚠️ {error}</p>
          <button onClick={() => router.push("/")} style={{ background: "#008751", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 24px", cursor: "pointer", fontSize: "14px", fontFamily: "inherit" }}>← Go Home</button>
        </div>
      ) : topic ? (
        <div className="hero-section" style={{ background: `linear-gradient(160deg, ${color}06 0%, #fff 50%)`, borderBottom: "1px solid #e5e7eb", padding: "40px 24px 32px", position: "relative", overflow: "hidden" }}>
          {/* Background watermark */}
          <div style={{ position: "absolute", right: "-20px", top: "50%", transform: "translateY(-50%)", fontFamily: "'Playfair Display', serif", fontSize: "180px", fontWeight: 800, color: `${color}05`, pointerEvents: "none", userSelect: "none", letterSpacing: "-0.05em", lineHeight: 1, whiteSpace: "nowrap" }}>
            {String(parseInt(id) + 1).padStart(2, "0")}
          </div>

          <div style={{ maxWidth: "1140px", margin: "0 auto", position: "relative", zIndex: 1, animation: "fadeUp 0.5s ease" }}>
            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "20px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "10px", fontWeight: 700, background: color, color: "#fff", borderRadius: "5px", padding: "3px 9px", letterSpacing: "0.1em", textTransform: "uppercase" }}>#{parseInt(id) + 1} Trending</span>
              {topic.category && <span style={{ fontSize: "10px", color: "#6b7280", background: "#f1f5f9", border: "1px solid #e5e7eb", borderRadius: "5px", padding: "3px 9px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{topic.category}</span>}
              {topic.in_govt_agenda && <span style={{ fontSize: "10px", background: "#dcfce7", color: "#15803d", border: "1px solid #86efac", borderRadius: "20px", padding: "3px 8px", fontWeight: 600 }}>Govt Agenda</span>}
              {topic.foreign_impact && <span style={{ fontSize: "10px", background: "#fef3c7", color: "#92400e", border: "1px solid #fcd34d", borderRadius: "20px", padding: "3px 8px", fontWeight: 600 }}>Global Impact</span>}
              {topic.sentiment && (
                <span style={{ fontSize: "10px", background: topic.sentiment === "positive" ? "#dcfce7" : topic.sentiment === "negative" ? "#fee2e2" : "#f1f5f9", color: topic.sentiment === "positive" ? "#15803d" : topic.sentiment === "negative" ? "#b91c1c" : "#475569", borderRadius: "20px", padding: "3px 8px", fontWeight: 600, textTransform: "capitalize" }}>
                  {topic.sentiment === "positive" ? "↑" : topic.sentiment === "negative" ? "↓" : "→"} {topic.sentiment} sentiment
                </span>
              )}
            </div>

            {/* Main headline */}
            <h1 className="hero-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 4vw, 48px)", fontWeight: 800, color: "#111827", lineHeight: 1.08, marginBottom: "18px", letterSpacing: "-0.025em", maxWidth: "820px" }}>
              <span style={{ color, fontStyle: "italic" }}>{topic.name}</span>
            </h1>

            {/* Lead summary */}
            <p style={{ fontSize: "clamp(15px, 1.5vw, 18px)", color: "#374151", lineHeight: 1.8, maxWidth: "760px", marginBottom: "20px", borderLeft: `4px solid ${color}`, paddingLeft: "18px", fontStyle: "italic" }}>
              {topic.summary}
            </p>

            {/* Sentiment reason */}
            {topic.sentiment_reason && (
              <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "22px", maxWidth: "680px", lineHeight: 1.6 }}>
                <strong style={{ color: "#374151" }}>AI Analysis:</strong> {topic.sentiment_reason}
              </p>
            )}

            {/* Stats bar */}
            <div className="stats-row" style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", marginBottom: "18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "7px 13px" }}>
                <span style={{ fontSize: "10px", color: "#9ca3af", letterSpacing: "0.08em" }}>INTENSITY</span>
                <div style={{ width: "56px", height: "4px", background: "#e5e7eb", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ width: `${topic.intensity * 10}%`, height: "100%", background: topic.intensity >= 8 ? "#dc2626" : topic.intensity >= 5 ? "#d97706" : "#16a34a", borderRadius: "2px" }} />
                </div>
                <span style={{ fontSize: "12px", fontWeight: 700, color: topic.intensity >= 8 ? "#dc2626" : topic.intensity >= 5 ? "#d97706" : "#16a34a" }}>{topic.intensity}/10</span>
              </div>
              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "7px 13px" }}>
                <span style={{ fontSize: "10px", color: "#9ca3af", letterSpacing: "0.08em" }}>ARTICLES </span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>{articles.length}</span>
              </div>
              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "7px 13px" }}>
                <span style={{ fontSize: "10px", color: "#9ca3af", letterSpacing: "0.08em" }}>SOURCES </span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>{sources.length}</span>
              </div>
              {data?.confidence && (
                <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "7px 13px" }}>
                  <span style={{ fontSize: "10px", color: "#9ca3af", letterSpacing: "0.08em" }}>AI CONFIDENCE </span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#008751" }}>{Math.round(data.confidence * 100)}%</span>
                </div>
              )}
              {data?.generated_at && (
                <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "7px 13px" }}>
                  <span style={{ fontSize: "10px", color: "#9ca3af", letterSpacing: "0.08em" }}>UPDATED </span>
                  <span style={{ fontSize: "11px", color: "#6b7280" }}>{timeAgo(data.generated_at)}</span>
                </div>
              )}
            </div>

            {/* Keywords */}
            {topic.keywords?.length > 0 && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: "10px", color: "#9ca3af", letterSpacing: "0.08em" }}>KEYWORDS:</span>
                {topic.keywords.map((kw, i) => (
                  <span key={i} style={{ fontSize: "11px", background: color + "12", border: `1px solid ${color}22`, color, borderRadius: "4px", padding: "2px 8px", fontWeight: 600 }}>{kw}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* DIVIDER LINE — like a newspaper */}
      <div style={{ height: "3px", background: `linear-gradient(90deg, ${color} 0%, ${color}40 60%, transparent 100%)` }} />

      {/* MAIN CONTENT */}
      {!loading && !error && topic && (
        <main className="main-section" style={{ maxWidth: "1140px", margin: "0 auto", padding: "28px 24px 80px" }}>
          <div className="page-grid">

            {/* LEFT COLUMN — Articles feed */}
            <div>
              {/* Section header + filter */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "12px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                  NEWS COVERAGE ({filtered.length} articles)
                </h2>
                {data?.generated_at && (
                  <span style={{ fontSize: "11px", color: "#9ca3af" }}>{formatDate(data.generated_at)}</span>
                )}
              </div>

              {/* Source filter pills */}
              {sources.length > 1 && (
                <div className="filter-scroll" style={{ display: "flex", gap: "6px", marginBottom: "18px", flexWrap: "nowrap" }}>
                  <button className="filter-btn" onClick={() => setActiveFilter("all")}
                    style={{ padding: "5px 12px", borderRadius: "20px", border: `1.5px solid ${activeFilter === "all" ? color : "#e5e7eb"}`, background: activeFilter === "all" ? color + "12" : "#fff", color: activeFilter === "all" ? color : "#6b7280", fontSize: "11px", fontWeight: activeFilter === "all" ? 700 : 400, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0 }}>
                    All ({articles.length})
                  </button>
                  {sources.map(src => (
                    <button key={src} className="filter-btn" onClick={() => setActiveFilter(src)}
                      style={{ padding: "5px 12px", borderRadius: "20px", border: `1.5px solid ${activeFilter === src ? color : "#e5e7eb"}`, background: activeFilter === src ? color + "12" : "#fff", color: activeFilter === src ? color : "#6b7280", fontSize: "11px", fontWeight: activeFilter === src ? 700 : 400, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0 }}>
                      {src.replace("YouTube — ", "").replace(" Nigeria", "")} ({articles.filter(a => a.source === src).length})
                    </button>
                  ))}
                </div>
              )}

              {/* Articles */}
              {filtered.length === 0 ? (
                <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "14px", padding: "48px", textAlign: "center" }}>
                  <p style={{ color: "#9ca3af", fontSize: "14px" }}>No articles found for this topic in the last 4 hours.</p>
                </div>
              ) : (
                <div className="articles-grid">
                  {filtered.map((article, i) => (
                    <a key={i} href={article.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                      <div className="article-card" style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "14px", overflow: "hidden", cursor: "pointer" }}>
                        {/* Color accent top */}
                        <div style={{ height: "3px", background: i === 0 ? color : "#f1f5f9" }} />
                        <div style={{ padding: "18px 20px" }}>
                          {/* Source row */}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              {getFavicon(article.source) && (
                                <img src={getFavicon(article.source)} alt="" width="16" height="16" style={{ borderRadius: "3px" }} onError={e => e.target.style.display = "none"} />
                              )}
                              <span style={{ fontSize: "11px", fontWeight: 700, color, letterSpacing: "0.04em" }}>{article.source}</span>
                              <span style={{ fontSize: "10px", color: "#9ca3af", background: "#f9fafb", border: "1px solid #f3f4f6", borderRadius: "4px", padding: "1px 6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>{article.category?.replace("_", " ")}</span>
                            </div>
                            <span style={{ fontSize: "11px", color: "#9ca3af" }}>{timeAgo(article.published_at)}</span>
                          </div>

                          {/* Headline */}
                          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: i === 0 ? "19px" : "16px", fontWeight: i === 0 ? 700 : 600, color: "#111827", lineHeight: 1.4, marginBottom: article.summary ? "8px" : 0, letterSpacing: "-0.01em" }}>
                            {article.title}
                          </h3>

                          {/* Summary */}
                          {article.summary && article.summary.length > 10 && (
                            <p style={{ fontSize: "13px", color: "#4b5563", lineHeight: 1.65, margin: "0 0 10px" }}>
                              {article.summary.slice(0, 220)}{article.summary.length > 220 ? "…" : ""}
                            </p>
                          )}

                          {/* Read more */}
                          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <span style={{ fontSize: "11px", color, fontWeight: 600 }}>Read full story</span>
                            <span style={{ fontSize: "11px", color }}>→</span>
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN — Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

              {/* Sentiment breakdown */}
              {sentimentTotal > 0 && (
                <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "14px", padding: "18px 20px" }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "11px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "14px" }}>PUBLIC SENTIMENT</h3>
                  {[
                    { label: "Positive", value: sentiment.positive || 0, color: "#16a34a", bg: "#dcfce7", icon: "↑" },
                    { label: "Negative", value: sentiment.negative || 0, color: "#dc2626", bg: "#fee2e2", icon: "↓" },
                    { label: "Neutral", value: sentiment.neutral || 0, color: "#d97706", bg: "#fef3c7", icon: "→" },
                  ].map(item => (
                    <div key={item.label} style={{ marginBottom: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "12px", color: item.color, fontWeight: 700 }}>{item.icon}</span>
                          <span style={{ fontSize: "12px", color: "#374151" }}>{item.label}</span>
                        </div>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: item.color }}>{sentimentPct(item.value)}%</span>
                      </div>
                      <div style={{ height: "5px", background: "#f3f4f6", borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{ width: `${sentimentPct(item.value)}%`, height: "100%", background: item.color, borderRadius: "3px" }} />
                      </div>
                    </div>
                  ))}
                  <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "6px" }}>Based on {sentimentTotal} articles analyzed</p>
                </div>
              )}

              {/* Sources covering this */}
              {sources.length > 0 && (
                <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "14px", padding: "18px 20px" }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "11px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "14px" }}>SOURCES COVERING THIS</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {sources.map((src, i) => {
                      const count = articles.filter(a => a.source === src).length;
                      const pct = Math.round((count / articles.length) * 100);
                      return (
                        <div key={i}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              {getFavicon(src) && <img src={getFavicon(src)} alt="" width="14" height="14" style={{ borderRadius: "2px" }} onError={e => e.target.style.display = "none"} />}
                              <span style={{ fontSize: "12px", color: "#374151" }}>{src.replace(" Nigeria", "").replace("YouTube — ", "")}</span>
                            </div>
                            <span style={{ fontSize: "11px", color: "#9ca3af" }}>{count} article{count !== 1 ? "s" : ""}</span>
                          </div>
                          <div style={{ height: "3px", background: "#f3f4f6", borderRadius: "2px", overflow: "hidden" }}>
                            <div style={{ width: `${pct}%`, height: "100%", background: color + "60", borderRadius: "2px" }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Global alerts related */}
              {relatedAlerts.length > 0 && (
                <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "14px", padding: "18px 20px" }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "11px", fontWeight: 700, color: "#ea580c", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "14px" }}>🌍 GLOBAL IMPACT</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {relatedAlerts.map((alert, i) => (
                      <div key={i} style={{ borderTop: i > 0 ? "1px solid #fed7aa" : "none", paddingTop: i > 0 ? "12px" : 0 }}>
                        <p style={{ fontSize: "12px", fontWeight: 700, color: "#c2410c", marginBottom: "4px", lineHeight: 1.4 }}>{alert.event}</p>
                        <p style={{ fontSize: "12px", color: "#78350f", lineHeight: 1.55, margin: 0 }}>{alert.nigeria_impact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sources cited by AI */}
              {topic?.sources_cited?.length > 0 && (
                <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "14px", padding: "18px 20px" }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "11px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "12px" }}>AI CITED SOURCES</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                    {topic.sources_cited.map((s, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: color, flexShrink: 0 }} />
                        <span style={{ fontSize: "12px", color: "#374151" }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Engine info */}
              {data?.engine_used && (
                <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "14px", padding: "14px 18px" }}>
                  <p style={{ fontSize: "10px", color: "#9ca3af", letterSpacing: "0.1em", marginBottom: "4px" }}>POWERED BY</p>
                  <p style={{ fontSize: "13px", color: "#374151", fontWeight: 600 }}>{data.engine_used}</p>
                  {data.confidence && <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>{Math.round(data.confidence * 100)}% confidence score</p>}
                </div>
              )}

              {/* Back button */}
              <button onClick={() => router.push("/")}
                style={{ width: "100%", padding: "12px", background: "#008751", color: "#fff", border: "none", borderRadius: "10px", fontSize: "14px", fontFamily: "'Playfair Display', serif", fontWeight: 700, cursor: "pointer", letterSpacing: "0.03em", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#006b41"}
                onMouseLeave={e => e.currentTarget.style.background = "#008751"}
              >← Back to Nigeria Pulse</button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}