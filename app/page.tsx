"use client";
import { useState, useEffect, useCallback, useRef } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// ─── Helpers ───────────────────────────────────────────────
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── Sub-components ────────────────────────────────────────

function IntensityBar({ value }) {
  const color = value >= 8 ? "#ff6b35" : value >= 5 ? "#ffd600" : "#00c853";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{ flex: 1, height: "3px", background: "#2a2a2a", borderRadius: "2px" }}>
        <div style={{ width: `${value * 10}%`, height: "100%", background: color, borderRadius: "2px", transition: "width 1s ease" }} />
      </div>
      <span style={{ fontSize: "12px", color, fontFamily: "Syne, sans-serif", fontWeight: 700, minWidth: "16px" }}>{value}</span>
    </div>
  );
}

function LiveDot() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
      <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#00c853", display: "inline-block", animation: "pulse-dot 1.5s ease infinite" }} />
      <span style={{ fontSize: "11px", color: "#00c853", fontWeight: 600, letterSpacing: "0.08em" }}>LIVE</span>
    </span>
  );
}

function NewsTicker({ articles }) {
  if (!articles.length) return null;
  const items = [...articles, ...articles];
  return (
    <div style={{ background: "#008751", padding: "8px 0", overflow: "hidden" }}>
      <div style={{ display: "flex", gap: "60px", animation: "ticker 40s linear infinite", whiteSpace: "nowrap" }}>
        {items.map((a, i) => (
          <span key={i} style={{ fontSize: "12px", color: "#fff", fontWeight: 500, flexShrink: 0 }}>
            <span style={{ opacity: 0.6, marginRight: "12px" }}>◆</span>{a.title}
          </span>
        ))}
      </div>
    </div>
  );
}

function NairaRateBar({ nairaRate, formatTime }) {
  if (!nairaRate) return null;
  return (
    <div style={{ background: "#0e0e0e", borderBottom: "1px solid #1a1a1a", padding: "10px 24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "14px" }}>💵</span>
          <span style={{ fontSize: "10px", color: "#4a4a4a", letterSpacing: "0.12em", fontWeight: 600 }}>NAIRA RATE</span>
        </div>
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          {[
            { label: "USD/NGN", value: nairaRate.usd_to_ngn, color: "#ffd600" },
            { label: "EUR/NGN", value: nairaRate.eur_to_ngn, color: "#f0ede6" },
            { label: "GBP/NGN", value: nairaRate.gbp_to_ngn, color: "#f0ede6" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "10px", color: "#4a4a4a" }}>{label}</span>
              <span style={{ fontFamily: "Syne, sans-serif", fontSize: "14px", fontWeight: 800, color }}>
                ₦{Number(value).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <span style={{ fontSize: "10px", color: "#3a3a3a", marginLeft: "auto" }}>
          Updated {formatTime(nairaRate.recorded_at)}
        </span>
      </div>
    </div>
  );
}

// ─── UPGRADED: TopicCard — clicking opens source website ───
function TopicCard({ topic, index, isActive }) {
  const rankColors = ["#ffd600", "#f0ede6", "#ff6b35", "#888", "#888"];

  // Build the best link: first source_url, then search Google for the topic
  const topicLink = topic.source_url ||
    (topic.sources_cited?.[0]
      ? `https://www.google.com/search?q=${encodeURIComponent(topic.name + " Nigeria " + topic.sources_cited[0])}`
      : `https://www.google.com/search?q=${encodeURIComponent(topic.name + " Nigeria")}`);

  return (
    <a
      href={topicLink}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        style={{
          background: isActive ? "#161616" : "#111111",
          border: `1px solid ${isActive ? "#3a3a3a" : "#2a2a2a"}`,
          borderRadius: "12px",
          padding: "24px",
          position: "relative",
          overflow: "hidden",
          transition: "border-color 0.2s, transform 0.2s, background 0.3s",
          cursor: "pointer",
          transform: isActive ? "translateY(-2px)" : "translateY(0)",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = rankColors[index] + "60";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = isActive ? "#3a3a3a" : "#2a2a2a";
          e.currentTarget.style.transform = isActive ? "translateY(-2px)" : "translateY(0)";
        }}
      >
        {/* Active pulse indicator */}
        {isActive && (
          <div style={{
            position: "absolute", top: 0, left: 0, width: "3px", height: "100%",
            background: rankColors[index] || "#ffd600",
          }} />
        )}

        {/* Rank number watermark */}
        <div style={{
          position: "absolute", top: "20px", right: "20px",
          fontFamily: "Syne, sans-serif", fontSize: "48px", fontWeight: 800,
          color: rankColors[index] || "#444", opacity: 0.15, lineHeight: 1,
        }}>
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Badges */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "12px", flexWrap: "wrap" }}>
          {topic.in_govt_agenda && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "rgba(0,135,81,0.15)", border: "1px solid rgba(0,135,81,0.3)", borderRadius: "4px", padding: "2px 8px", fontSize: "11px", color: "#00c853", fontWeight: 500 }}>
              🏛 GOVT AGENDA
            </div>
          )}
          {topic.foreign_impact && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "rgba(255,107,53,0.15)", border: "1px solid rgba(255,107,53,0.3)", borderRadius: "4px", padding: "2px 8px", fontSize: "11px", color: "#ff6b35", fontWeight: 500 }}>
              🌍 GLOBAL IMPACT
            </div>
          )}
          {topic.sentiment && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "4px",
              background: topic.sentiment === "positive" ? "rgba(0,200,83,0.12)" : topic.sentiment === "negative" ? "rgba(248,113,113,0.12)" : "rgba(255,214,0,0.12)",
              border: `1px solid ${topic.sentiment === "positive" ? "rgba(0,200,83,0.3)" : topic.sentiment === "negative" ? "rgba(248,113,113,0.3)" : "rgba(255,214,0,0.3)"}`,
              borderRadius: "4px", padding: "2px 8px", fontSize: "11px",
              color: topic.sentiment === "positive" ? "#00c853" : topic.sentiment === "negative" ? "#f87171" : "#ffd600",
              fontWeight: 500, textTransform: "capitalize",
            }}>
              {topic.sentiment === "positive" ? "↑" : topic.sentiment === "negative" ? "↓" : "→"} {topic.sentiment}
            </div>
          )}
        </div>

        <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "18px", fontWeight: 700, marginBottom: "10px", color: "#f0ede6", paddingRight: "40px" }}>
          {topic.name}
        </h3>
        <p style={{ color: "#9a9590", fontSize: "14px", marginBottom: "16px", lineHeight: 1.5 }}>
          {topic.summary}
        </p>

        <IntensityBar value={topic.intensity} />

        {/* Sources + category row */}
        <div style={{ marginTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {(topic.sources_cited || topic.sources || []).map((s, i) => (
              <span key={i} style={{ fontSize: "11px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "4px", padding: "2px 8px", color: "#6b6660" }}>
                {s}
              </span>
            ))}
          </div>
          {topic.category && (
            <span style={{ fontSize: "10px", color: "#4a4a4a", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {topic.category}
            </span>
          )}
        </div>

        {/* Click hint */}
        <div style={{ marginTop: "12px", fontSize: "11px", color: "#3a3a3a", display: "flex", alignItems: "center", gap: "4px" }}>
          <span>↗</span> <span>Click to read full story</span>
        </div>
      </div>
    </a>
  );
}

function ForeignAlertCard({ alert }) {
  const sectorColors = { oil: "#ff6b35", forex: "#ffd600", diaspora: "#a78bfa", trade: "#60a5fa", security: "#f87171", food: "#4ade80", other: "#9a9590" };
  const sectorIcons = { oil: "🛢️", forex: "💵", diaspora: "🌍", trade: "🚢", security: "🔒", food: "🌾", other: "⚡" };
  const color = sectorColors[alert.impact_sector] || "#9a9590";
  const icon = sectorIcons[alert.impact_sector] || "⚡";
  return (
    <div
      style={{ background: "#111", border: `1px solid ${color}30`, borderRadius: "12px", padding: "20px", overflow: "hidden", position: "relative", transition: "transform 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      <div style={{ position: "absolute", top: 0, left: 0, width: "3px", height: "100%", background: color }} />
      <div style={{ paddingLeft: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>{icon}</span>
            <span style={{ fontSize: "11px", background: `${color}20`, border: `1px solid ${color}40`, color, borderRadius: "4px", padding: "2px 8px", fontWeight: 600, letterSpacing: "0.05em" }}>
              {(alert.impact_sector || "").toUpperCase()}
            </span>
            <span style={{ fontSize: "11px", color: "#4a4a4a" }}>{alert.country}</span>
          </div>
          {alert.impact_score && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "11px", color: "#4a4a4a" }}>Impact</span>
              <span style={{ fontFamily: "Syne, sans-serif", fontSize: "16px", fontWeight: 800, color }}>{alert.impact_score}</span>
            </div>
          )}
        </div>
        <h4 style={{ fontFamily: "Syne, sans-serif", fontSize: "15px", fontWeight: 700, color: "#f0ede6", marginBottom: "8px" }}>{alert.event}</h4>
        <p style={{ fontSize: "13px", color: "#9a9590", marginBottom: "12px", lineHeight: 1.5 }}>{alert.nigeria_impact}</p>
        {alert.what_to_watch && (
          <div style={{ background: "#1a1a1a", borderRadius: "6px", padding: "10px 12px" }}>
            <p style={{ fontSize: "11px", color: "#4a4a4a", letterSpacing: "0.08em", marginBottom: "3px" }}>WHAT TO WATCH</p>
            <p style={{ fontSize: "12px", color: "#6b6660", margin: 0, lineHeight: 1.4 }}>{alert.what_to_watch}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SocialCard({ item, accentColor }) {
  return (
    <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
      <div
        style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "10px", padding: "16px", transition: "border-color 0.2s, transform 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = `${accentColor}50`; e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.transform = "translateY(0)"; }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "8px" }}>
          <span style={{ fontSize: "10px", background: `${accentColor}18`, border: `1px solid ${accentColor}35`, color: accentColor, borderRadius: "4px", padding: "2px 7px", fontWeight: 600, whiteSpace: "nowrap" }}>
            {item.source}
          </span>
          <span style={{ fontSize: "10px", color: "#4a4a4a", whiteSpace: "nowrap", flexShrink: 0 }}>{timeAgo(item.scraped_at)}</span>
        </div>
        <p style={{ fontSize: "13px", color: "#c8c4bc", lineHeight: 1.4, margin: 0 }}>{item.title}</p>
        {item.summary && !item.summary.startsWith("👍") && (
          <p style={{ fontSize: "11px", color: "#6b6660", marginTop: "8px", lineHeight: 1.4 }}>
            {item.summary.slice(0, 100)}{item.summary.length > 100 ? "..." : ""}
          </p>
        )}
      </div>
    </a>
  );
}

function CommentCard({ item }) {
  return (
    <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
      <div
        style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "10px", padding: "16px", transition: "border-color 0.2s, transform 0.2s", position: "relative", overflow: "hidden" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "#f8717150"; e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.transform = "translateY(0)"; }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, width: "3px", height: "100%", background: "#f87171" }} />
        <div style={{ paddingLeft: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "10px", background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", borderRadius: "4px", padding: "2px 7px", fontWeight: 600 }}>
              {(item.source || "").replace("YouTube Comments — ", "💬 ")}
            </span>
            <span style={{ fontSize: "10px", color: "#4a4a4a" }}>{timeAgo(item.scraped_at)}</span>
          </div>
          <p style={{ fontSize: "13px", color: "#c8c4bc", lineHeight: 1.5, margin: "0 0 8px" }}>{item.title}</p>
          {item.summary && (
            <p style={{ fontSize: "11px", color: "#4a4a4a", margin: 0 }}>{item.summary}</p>
          )}
        </div>
      </div>
    </a>
  );
}

function SocialSectionHeader({ icon, label, color, count, subtitle }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
      <span style={{ fontSize: "16px" }}>{icon}</span>
      <h4 style={{ fontFamily: "Syne, sans-serif", fontSize: "13px", fontWeight: 700, color, letterSpacing: "0.1em", margin: 0 }}>{label}</h4>
      <span style={{ fontSize: "11px", color: "#4a4a4a" }}>{count} {subtitle}</span>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────
export default function Home() {
  const [pulse, setPulse] = useState(null);
  const [news, setNews] = useState([]);
  const [foreignAlerts, setForeignAlerts] = useState([]);
  const [socialSignals, setSocialSignals] = useState([]);
  const [nairaRate, setNairaRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [socialLoading, setSocialLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeTab, setActiveTab] = useState("pulse");
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);

  // Subscribe form
  const [subscribeName, setSubscribeName] = useState("");
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeWhatsapp, setSubscribeWhatsapp] = useState("");
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [subscribeError, setSubscribeError] = useState("");

  // Auto-rotate active topic every 5 seconds
  const topicRotateRef = useRef(null);
  useEffect(() => {
    topicRotateRef.current = setInterval(() => {
      setActiveTopicIndex(prev => (prev + 1) % 5);
    }, 5000);
    return () => clearInterval(topicRotateRef.current);
  }, []);

  const fetchPulse = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/pulse`);
      const data = await res.json();
      if (data.success) { setPulse(data.data); setLastUpdated(new Date()); }
    } catch (e) { console.error("fetchPulse:", e); }
    finally { setLoading(false); }
  }, []);

  const fetchNews = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/news?limit=40`);
      const data = await res.json();
      if (data.success) setNews(data.data);
    } catch (e) { console.error("fetchNews:", e); }
  }, []);

  const fetchForeignAlerts = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/foreign-alerts`);
      const data = await res.json();
      if (data.success) setForeignAlerts(data.data);
    } catch (e) { console.error("fetchForeignAlerts:", e); }
    finally { setAlertsLoading(false); }
  }, []);

  const fetchSocialSignals = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/news?limit=200`);
      const data = await res.json();
      if (data.success) {
        const social = data.data.filter(a =>
          ["social_reddit", "social_video", "social_signal", "social_twitter",
            "social_official", "trending_search", "youtube_comment"].includes(a.category)
        );
        setSocialSignals(social);
      }
    } catch (e) { console.error("fetchSocial:", e); }
    finally { setSocialLoading(false); }
  }, []);

  const fetchNairaRate = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/naira`);
      const data = await res.json();
      if (data.success && data.data?.length > 0) setNairaRate(data.data[0]);
    } catch (e) { console.error("fetchNaira:", e); }
  }, []);

  useEffect(() => {
    fetchPulse(); fetchNews(); fetchForeignAlerts(); fetchSocialSignals(); fetchNairaRate();
    // Auto-refresh every 5 minutes silently
    const id = setInterval(() => {
      fetchPulse(); fetchNews(); fetchForeignAlerts(); fetchNairaRate();
    }, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [fetchPulse, fetchNews, fetchForeignAlerts, fetchSocialSignals, fetchNairaRate]);

  const formatTime = (d) =>
    d ? new Date(d).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }) : "";

  const reddit   = socialSignals.filter(s => s.category === "social_reddit");
  const trends   = socialSignals.filter(s => s.category === "trending_search");
  const youtube  = socialSignals.filter(s => s.category === "social_video");
  const comments = socialSignals.filter(s => s.category === "youtube_comment");
  const signals  = socialSignals.filter(s => s.category === "social_signal");

  const tabs = [
    { id: "pulse",   label: "🔥 NATIONAL PULSE" },
    { id: "foreign", label: "🌍 GLOBAL IMPACT" },
    { id: "social",  label: "📱 SOCIAL SIGNALS" },
  ];

  const handleSubscribe = async () => {
    if (!subscribeEmail) { setSubscribeError("Please enter your email address."); return; }
    setSubscribeLoading(true);
    setSubscribeError("");
    try {
      const res = await fetch(`${API}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: subscribeName,
          email: subscribeEmail,
          whatsapp: subscribeWhatsapp || null,
        }),
      });
      const data = await res.json();
      if (data.success) setSubscribeSuccess(true);
      else setSubscribeError(data.error || "Something went wrong. Try again.");
    } catch {
      setSubscribeError("Connection error. Make sure the server is running.");
    } finally {
      setSubscribeLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a" }}>

      {/* ── CSS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #f0ede6; }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.3)} }
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .skeleton { background:linear-gradient(90deg,#1a1a1a 25%,#222 50%,#1a1a1a 75%); background-size:200% 100%; animation:shimmer 1.5s infinite; border-radius:4px; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .topic-appear { animation: fadeUp 0.4s ease both; }
        input::placeholder { color: #3a3a3a; }
        input:focus { outline: none; }
        ::-webkit-scrollbar { width: 4px; } 
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }
      `}</style>

      {/* ── Header ── */}
      <header style={{ borderBottom: "1px solid #1a1a1a", padding: "0 24px", position: "sticky", top: 0, background: "rgba(10,10,10,0.95)", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "22px" }}>🇳🇬</span>
            <div>
              <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "18px", fontWeight: 800, letterSpacing: "-0.02em", color: "#f0ede6", margin: 0 }}>
                NIGERIA <span style={{ color: "#008751" }}>PULSE</span>
              </h1>
              <p style={{ fontSize: "10px", color: "#4a4a4a", letterSpacing: "0.1em", margin: 0 }}>REAL-TIME NATIONAL INTELLIGENCE</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {lastUpdated && (
              <span style={{ fontSize: "12px", color: "#4a4a4a" }}>Updated {formatTime(lastUpdated)}</span>
            )}
            <LiveDot />
          </div>
        </div>
      </header>

      <NairaRateBar nairaRate={nairaRate} formatTime={formatTime} />
      <NewsTicker articles={news.slice(0, 10)} />

      {/* ── POWERFUL HERO — replaces "Top Stories" ── */}
      <div style={{ padding: "48px 24px 32px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Overline */}
        <p style={{ fontSize: "11px", letterSpacing: "0.2em", color: "#008751", fontWeight: 700, marginBottom: "12px", textTransform: "uppercase" }}>
          ◆ What Nigeria Is Thinking Right Now
        </p>

        {/* Main headline — dynamic, shows active topic name */}
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "clamp(28px, 5vw, 52px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: "#f0ede6",
          }}>
            {pulse?.top_topics?.[activeTopicIndex]?.name
              ? <><span style={{ color: "#ffd600" }}>{pulse.top_topics[activeTopicIndex].name}</span><br /><span style={{ color: "#2a2a2a", fontSize: "clamp(18px,3vw,32px)" }}>is dominating Nigeria today</span></>
              : <>National<br /><span style={{ color: "#2a2a2a" }}>Intelligence Feed</span></>
            }
          </h2>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "13px", color: "#6b6660" }}>{pulse?.total_articles_analyzed || 0} signals analyzed</span>
          <span style={{ color: "#2a2a2a" }}>·</span>
          <span style={{ fontSize: "13px", color: "#6b6660" }}>23+ sources</span>
          {nairaRate && (
            <><span style={{ color: "#2a2a2a" }}>·</span>
            <span style={{ fontSize: "13px", color: "#ffd600" }}>💵 $1 = ₦{Number(nairaRate.usd_to_ngn).toFixed(0)}</span></>
          )}
          {socialSignals.length > 0 && (
            <><span style={{ color: "#2a2a2a" }}>·</span>
            <span style={{ fontSize: "13px", color: "#a78bfa" }}>📱 {socialSignals.length} social</span></>
          )}
          {foreignAlerts.length > 0 && (
            <><span style={{ color: "#2a2a2a" }}>·</span>
            <span style={{ fontSize: "13px", color: "#ff6b35" }}>🌍 {foreignAlerts.length} global alerts</span></>
          )}
          {/* Topic dot indicators */}
          {pulse?.top_topics && (
            <div style={{ display: "flex", gap: "6px", marginLeft: "auto" }}>
              {pulse.top_topics.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTopicIndex(i)}
                  style={{
                    width: i === activeTopicIndex ? "20px" : "6px",
                    height: "6px",
                    borderRadius: "3px",
                    background: i === activeTopicIndex ? "#ffd600" : "#2a2a2a",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    padding: 0,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ padding: "0 24px", maxWidth: "1200px", margin: "0 auto", marginBottom: "32px" }}>
        <div style={{ display: "flex", gap: "4px", background: "#111", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "4px", width: "fit-content", flexWrap: "wrap" }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: "8px 20px", borderRadius: "6px", border: "none", cursor: "pointer",
              fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: "13px", letterSpacing: "0.05em",
              background: activeTab === tab.id ? "#f0ede6" : "transparent",
              color: activeTab === tab.id ? "#0a0a0a" : "#6b6660", transition: "all 0.2s",
            }}>{tab.label}</button>
          ))}
        </div>
      </div>

      {/* ── Main Content ── */}
      <main style={{ padding: "0 24px 80px", maxWidth: "1200px", margin: "0 auto" }}>

        {/* ── NATIONAL PULSE TAB ── */}
        {activeTab === "pulse" && (
          <div>
            {loading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "16px" }}>
                {[1,2,3,4,5].map(i => (
                  <div key={i} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "24px", height: "180px" }}>
                    <div className="skeleton" style={{ height: "14px", width: "40%", marginBottom: "16px" }} />
                    <div className="skeleton" style={{ height: "20px", width: "80%", marginBottom: "12px" }} />
                    <div className="skeleton" style={{ height: "14px", width: "100%" }} />
                  </div>
                ))}
              </div>
            ) : !pulse ? (
              <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📡</div>
                <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", marginBottom: "8px" }}>Warming up…</h3>
                <p style={{ color: "#6b6660" }}>The intelligence engine is starting. Check back in 2 minutes.</p>
              </div>
            ) : (
              <>
                {/* Section label */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <div>
                    <p style={{ fontSize: "11px", color: "#4a4a4a", letterSpacing: "0.15em", marginBottom: "4px" }}>
                      TOP 5 NATIONAL TOPICS · AUTO-REFRESHES EVERY 5 MINS · CLICK TO READ
                    </p>
                  </div>
                  {pulse.engine_used && (
                    <span style={{ fontSize: "10px", color: "#3a3a3a", background: "#111", border: "1px solid #1a1a1a", borderRadius: "4px", padding: "3px 8px" }}>
                      AI: {pulse.engine_used} · {Math.round((pulse.analysis_confidence || 0) * 100)}% confidence
                    </span>
                  )}
                </div>

                {/* Topic grid — all 5 cards, active one highlighted */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "16px" }}>
                  {pulse.top_topics?.map((topic, i) => (
                    <div key={i} className="topic-appear" style={{ animationDelay: `${i * 80}ms` }}>
                      <TopicCard topic={topic} index={i} isActive={i === activeTopicIndex} />
                    </div>
                  ))}
                </div>

                {/* Stats footer */}
                <div style={{ marginTop: "40px", padding: "24px", background: "#111", border: "1px solid #2a2a2a", borderRadius: "12px", display: "flex", gap: "40px", flexWrap: "wrap" }}>
                  {[
                    { label: "SIGNALS ANALYZED",  value: pulse.total_articles_analyzed, color: "#f0ede6" },
                    { label: "TOPICS TRACKED",    value: pulse.top_topics?.length,       color: "#f0ede6" },
                    { label: "GOVT AGENDA",        value: pulse.top_topics?.filter(t => t.in_govt_agenda).length, color: "#008751" },
                    { label: "SOCIAL SIGNALS",    value: socialSignals.length,            color: "#a78bfa" },
                    { label: "YT COMMENTS",       value: comments.length,                 color: "#f87171" },
                    { label: "GLOBAL ALERTS",     value: foreignAlerts.length,            color: "#ff6b35" },
                    { label: "NAIRA RATE",         value: nairaRate ? `₦${Number(nairaRate.usd_to_ngn).toFixed(0)}` : "—", color: "#ffd600" },
                    { label: "OVERALL SENTIMENT", value: pulse.overall_sentiment || "—", color: "#9a9590" },
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <div style={{ fontSize: "11px", color: "#4a4a4a", letterSpacing: "0.1em", marginBottom: "4px" }}>{label}</div>
                      <div style={{ fontFamily: "Syne, sans-serif", fontSize: "22px", fontWeight: 800, color, textTransform: "capitalize" }}>{value}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── GLOBAL IMPACT TAB ── */}
        {activeTab === "foreign" && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "13px", fontWeight: 700, color: "#ff6b35", letterSpacing: "0.1em", marginBottom: "8px" }}>🌍 GLOBAL EVENTS AFFECTING NIGERIA</h3>
              <p style={{ fontSize: "14px", color: "#6b6660" }}>Foreign events detected by AI that directly impact Nigeria through oil, forex, diaspora, trade, security or food channels.</p>
            </div>
            {alertsLoading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "16px" }}>
                {[1,2,3].map(i => (
                  <div key={i} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "20px", height: "160px" }}>
                    <div className="skeleton" style={{ height: "12px", width: "30%", marginBottom: "12px" }} />
                  </div>
                ))}
              </div>
            ) : foreignAlerts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🌐</div>
                <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", marginBottom: "8px" }}>No global alerts right now</h3>
                <p style={{ color: "#6b6660" }}>The AI will detect foreign events on the next refresh.</p>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "24px" }}>
                  {[...new Set(foreignAlerts.map(a => a.impact_sector))].map(sector => {
                    const sc = { oil: "#ff6b35", forex: "#ffd600", diaspora: "#a78bfa", trade: "#60a5fa", security: "#f87171", food: "#4ade80", other: "#9a9590" };
                    const color = sc[sector] || "#9a9590";
                    return (
                      <div key={sector} style={{ background: `${color}15`, border: `1px solid ${color}30`, borderRadius: "6px", padding: "6px 14px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "12px", color, fontWeight: 600, letterSpacing: "0.05em" }}>{(sector || "").toUpperCase()}</span>
                        <span style={{ fontSize: "12px", color: "#4a4a4a" }}>{foreignAlerts.filter(a => a.impact_sector === sector).length}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "16px" }}>
                  {foreignAlerts.map((alert, i) => <ForeignAlertCard key={i} alert={alert} />)}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── SOCIAL SIGNALS TAB ── */}
        {activeTab === "social" && (
          <div>
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "13px", fontWeight: 700, color: "#a78bfa", letterSpacing: "0.1em", marginBottom: "8px" }}>📱 SOCIAL MEDIA & SIGNAL INTELLIGENCE</h3>
              <p style={{ fontSize: "14px", color: "#6b6660" }}>Real-time signals from Reddit, YouTube videos & comments, Google Trends — what Nigerians are actually discussing.</p>
            </div>

            {socialLoading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "12px" }}>
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "20px", height: "110px" }}>
                    <div className="skeleton" style={{ height: "12px", width: "30%", marginBottom: "12px" }} />
                  </div>
                ))}
              </div>
            ) : socialSignals.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📡</div>
                <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", marginBottom: "8px" }}>No social signals yet</h3>
                <p style={{ color: "#6b6660" }}>Social signals are collected every 2 hours.</p>
              </div>
            ) : (
              <>
                {/* Stats bar */}
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "40px" }}>
                  {[
                    { label: "Reddit",      color: "#ff6b35", icon: "💬", data: reddit },
                    { label: "YouTube",     color: "#f87171", icon: "▶️",  data: youtube },
                    { label: "YT Comments", color: "#fb923c", icon: "💭", data: comments },
                    { label: "Trends",      color: "#ffd600", icon: "🔍", data: trends },
                    { label: "Topic Feeds", color: "#00c853", icon: "📡", data: signals },
                  ].filter(({ data }) => data.length > 0).map(({ label, color, icon, data }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: "10px", background: `${color}10`, border: `1px solid ${color}25`, borderRadius: "8px", padding: "10px 18px" }}>
                      <span style={{ fontSize: "16px" }}>{icon}</span>
                      <div>
                        <div style={{ fontSize: "10px", color, fontWeight: 600, letterSpacing: "0.06em" }}>{label}</div>
                        <div style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", fontWeight: 800, color, lineHeight: 1 }}>{data.length}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#ffffff06", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "10px 18px" }}>
                    <div>
                      <div style={{ fontSize: "10px", color: "#6b6660", fontWeight: 600, letterSpacing: "0.06em" }}>TOTAL</div>
                      <div style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", fontWeight: 800, color: "#f0ede6", lineHeight: 1 }}>{socialSignals.length}</div>
                    </div>
                  </div>
                </div>

                {reddit.length > 0 && (
                  <div style={{ marginBottom: "48px" }}>
                    <SocialSectionHeader icon="💬" label="REDDIT NIGERIA" color="#ff6b35" count={reddit.length} subtitle="posts" />
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "12px" }}>
                      {reddit.slice(0, 9).map((post, i) => <SocialCard key={i} item={post} accentColor="#ff6b35" />)}
                    </div>
                  </div>
                )}

                {trends.length > 0 && (
                  <div style={{ marginBottom: "48px" }}>
                    <SocialSectionHeader icon="🔍" label="GOOGLE TRENDS NIGERIA" color="#ffd600" count={trends.length} subtitle="trending searches" />
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                      {trends.map((trend, i) => (
                        <a key={i} href={trend.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                          <div
                            style={{ display: "flex", alignItems: "center", gap: "12px", background: "#111", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "10px 18px", transition: "border-color 0.2s" }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = "#ffd60045"}
                            onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2a2a"}
                          >
                            <span style={{ fontFamily: "Syne, sans-serif", fontSize: "15px", fontWeight: 800, color: "#ffd600", minWidth: "28px" }}>{String(i + 1).padStart(2, "0")}</span>
                            <span style={{ fontSize: "13px", color: "#c8c4bc" }}>{trend.title}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {youtube.length > 0 && (
                  <div style={{ marginBottom: "48px" }}>
                    <SocialSectionHeader icon="▶️" label="YOUTUBE — NIGERIAN BROADCASTERS" color="#f87171" count={youtube.length} subtitle="latest videos" />
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "12px" }}>
                      {youtube.slice(0, 9).map((video, i) => (
                        <SocialCard key={i} item={{ ...video, source: (video.source || "").replace(" YouTube", "") }} accentColor="#f87171" />
                      ))}
                    </div>
                  </div>
                )}

                {comments.length > 0 && (
                  <div style={{ marginBottom: "48px" }}>
                    <SocialSectionHeader icon="💭" label="YOUTUBE COMMENTS — WHAT NIGERIANS ARE SAYING" color="#fb923c" count={comments.length} subtitle="comments" />
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "12px" }}>
                      {comments.slice(0, 12).map((comment, i) => <CommentCard key={i} item={comment} />)}
                    </div>
                  </div>
                )}

                {signals.length > 0 && (
                  <div style={{ marginBottom: "48px" }}>
                    <SocialSectionHeader icon="📡" label="EDITORIAL FOCUS SIGNALS" color="#00c853" count={signals.length} subtitle="articles" />
                    <div style={{ borderRadius: "10px", border: "1px solid #2a2a2a", overflow: "hidden" }}>
                      {signals.slice(0, 14).map((item, i) => (
                        <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                          <div
                            style={{ padding: "14px 18px", borderBottom: i < 13 ? "1px solid #1a1a1a" : "none", background: "#111", transition: "background 0.15s, padding-left 0.15s" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#161616"; e.currentTarget.style.paddingLeft = "24px"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "#111"; e.currentTarget.style.paddingLeft = "18px"; }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                              <div style={{ flex: 1 }}>
                                <span style={{ fontSize: "10px", color: "#00c853", fontWeight: 600, marginRight: "8px" }}>{item.source}</span>
                                <p style={{ fontSize: "13px", color: "#c8c4bc", lineHeight: 1.4, margin: "4px 0 0" }}>{item.title}</p>
                              </div>
                              <span style={{ fontSize: "10px", color: "#4a4a4a", whiteSpace: "nowrap", marginTop: "2px" }}>{timeAgo(item.scraped_at)}</span>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>

      {/* ── Subscribe Section ── */}
      <div style={{ borderTop: "1px solid #1a1a1a", padding: "64px 24px" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "11px", color: "#008751", letterSpacing: "0.15em", fontWeight: 600, marginBottom: "12px" }}>STAY INFORMED</p>
          <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "28px", fontWeight: 800, color: "#f0ede6", marginBottom: "12px", letterSpacing: "-0.02em" }}>
            Get Nigeria Pulse<br />delivered to you
          </h3>
          <p style={{ fontSize: "14px", color: "#6b6660", marginBottom: "32px", lineHeight: 1.6 }}>
            Top 5 trending topics + Naira rate + Global alerts — every day at 6AM and 6PM WAT. Free forever.
          </p>
          {subscribeSuccess ? (
            <div style={{ background: "rgba(0,135,81,0.1)", border: "1px solid rgba(0,200,83,0.3)", borderRadius: "12px", padding: "24px" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>🎉</div>
              <p style={{ fontFamily: "Syne, sans-serif", fontSize: "18px", fontWeight: 700, color: "#00c853", margin: "0 0 8px" }}>You're subscribed!</p>
              <p style={{ fontSize: "13px", color: "#6b6660", margin: 0 }}>Check your email for a welcome message. First digest arrives at 6AM tomorrow.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { type: "text",  placeholder: "Your name",                              value: subscribeName,     setter: setSubscribeName },
                { type: "email", placeholder: "Email address",                           value: subscribeEmail,    setter: setSubscribeEmail },
                { type: "tel",   placeholder: "WhatsApp (optional) e.g. +2348012345678", value: subscribeWhatsapp, setter: setSubscribeWhatsapp },
              ].map(({ type, placeholder, value, setter }) => (
                <input
                  key={type}
                  type={type}
                  placeholder={placeholder}
                  value={value}
                  onChange={e => setter(e.target.value)}
                  style={{ width: "100%", padding: "14px 16px", background: "#111", border: "1px solid #2a2a2a", borderRadius: "8px", color: "#f0ede6", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = "#008751"}
                  onBlur={e => e.target.style.borderColor = "#2a2a2a"}
                />
              ))}
              {subscribeError && <p style={{ fontSize: "13px", color: "#f87171", margin: 0 }}>{subscribeError}</p>}
              <button
                onClick={handleSubscribe}
                disabled={subscribeLoading}
                style={{ width: "100%", padding: "14px", background: subscribeLoading ? "#1a1a1a" : "#008751", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontFamily: "Syne, sans-serif", fontWeight: 700, cursor: subscribeLoading ? "not-allowed" : "pointer", letterSpacing: "0.05em", transition: "background 0.2s" }}
              >
                {subscribeLoading ? "Subscribing..." : "SUBSCRIBE FREE →"}
              </button>
              <p style={{ fontSize: "11px", color: "#3a3a3a", margin: 0 }}>No spam. Unsubscribe anytime. 🇳🇬</p>
            </div>
          )}
        </div>
      </div>

      <footer style={{ borderTop: "1px solid #1a1a1a", padding: "24px", textAlign: "center" }}>
        <p style={{ fontSize: "12px", color: "#3a3a3a" }}>
          🇳🇬 Nigeria Pulse — Auto-refreshes every 5 minutes · 23+ sources · Built for the people
        </p>
      </footer>
    </div>
  );
}