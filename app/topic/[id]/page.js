
"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const ACCENT = "#008751";

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

function Skeleton({ h = 20, w = "100%" }) {
  return (
    <div style={{
      height: h, width: w,
      background: "linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
      borderRadius: 6,
    }} />
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

function SiteHeader({ onBack }) {
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(255,255,255,0.97)",
      backdropFilter: "blur(14px)",
      borderBottom: "1px solid #e5e7eb",
      padding: "0 16px",
    }}>
      <div style={{
        maxWidth: "1280px", margin: "0 auto",
        height: "62px", display: "flex",
        alignItems: "center", justifyContent: "space-between", gap: "12px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={onBack} style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: "none", border: "none", cursor: "pointer",
            color: "#6b7280", fontSize: "13px", fontFamily: "inherit",
            padding: "5px 0", transition: "color 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.color = "#111827"}
            onMouseLeave={e => e.currentTarget.style.color = "#6b7280"}
          >
            ← Back
          </button>
          <span style={{ color: "#d1d5db" }}>|</span>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }} onClick={onBack}>
            <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <div style={{ width: "12px", height: "2px", background: "#fff", borderRadius: "1px" }} />
            </div>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 800, color: "#111827", margin: 0 }}>
                Nigeria <span style={{ color: ACCENT }}>Pulse</span>
              </h1>
              <p style={{ fontSize: "8px", color: "#9ca3af", letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>
                Real-Time National Intelligence
              </p>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "10px", color: "#6b7280", background: "#f1f5f9", border: "1px solid #e5e7eb", borderRadius: "20px", padding: "4px 12px", letterSpacing: "0.06em" }}>
            ARTICLE
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "#dcfce7", border: "1px solid #86efac", borderRadius: "20px", padding: "4px 10px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#16a34a", display: "inline-block", animation: "pulseDot 1.5s ease infinite" }} />
            <span style={{ fontSize: "10px", color: "#15803d", fontWeight: 700, letterSpacing: "0.1em" }}>LIVE</span>
          </span>
        </div>
      </div>
    </header>
  );
}

function SiteFooter({ onBack }) {
  return (
    <footer style={{ borderTop: "1px solid #e5e7eb", background: "#f8fafc", padding: "28px 16px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "20px" }}>
          <div style={{ width: "26px", height: "26px", borderRadius: "6px", background: ACCENT, flexShrink: 0 }} />
          <div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "15px", fontWeight: 800, color: "#111827", margin: 0 }}>
              Nigeria <span style={{ color: ACCENT }}>Pulse</span>
            </p>
            <p style={{ fontSize: "10px", color: "#9ca3af", margin: 0 }}>Built for the people of Nigeria</p>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <p style={{ fontSize: "11px", color: "#9ca3af" }}>© 2026 Nigeria Pulse · All rights reserved</p>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button onClick={onBack} style={{
              fontSize: "12px", color: ACCENT, fontWeight: 600,
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "inherit", textDecoration: "underline",
            }}>← Back to Nigeria Pulse</button>
            <span style={{ fontSize: "11px", color: "#9ca3af" }}>Auto-refreshes every 5 min · 23+ sources · Powered by AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function TopicDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const accentColors = ["#008751", "#2563eb", "#dc2626", "#d97706", "#7c3aed"];
  const color = accentColors[parseInt(id)] || ACCENT;
  const goHome = () => router.push("/");

  useEffect(() => {
    if (id === undefined || id === null) return;
    fetch(`${API}/api/topic/${id}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
        else setError(json.error || "Topic not found");
      })
      .catch(() => setError("Connection error. Please check your network."))
      .finally(() => setLoading(false));
  }, [id]);

  const topic = data?.topic;
  const article = data?.article;
  const articles = data?.articles || [];
  const relatedAlerts = data?.related_alerts || [];
  const sentiment = data?.sentiment_breakdown || {};
  const sentimentTotal = (sentiment.positive || 0) + (sentiment.negative || 0) + (sentiment.neutral || 0);
  const sentimentPct = (val) => sentimentTotal > 0 ? Math.round((val / sentimentTotal) * 100) : 0;
  const sources = [...new Set(articles.map(a => a.source))];

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Source Serif 4', Georgia, serif", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,700&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.3)} }
        .source-card { transition: box-shadow 0.2s, transform 0.2s; cursor: pointer; }
        .source-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important; transform: translateY(-2px); }
        .page-grid { display: grid; grid-template-columns: 1fr 300px; gap: 40px; align-items: start; }
        @media (max-width: 960px) { .page-grid { grid-template-columns: 1fr; } }
        @media (max-width: 640px) {
          .article-padding { padding: 24px 16px 60px !important; }
          .headline { font-size: 26px !important; }
          .body-text { font-size: 16px !important; }
        }
      `}</style>

      <SiteHeader onBack={goHome} />

      {loading ? (
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "40px 24px", width: "100%" }}>
          <Skeleton h={12} w="120px" />
          <div style={{ marginTop: "16px" }}><Skeleton h={40} w="90%" /></div>
          <div style={{ marginTop: "10px" }}><Skeleton h={40} w="60%" /></div>
          <div style={{ marginTop: "24px" }}><Skeleton h={14} w="200px" /></div>
          <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <Skeleton h={16} w="100%" />
            <Skeleton h={16} w="100%" />
            <Skeleton h={16} w="80%" />
          </div>
        </div>
      ) : error ? (
        <div style={{ padding: "80px 24px", textAlign: "center", flex: 1 }}>
          <p style={{ fontSize: "16px", color: "#dc2626", marginBottom: "16px" }}>⚠️ {error}</p>
          <button onClick={goHome} style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: "8px", padding: "10px 24px", cursor: "pointer", fontSize: "14px", fontFamily: "inherit" }}>
            ← Go Home
          </button>
        </div>
      ) : topic && article ? (
        <main className="article-padding" style={{ maxWidth: "1280px", margin: "0 auto", width: "100%", padding: "40px 24px 80px", flex: 1 }}>
          <div className="page-grid">

            {/* ── ARTICLE COLUMN ── */}
            <article style={{ maxWidth: "760px", animation: "fadeUp 0.4s ease" }}>

              {/* Badges */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, background: color, color: "#fff", borderRadius: "5px", padding: "3px 9px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  #{parseInt(id) + 1} Trending
                </span>
                {topic.category && (
                  <span style={{ fontSize: "10px", color: "#6b7280", background: "#f1f5f9", border: "1px solid #e5e7eb", borderRadius: "5px", padding: "3px 9px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {topic.category}
                  </span>
                )}
                {topic.in_govt_agenda && (
                  <span style={{ fontSize: "10px", background: "#dcfce7", color: "#15803d", border: "1px solid #86efac", borderRadius: "20px", padding: "3px 8px", fontWeight: 600 }}>
                    Govt Agenda
                  </span>
                )}
              </div>

              {/* Headline */}
              <h1 className="headline" style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "38px", fontWeight: 800, color: "#111827",
                lineHeight: 1.2, marginBottom: "16px", letterSpacing: "-0.02em",
              }}>
                {article.headline}
              </h1>

              {/* Byline */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px", paddingBottom: "20px", borderBottom: "1px solid #e5e7eb", flexWrap: "wrap" }}>
                <span style={{ fontSize: "13px", color: "#374151" }}>
                  By <strong style={{ color: "#111827" }}>{article.byline || "Nigeria Pulse Intelligence"}</strong>
                </span>
                <span style={{ color: "#d1d5db" }}>·</span>
                <span style={{ fontSize: "13px", color: "#6b7280" }}>{timeAgo(article.generated_at || data.generated_at)}</span>
                <span style={{ color: "#d1d5db" }}>·</span>
                <span style={{ fontSize: "13px", color: "#6b7280" }}>{sources.length} source{sources.length !== 1 ? "s" : ""}</span>
              </div>

              {/* Body paragraphs */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "32px" }}>
                {article.paragraphs.map((p, i) => (
                  <p key={i} className="body-text" style={{
                    fontSize: "18px", lineHeight: 1.85, color: "#1f2937",
                    fontWeight: i === 0 ? 500 : 400,
                  }}>
                    {p}
                  </p>
                ))}
              </div>

              {/* AI disclosure note */}
              <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "12px 16px", marginBottom: "32px" }}>
                <p style={{ fontSize: "12px", color: "#6b7280", lineHeight: 1.6, margin: 0 }}>
                  <strong style={{ color: "#374151" }}>ℹ️ About this article:</strong> This piece was synthesized by Nigeria Pulse's AI from {sources.length} independent news sources tracking this story. It is not copied from any single outlet. Original reporting is linked below.
                </p>
              </div>

              {/* Sources cited */}
              {articles.length > 0 && (
                <div style={{ borderTop: "2px solid #111827", paddingTop: "20px" }}>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "14px", fontWeight: 700, color: "#111827", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "16px" }}>
                    Sources & further reading
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {articles.slice(0, 10).map((a, i) => (
                      <a key={i} href={a.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                        <div className="source-card" style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "12px", borderRadius: "10px", border: "1px solid #f3f4f6" }}>
                          {getFavicon(a.source) && (
                            <img src={getFavicon(a.source)} alt="" width="18" height="18" style={{ borderRadius: "4px", marginTop: "2px", flexShrink: 0 }} onError={e => e.target.style.display = "none"} />
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px", flexWrap: "wrap" }}>
                              <span style={{ fontSize: "11px", fontWeight: 700, color }}>{a.source}</span>
                              <span style={{ fontSize: "11px", color: "#9ca3af" }}>{timeAgo(a.published_at)}</span>
                            </div>
                            <p style={{ fontSize: "14px", color: "#111827", lineHeight: 1.4, margin: 0 }}>{a.title}</p>
                          </div>
                          <span style={{ fontSize: "12px", color: "#9ca3af", flexShrink: 0 }}>↗</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* ── SIDEBAR ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

              {sentimentTotal > 0 && (
                <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "14px", padding: "18px 20px" }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "11px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "14px" }}>PUBLIC SENTIMENT</h3>
                  {[
                    { label: "Positive", value: sentiment.positive || 0, color: "#16a34a", icon: "↑" },
                    { label: "Negative", value: sentiment.negative || 0, color: "#dc2626", icon: "↓" },
                    { label: "Neutral", value: sentiment.neutral || 0, color: "#d97706", icon: "→" },
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
                </div>
              )}

              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "14px", padding: "18px 20px" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "11px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "12px" }}>STORY DETAILS</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "12px", color: "#6b7280" }}>Intensity</span>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: topic.intensity >= 8 ? "#dc2626" : topic.intensity >= 5 ? "#d97706" : "#16a34a" }}>{topic.intensity}/10</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "12px", color: "#6b7280" }}>Sources</span>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#111827" }}>{sources.length}</span>
                  </div>
                  {data?.confidence && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "12px", color: "#6b7280" }}>AI Confidence</span>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: ACCENT }}>{Math.round(data.confidence * 100)}%</span>
                    </div>
                  )}
                  {data?.generated_at && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "12px", color: "#6b7280" }}>Last updated</span>
                      <span style={{ fontSize: "12px", color: "#374151" }}>{timeAgo(data.generated_at)}</span>
                    </div>
                  )}
                </div>
              </div>

              {relatedAlerts.length > 0 && (
                <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "14px", padding: "18px 20px" }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "11px", fontWeight: 700, color: "#ea580c", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "14px" }}>🌍 GLOBAL IMPACT</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {relatedAlerts.slice(0, 3).map((alert, i) => (
                      <div key={i} style={{ borderTop: i > 0 ? "1px solid #fed7aa" : "none", paddingTop: i > 0 ? "12px" : 0 }}>
                        <p style={{ fontSize: "12px", fontWeight: 700, color: "#c2410c", marginBottom: "4px", lineHeight: 1.4 }}>{alert.event}</p>
                        <p style={{ fontSize: "12px", color: "#78350f", lineHeight: 1.55 }}>{alert.nigeria_impact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={goHome}
                style={{ width: "100%", padding: "13px", background: ACCENT, color: "#fff", border: "none", borderRadius: "10px", fontSize: "14px", fontFamily: "'Playfair Display', serif", fontWeight: 700, cursor: "pointer", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#006b41"}
                onMouseLeave={e => e.currentTarget.style.background = ACCENT}
              >
                ← Back to Nigeria Pulse
              </button>
            </div>
          </div>
        </main>
      ) : null}

      <SiteFooter onBack={goHome} />
    </div>
  );
}