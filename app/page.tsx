"use client";
import { useState, useEffect, useCallback } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

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
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "10px", color: "#4a4a4a" }}>USD/NGN</span>
            <span style={{ fontFamily: "Syne, sans-serif", fontSize: "14px", fontWeight: 800, color: "#ffd600" }}>₦{Number(nairaRate.usd_to_ngn).toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "10px", color: "#4a4a4a" }}>EUR/NGN</span>
            <span style={{ fontFamily: "Syne, sans-serif", fontSize: "14px", fontWeight: 800, color: "#f0ede6" }}>₦{Number(nairaRate.eur_to_ngn).toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "10px", color: "#4a4a4a" }}>GBP/NGN</span>
            <span style={{ fontFamily: "Syne, sans-serif", fontSize: "14px", fontWeight: 800, color: "#f0ede6" }}>₦{Number(nairaRate.gbp_to_ngn).toFixed(2)}</span>
          </div>
        </div>
        <span style={{ fontSize: "10px", color: "#3a3a3a", marginLeft: "auto" }}>Updated {formatTime(nairaRate.recorded_at)}</span>
      </div>
    </div>
  );
}

function TopicCard({ topic, index }) {
  const rankColors = ["#ffd600", "#f0ede6", "#ff6b35", "#888", "#888"];
  const delayClass = `animate-fade-up-delay-${index + 1}`;
  return (
    <div className={delayClass} style={{ background: "#111111", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "24px", position: "relative", overflow: "hidden", transition: "border-color 0.2s, transform 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "#3a3a3a"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ position: "absolute", top: "20px", right: "20px", fontFamily: "Syne, sans-serif", fontSize: "48px", fontWeight: 800, color: rankColors[index] || "#444", opacity: 0.15, lineHeight: 1 }}>
        {String(index + 1).padStart(2, "0")}
      </div>
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
      </div>
      <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "18px", fontWeight: 700, marginBottom: "10px", color: "#f0ede6", paddingRight: "40px" }}>{topic.name}</h3>
      <p style={{ color: "#9a9590", fontSize: "14px", marginBottom: "16px", lineHeight: 1.5 }}>{topic.summary}</p>
      <IntensityBar value={topic.intensity} />
      <div style={{ marginTop: "12px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {topic.sources?.map((s, i) => (
          <span key={i} style={{ fontSize: "11px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "4px", padding: "2px 8px", color: "#6b6660" }}>{s}</span>
        ))}
      </div>
    </div>
  );
}

function ForeignAlertCard({ alert }) {
  const sectorColors = { oil: "#ff6b35", forex: "#ffd600", diaspora: "#a78bfa", trade: "#60a5fa", security: "#f87171", food: "#4ade80", other: "#9a9590" };
  const sectorIcons = { oil: "🛢️", forex: "💵", diaspora: "🌍", trade: "🚢", security: "🔒", food: "🌾", other: "⚡" };
  const color = sectorColors[alert.impact_sector] || "#9a9590";
  const icon = sectorIcons[alert.impact_sector] || "⚡";
  return (
    <div style={{ background: "#111", border: `1px solid ${color}30`, borderRadius: "12px", padding: "20px", overflow: "hidden", position: "relative", transition: "transform 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      <div style={{ position: "absolute", top: 0, left: 0, width: "3px", height: "100%", background: color }} />
      <div style={{ paddingLeft: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>{icon}</span>
            <span style={{ fontSize: "11px", background: `${color}20`, border: `1px solid ${color}40`, color, borderRadius: "4px", padding: "2px 8px", fontWeight: 600, letterSpacing: "0.05em" }}>{alert.impact_sector?.toUpperCase()}</span>
            <span style={{ fontSize: "11px", color: "#4a4a4a" }}>{alert.country}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "11px", color: "#4a4a4a" }}>Impact</span>
            <span style={{ fontFamily: "Syne, sans-serif", fontSize: "16px", fontWeight: 800, color }}>{alert.impact_score}</span>
          </div>
        </div>
        <h4 style={{ fontFamily: "Syne, sans-serif", fontSize: "15px", fontWeight: 700, color: "#f0ede6", marginBottom: "8px" }}>{alert.event}</h4>
        <p style={{ fontSize: "13px", color: "#9a9590", marginBottom: "12px", lineHeight: 1.5 }}>{alert.nigeria_impact}</p>
        <div style={{ background: "#1a1a1a", borderRadius: "6px", padding: "10px 12px" }}>
          <p style={{ fontSize: "11px", color: "#4a4a4a", letterSpacing: "0.08em", marginBottom: "3px" }}>WHAT TO WATCH</p>
          <p style={{ fontSize: "12px", color: "#6b6660", margin: 0, lineHeight: 1.4 }}>{alert.what_to_watch}</p>
        </div>
      </div>
    </div>
  );
}

function NewsItem({ article }) {
  return (
    <a href={article.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
      <div style={{ padding: "16px 0", borderBottom: "1px solid #1a1a1a", transition: "padding-left 0.15s", cursor: "pointer" }}
        onMouseEnter={e => e.currentTarget.style.paddingLeft = "8px"}
        onMouseLeave={e => e.currentTarget.style.paddingLeft = "0"}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
              <span style={{ fontSize: "11px", color: "#00c853", fontWeight: 500 }}>{article.source}</span>
              <span style={{ fontSize: "11px", color: "#3a3a3a" }}>•</span>
              <span style={{ fontSize: "11px", color: "#4a4a4a" }}>{article.category}</span>
            </div>
            <p style={{ fontSize: "14px", color: "#c8c4bc", lineHeight: 1.4 }}>{article.title}</p>
          </div>
          <span style={{ fontSize: "11px", color: "#4a4a4a", whiteSpace: "nowrap", marginTop: "2px" }}>{timeAgo(article.scraped_at)}</span>
        </div>
      </div>
    </a>
  );
}

function SocialCard({ item, accentColor }) {
  return (
    <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
      <div style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "10px", padding: "16px", transition: "border-color 0.2s, transform 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = `${accentColor}50`; e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.transform = "translateY(0)"; }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "8px" }}>
          <span style={{ fontSize: "10px", background: `${accentColor}18`, border: `1px solid ${accentColor}35`, color: accentColor, borderRadius: "4px", padding: "2px 7px", fontWeight: 600, whiteSpace: "nowrap" }}>{item.source}</span>
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

function SocialSectionHeader({ icon, label, color, count, subtitle }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
      <span style={{ fontSize: "16px" }}>{icon}</span>
      <h4 style={{ fontFamily: "Syne, sans-serif", fontSize: "13px", fontWeight: 700, color, letterSpacing: "0.1em", margin: 0 }}>{label}</h4>
      <span style={{ fontSize: "11px", color: "#4a4a4a" }}>{count} {subtitle}</span>
    </div>
  );
}

export default function Home() {
  const [pulse, setPulse] = useState(null);
  const [news, setNews] = useState([]);
  const [foreignAlerts, setForeignAlerts] = useState([]);
  const [socialSignals, setSocialSignals] = useState([]);
  const [nairaRate, setNairaRate] = useState(null);
  const [refreshCountdown, setRefreshCountdown] = useState(300);
  const [loading, setLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(true);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [socialLoading, setSocialLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeTab, setActiveTab] = useState("pulse");
  const [subscribeName, setSubscribeName] = useState("");
const [subscribeEmail, setSubscribeEmail] = useState("");
const [subscribeWhatsapp, setSubscribeWhatsapp] = useState("");
const [subscribeLoading, setSubscribeLoading] = useState(false);
const [subscribeSuccess, setSubscribeSuccess] = useState(false);
const [subscribeError, setSubscribeError] = useState("");

  const fetchPulse = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/pulse`);
      const data = await res.json();
      if (data.success) { setPulse(data.data); setLastUpdated(new Date()); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  const fetchNews = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/news?limit=40`);
      const data = await res.json();
      if (data.success) setNews(data.data);
    } catch (e) { console.error(e); }
    finally { setNewsLoading(false); }
  }, []);

  const fetchForeignAlerts = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/foreign-alerts`);
      const data = await res.json();
      if (data.success) setForeignAlerts(data.data);
    } catch (e) { console.error(e); }
    finally { setAlertsLoading(false); }
  }, []);

  const fetchSocialSignals = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/news?limit=200`);
      const data = await res.json();
      if (data.success) {
        const social = data.data.filter(a =>
          ["social_reddit","social_video","social_signal","social_twitter","social_official","trending_search"].includes(a.category)
        );
        setSocialSignals(social);
      }
    } catch (e) { console.error(e); }
    finally { setSocialLoading(false); }
  }, []);

  const fetchNairaRate = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/naira`);
      const data = await res.json();
      if (data.success && data.data?.length > 0) setNairaRate(data.data[0]);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    fetchPulse(); fetchNews(); fetchForeignAlerts(); fetchSocialSignals(); fetchNairaRate();
    const refreshId = setInterval(() => {
      fetchPulse(); fetchNews(); fetchForeignAlerts(); fetchNairaRate();
      setRefreshCountdown(300);
    }, 5 * 60 * 1000);
    const countdownId = setInterval(() => {
      setRefreshCountdown(prev => prev > 0 ? prev - 1 : 300);
    }, 1000);
    return () => { clearInterval(refreshId); clearInterval(countdownId); };
  }, [fetchPulse, fetchNews, fetchForeignAlerts, fetchSocialSignals, fetchNairaRate]);

  const formatTime = (d) => d ? new Date(d).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }) : "";

  const reddit  = socialSignals.filter(s => s.category === "social_reddit");
  const trends  = socialSignals.filter(s => s.category === "trending_search");
  const youtube = socialSignals.filter(s => s.category === "social_video");
  const signals = socialSignals.filter(s => s.category === "social_signal");

  const tabs = [
    { id: "pulse",   label: "🔥 TOP PULSE" },
    { id: "foreign", label: "🌍 GLOBAL IMPACT" },
    { id: "news",    label: "📰 LATEST NEWS" },
    { id: "social",  label: "📱 SOCIAL SIGNALS" },
  ];

  const SOURCES_LIST = [
    "Punch Nigeria","Vanguard Nigeria","Channels TV","Premium Times","Daily Trust",
    "Nairametrics","Sahara Reporters","Legit Nigeria","Daily Post Nigeria","HumAngle",
    "TVC News","Blueprint Nigeria","Sun Nigeria","Leadership Nigeria","Tribune Nigeria",
    "Arewa Agenda","Naija News","Naija247News","BusinessDay Nigeria",
    "BBC Africa","Al Jazeera Africa","Reuters Africa","VOA Africa",
  ];

  const handleSubscribe = async () => {
  if (!subscribeEmail) {
    setSubscribeError("Please enter your email address.");
    return;
  }
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
    if (data.success) {
      setSubscribeSuccess(true);
    } else {
      setSubscribeError(data.error || "Something went wrong. Try again.");
    }
  } catch (e) {
    setSubscribeError("Connection error. Make sure the server is running.");
  } finally {
    setSubscribeLoading(false);
  }
};

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a" }}>

      {/* ── Header ── */}
      <header style={{ borderBottom: "1px solid #1a1a1a", padding: "0 24px", position: "sticky", top: 0, background: "rgba(10,10,10,0.95)", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "22px" }}>🇳🇬</span>
            <div>
              <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "18px", fontWeight: 800, letterSpacing: "-0.02em", color: "#f0ede6", margin: 0 }}>
                NIGERIA <span style={{ color: "#008751" }}>PULSE</span>
              </h1>
              <p style={{ fontSize: "10px", color: "#4a4a4a", letterSpacing: "0.1em", margin: 0 }}>REAL-TIME SENTIMENT INTELLIGENCE</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {lastUpdated && (
              <>
                <span style={{ fontSize: "12px", color: "#4a4a4a" }}>Updated {formatTime(lastUpdated)}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "6px", padding: "4px 10px" }}>
                  <span style={{ fontSize: "10px", color: "#4a4a4a" }}>REFRESH IN</span>
                  <span style={{ fontFamily: "Syne, sans-serif", fontSize: "12px", fontWeight: 700, color: "#ffd600" }}>
                    {Math.floor(refreshCountdown / 60)}:{String(refreshCountdown % 60).padStart(2, "0")}
                  </span>
                </div>
              </>
            )}
            <LiveDot />
          </div>
        </div>
      </header>

      {/* ── Naira Rate Bar ── */}
      <NairaRateBar nairaRate={nairaRate} formatTime={formatTime} />

      {/* ── News Ticker ── */}
      <NewsTicker articles={news.slice(0, 10)} />

      {/* ── Hero ── */}
      <div style={{ padding: "48px 24px 32px", maxWidth: "1200px", margin: "0 auto" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.15em", color: "#008751", fontWeight: 600, marginBottom: "8px" }}>THE MIRROR OF WHAT NIGERIA IS THINKING</p>
        <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "16px" }}>
          Top Stories<br /><span style={{ color: "#2a2a2a" }}>Right Now</span>
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "13px", color: "#6b6660" }}>{pulse?.total_articles_analyzed || 0} signals analyzed</span>
          <span style={{ fontSize: "13px", color: "#3a3a3a" }}>·</span>
          <span style={{ fontSize: "13px", color: "#6b6660" }}>23 sources</span>
          {nairaRate && (<><span style={{ fontSize: "13px", color: "#3a3a3a" }}>·</span><span style={{ fontSize: "13px", color: "#ffd600" }}>💵 $1 = ₦{Number(nairaRate.usd_to_ngn).toFixed(0)}</span></>)}
          {socialSignals.length > 0 && (<><span style={{ fontSize: "13px", color: "#3a3a3a" }}>·</span><span style={{ fontSize: "13px", color: "#a78bfa" }}>📱 {socialSignals.length} social signals</span></>)}
          {foreignAlerts.length > 0 && (<><span style={{ fontSize: "13px", color: "#3a3a3a" }}>·</span><span style={{ fontSize: "13px", color: "#ff6b35" }}>🌍 {foreignAlerts.length} global alerts</span></>)}
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

      {/* ── Content ── */}
      <main style={{ padding: "0 24px 80px", maxWidth: "1200px", margin: "0 auto" }}>

        {/* PULSE TAB */}
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
                <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", marginBottom: "8px" }}>No pulse data yet</h3>
                <p style={{ color: "#6b6660" }}>The scraper is warming up. Check back in a few minutes.</p>
              </div>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "16px" }}>
                  {pulse.top_topics?.map((topic, i) => <TopicCard key={i} topic={topic} index={i} />)}
                </div>
                <div style={{ marginTop: "40px", padding: "24px", background: "#111", border: "1px solid #2a2a2a", borderRadius: "12px", display: "flex", gap: "40px", flexWrap: "wrap" }}>
                  {[
                    { label: "SIGNALS ANALYZED", value: pulse.total_articles_analyzed, color: "#f0ede6" },
                    { label: "TOPICS TRACKED", value: pulse.top_topics?.length, color: "#f0ede6" },
                    { label: "GOVT AGENDA", value: pulse.top_topics?.filter(t => t.in_govt_agenda).length, color: "#008751" },
                    { label: "SOCIAL SIGNALS", value: socialSignals.length, color: "#a78bfa" },
                    { label: "GLOBAL ALERTS", value: foreignAlerts.length, color: "#ff6b35" },
                    { label: "NAIRA RATE", value: nairaRate ? `₦${Number(nairaRate.usd_to_ngn).toFixed(0)}` : "—", color: "#ffd600" },
                    { label: "LAST GENERATED", value: formatTime(pulse.generated_at), color: "#ffd600" },
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <div style={{ fontSize: "11px", color: "#4a4a4a", letterSpacing: "0.1em", marginBottom: "4px" }}>{label}</div>
                      <div style={{ fontFamily: "Syne, sans-serif", fontSize: "24px", fontWeight: 800, color }}>{value}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* FOREIGN ALERTS TAB */}
        {activeTab === "foreign" && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "13px", fontWeight: 700, color: "#ff6b35", letterSpacing: "0.1em", marginBottom: "8px" }}>🌍 GLOBAL EVENTS AFFECTING NIGERIA</h3>
              <p style={{ fontSize: "14px", color: "#6b6660" }}>Foreign events detected by AI that directly impact Nigeria through oil, forex, diaspora, trade, security or food channels.</p>
            </div>
            {alertsLoading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "16px" }}>
                {[1,2,3].map(i => <div key={i} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "20px", height: "160px" }}><div className="skeleton" style={{ height: "12px", width: "30%", marginBottom: "12px" }} /></div>)}
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
                        <span style={{ fontSize: "12px", color, fontWeight: 600, letterSpacing: "0.05em" }}>{sector.toUpperCase()}</span>
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

        {/* NEWS TAB */}
        {activeTab === "news" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "40px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "16px", fontWeight: 700, color: "#6b6660" }}>LATEST ARTICLES</h3>
                <span style={{ fontSize: "12px", color: "#4a4a4a" }}>{news.length} articles</span>
              </div>
              {newsLoading ? [1,2,3,4,5].map(i => (
                <div key={i} style={{ padding: "16px 0", borderBottom: "1px solid #1a1a1a" }}>
                  <div className="skeleton" style={{ height: "12px", width: "30%", marginBottom: "8px" }} />
                  <div className="skeleton" style={{ height: "16px", width: "90%" }} />
                </div>
              )) : news.map((article, i) => <NewsItem key={i} article={article} />)}
            </div>
            <div>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "16px", fontWeight: 700, color: "#6b6660", marginBottom: "16px" }}>SOURCES</h3>
              {SOURCES_LIST.map((s, i) => {
                const count = news.filter(a => a.source === s).length;
                const isIntl = ["BBC Africa","Al Jazeera Africa","Reuters Africa","VOA Africa"].includes(s);
                return (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1a1a1a" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: count > 0 ? (isIntl ? "#60a5fa" : "#00c853") : "#2a2a2a" }} />
                      <span style={{ fontSize: "12px", color: isIntl ? "#6b7faa" : "#9a9590" }}>{s}</span>
                      {isIntl && <span style={{ fontSize: "9px", color: "#3a3a3a", background: "#1a1a1a", borderRadius: "3px", padding: "1px 5px" }}>INTL</span>}
                    </div>
                    <span style={{ fontSize: "12px", color: "#4a4a4a", fontFamily: "Syne, sans-serif", fontWeight: 700 }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SOCIAL SIGNALS TAB */}
        {activeTab === "social" && (
          <div>
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "13px", fontWeight: 700, color: "#a78bfa", letterSpacing: "0.1em", marginBottom: "8px" }}>📱 SOCIAL MEDIA & SIGNAL INTELLIGENCE</h3>
              <p style={{ fontSize: "14px", color: "#6b6660" }}>Real-time signals from Reddit, YouTube, Google Trends — what Nigerians are actually discussing.</p>
            </div>
            {socialLoading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "12px" }}>
                {[1,2,3,4,5,6].map(i => <div key={i} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "20px", height: "110px" }}><div className="skeleton" style={{ height: "12px", width: "30%", marginBottom: "12px" }} /></div>)}
              </div>
            ) : socialSignals.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📡</div>
                <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", marginBottom: "8px" }}>No social signals yet</h3>
                <p style={{ color: "#6b6660" }}>Social signals are collected every 2 hours.</p>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "40px" }}>
                  {[
                    { label: "Reddit", color: "#ff6b35", icon: "💬", data: reddit },
                    { label: "YouTube", color: "#f87171", icon: "▶️", data: youtube },
                    { label: "Google Trends", color: "#ffd600", icon: "🔍", data: trends },
                    { label: "Topic Feeds", color: "#00c853", icon: "📡", data: signals },
                  ].map(({ label, color, icon, data }) => {
                    if (!data.length) return null;
                    return (
                      <div key={label} style={{ display: "flex", alignItems: "center", gap: "10px", background: `${color}10`, border: `1px solid ${color}25`, borderRadius: "8px", padding: "10px 18px" }}>
                        <span style={{ fontSize: "16px" }}>{icon}</span>
                        <div>
                          <div style={{ fontSize: "10px", color, fontWeight: 600, letterSpacing: "0.06em" }}>{label}</div>
                          <div style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", fontWeight: 800, color, lineHeight: 1 }}>{data.length}</div>
                        </div>
                      </div>
                    );
                  })}
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
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#111", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "10px 18px", transition: "border-color 0.2s" }}
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
                      {youtube.slice(0, 9).map((video, i) => <SocialCard key={i} item={{ ...video, source: video.source?.replace(" YouTube", "") }} accentColor="#f87171" />)}
                    </div>
                  </div>
                )}

                {signals.length > 0 && (
                  <div style={{ marginBottom: "48px" }}>
                    <SocialSectionHeader icon="📡" label="EDITORIAL FOCUS SIGNALS" color="#00c853" count={signals.length} subtitle="articles" />
                    <div style={{ borderRadius: "10px", border: "1px solid #2a2a2a", overflow: "hidden" }}>
                      {signals.slice(0, 14).map((item, i) => (
                        <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                          <div style={{ padding: "14px 18px", borderBottom: i < 13 ? "1px solid #1a1a1a" : "none", background: "#111", transition: "background 0.15s, padding-left 0.15s" }}
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

      {/* Subscribe Section */}
<div style={{ borderTop: "1px solid #1a1a1a", padding: "64px 24px" }}>
  <div style={{ maxWidth: "560px", margin: "0 auto", textAlign: "center" }}>
    <p style={{ fontSize: "11px", color: "#008751", letterSpacing: "0.15em", fontWeight: 600, marginBottom: "12px" }}>
      STAY INFORMED
    </p>
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
        <input
          type="text"
          placeholder="Your name"
          value={subscribeName}
          onChange={e => setSubscribeName(e.target.value)}
          style={{ width: "100%", padding: "14px 16px", background: "#111", border: "1px solid #2a2a2a", borderRadius: "8px", color: "#f0ede6", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
          onFocus={e => e.target.style.borderColor = "#008751"}
          onBlur={e => e.target.style.borderColor = "#2a2a2a"}
        />
        <input
          type="email"
          placeholder="Email address"
          value={subscribeEmail}
          onChange={e => setSubscribeEmail(e.target.value)}
          style={{ width: "100%", padding: "14px 16px", background: "#111", border: "1px solid #2a2a2a", borderRadius: "8px", color: "#f0ede6", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
          onFocus={e => e.target.style.borderColor = "#008751"}
          onBlur={e => e.target.style.borderColor = "#2a2a2a"}
        />
        <input
          type="tel"
          placeholder="WhatsApp number (optional) e.g. +2348012345678"
          value={subscribeWhatsapp}
          onChange={e => setSubscribeWhatsapp(e.target.value)}
          style={{ width: "100%", padding: "14px 16px", background: "#111", border: "1px solid #2a2a2a", borderRadius: "8px", color: "#f0ede6", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
          onFocus={e => e.target.style.borderColor = "#008751"}
          onBlur={e => e.target.style.borderColor = "#2a2a2a"}
        />
        {subscribeError && (
          <p style={{ fontSize: "13px", color: "#f87171", margin: 0 }}>{subscribeError}</p>
        )}
        <button
          onClick={handleSubscribe}
          disabled={subscribeLoading}
          style={{ width: "100%", padding: "14px", background: subscribeLoading ? "#1a1a1a" : "#008751", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontFamily: "Syne, sans-serif", fontWeight: 700, cursor: subscribeLoading ? "not-allowed" : "pointer", letterSpacing: "0.05em", transition: "background 0.2s" }}
        >
          {subscribeLoading ? "Subscribing..." : "SUBSCRIBE FREE →"}
        </button>
        <p style={{ fontSize: "11px", color: "#3a3a3a", margin: 0 }}>
          No spam. Unsubscribe anytime. 🇳🇬
        </p>
      </div>
    )}
  </div>
</div>

<footer style={{ borderTop: "1px solid #1a1a1a", padding: "24px", textAlign: "center" }}>
  <p style={{ fontSize: "12px", color: "#3a3a3a" }}>
    🇳🇬 Nigeria Pulse — Auto-refreshes every 5 minutes · 23 sources · Built for the people
  </p>
</footer>
    </div>
  );
}