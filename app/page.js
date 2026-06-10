"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const TRANSLATIONS = {
  en: {
    tagline: "Real-Time National Intelligence",
    liveLabel: "LIVE",
    updated: "Updated",
    heroOverline: "What Nigeria Is Thinking Right Now",
    heroSuffix: "is the story dominating Nigeria",
    heroDefault: "Nigeria's National Intelligence Feed",
    heroDesc: "AI-powered analysis of 23+ Nigerian news sources, updated every 2 hours",
    signalsAnalyzed: "signals analyzed",
    sources: "23+ sources",
    socialCount: "social signals",
    alertsCount: "global alerts",
    tabs: ["National Pulse", "Global Impact", "Social Signals"],
    topicsLabel: "TOP 5 TRENDING TOPICS",
    autoRefresh: "Auto-refreshes every 5 min",
    clickRead: "Read full story →",
    govtBadge: "Govt Agenda",
    globalBadge: "Global Impact",
    whatToWatch: "WHAT TO WATCH",
    impact: "Impact",
    globalTitle: "Global Events Affecting Nigeria",
    globalDesc: "Foreign developments tracked by AI with direct impact on Nigeria through oil, forex, trade, security and food channels.",
    socialTitle: "Social Media Intelligence",
    socialDesc: "Real-time signals from Reddit, YouTube, and Google Trends — the unfiltered Nigerian public conversation.",
    warmingUp: "Warming up…",
    warmingUpMsg: "The intelligence engine is starting. Check back in 2 minutes.",
    noAlerts: "No global alerts right now",
    noAlertsMsg: "The AI will detect foreign events on the next refresh.",
    noSocial: "No social signals yet",
    noSocialMsg: "Social signals are collected every 2 hours.",
    stayInformed: "Stay Informed",
    subscribeTitle: "Get the Nigeria Pulse digest",
    subscribeDesc: "Top 5 trending topics delivered every day at 6AM and 6PM WAT. Free forever.",
    subscribeCTA: "Subscribe Free",
    namePlaceholder: "Your name",
    emailPlaceholder: "Email address",
    whatsappPlaceholder: "WhatsApp number (optional)",
    subscribing: "Subscribing…",
    subscribed: "You're in!",
    subscribedMsg: "Your first digest arrives at 6AM tomorrow.",
    noSpam: "No spam. Unsubscribe anytime.",
    footerBuilt: "Built for the people of Nigeria",
    aiAsk: "Ask about Nigerian news…",
    aiTitle: "Nigeria Pulse AI",
    aiSubtitle: "Ask me anything about Nigeria",
    aiWelcome: "Hello! Ask me about trending topics, the economy, politics, or anything happening in Nigeria right now.",
    aiSend: "Send",
    aiShare: "Share this",
    react: "React",
    trending: "Trending",
    mapTitle: "Regional Sentiment",
    mapSub: "Public mood by geopolitical zone",
  },
  ha: {
    tagline: "Bayanan Ƙasa Na Ainihin Lokaci",
    liveLabel: "RAYUWA",
    updated: "An sabunta",
    heroOverline: "Abin da Najeriya ke Tunani Yanzu",
    heroSuffix: "shine labarin da ke mulkin Najeriya",
    heroDefault: "Cibiyar Bayanan Ƙasa ta Najeriya",
    heroDesc: "Nazarin AI na 23+ kafofin labarun Najeriya, ana sabuntawa kowace sa'a 2",
    signalsAnalyzed: "alamomi da aka nazarta",
    sources: "23+ kafofin labarai",
    socialCount: "alamomin zamantakewa",
    alertsCount: "faɗakarwar duniya",
    tabs: ["Bugun Ƙasa", "Tasirin Duniya", "Alamomin Zamantakewa"],
    topicsLabel: "MANYAN BATUTUWA 5 MASU ZUWA",
    autoRefresh: "Ana sabuntawa kowace dakika 5",
    clickRead: "Karanta cikakken labari →",
    govtBadge: "Ajanda GVT",
    globalBadge: "Tasirin Duniya",
    whatToWatch: "ABIN DA ZA A KIYAYE",
    impact: "Tasiri",
    globalTitle: "Abubuwan Duniya da ke Shafar Najeriya",
    globalDesc: "Ci gaban waje da AI ke bin sa tare da tasiri kai tsaye a Najeriya ta man fetur, forex, kasuwanci, tsaro da hanyoyin abinci.",
    socialTitle: "Bayanai na Kafofin Sada Zumunta",
    socialDesc: "Alamomi na ainihin lokaci daga Reddit, YouTube, da Google Trends — tattaunawar jama'ar Najeriya ba tare da tace ba.",
    warmingUp: "Ana ɗumama…",
    warmingUpMsg: "Injin bayanan yana farawa. Dawo bayan dakika 2.",
    noAlerts: "Babu faɗakarwar duniya yanzu",
    noAlertsMsg: "AI za ta gano abubuwan waje a sabuntawa na gaba.",
    noSocial: "Babu alamomin zamantakewa tukuna",
    noSocialMsg: "Ana tattara alamomin zamantakewa kowace awa 2.",
    stayInformed: "Kasance Cikin Sani",
    subscribeTitle: "Karɓi taƙaitawar Nigeria Pulse",
    subscribeDesc: "Manyan batutuwa 5 da aka isar kowace rana da 6AM da 6PM WAT. Kyauta har abada.",
    subscribeCTA: "Rijista Kyauta",
    namePlaceholder: "Sunanka",
    emailPlaceholder: "Adireshin imel",
    whatsappPlaceholder: "Lambar WhatsApp (zaɓi)",
    subscribing: "Ana rijista…",
    subscribed: "Kun shiga!",
    subscribedMsg: "Farkon taƙaitawar ku ya isa 6AM gobe.",
    noSpam: "Babu spam. Ka cire rijista a kowane lokaci.",
    footerBuilt: "An gina don jama'ar Najeriya",
    aiAsk: "Tambaya game da labarun Najeriya…",
    aiTitle: "Nigeria Pulse AI",
    aiSubtitle: "Tambaye ni kowane abu game da Najeriya",
    aiWelcome: "Sannu! Tambaye ni game da batutuwan da ke zafi, tattalin arziki, siyasa, ko kowane abu da ke faruwa a Najeriya yanzu.",
    aiSend: "Aika",
    aiShare: "Raba wannan",
    react: "Amsa",
    trending: "Mafi Shahara",
    mapTitle: "Yanayin Yanki",
    mapSub: "Yanayin ra'ayin jama'a ta yankin geopolitical",
  },
  yo: {
    tagline: "Ìmọ̀ Orílẹ̀-Èdè Àkókò Gidi",
    liveLabel: "ÀKÓKÒ GIDI",
    updated: "Tí a ṣàtúnṣe",
    heroOverline: "Ohun tí Nàìjíríà Ń Ronú Báyìí",
    heroSuffix: "ni ìtàn tó ń ṣe ako Nàìjíríà",
    heroDefault: "Ibi Ìmọ̀ Orílẹ̀-Èdè Nàìjíríà",
    heroDesc: "Ìtúpalẹ̀ AI ti 23+ orísun ìròyìn Nàìjíríà, tí a ṣàtúnṣe gbogbo wakati 2",
    signalsAnalyzed: "àwọn àmì tí a ṣe àyẹ̀wò",
    sources: "23+ orísun",
    socialCount: "àwọn àmì àwùjọ",
    alertsCount: "ìkìlọ̀ àgbáyé",
    tabs: ["Ìgbóná Orílẹ̀-Èdè", "Ipa Àgbáyé", "Àwọn Àmì Àwùjọ"],
    topicsLabel: "TOP 5 ÀWỌ̀N ÌSỌ̀RỌ̀ TÍ Ó GBÉNI",
    autoRefresh: "A maa n ṣàtúnṣe gbogbo ìṣẹ́jú 5",
    clickRead: "Ka ìtàn kíkún →",
    govtBadge: "Ètò Ìjọba",
    globalBadge: "Ipa Àgbáyé",
    whatToWatch: "OHUN TÍ A MÀA N ṢÀ",
    impact: "Ipa",
    globalTitle: "Àwọn Ìṣẹ̀lẹ̀ Àgbáyé tó Ní Ipa lórí Nàìjíríà",
    globalDesc: "Àwọn ìdàgbàsókè àgbáyé tí AI ń tọpasẹ̀ pẹ̀lú ipa tààràtà lórí Nàìjíríà.",
    socialTitle: "Ìmọ̀ Àwọn Ìkaàwé Àwùjọ",
    socialDesc: "Àwọn àmì àkókò gidi láti Reddit, YouTube, àti Google Trends — ìjíròrò àwùjọ ará Nàìjíríà.",
    warmingUp: "N gbóná soke…",
    warmingUpMsg: "Ẹ̀rọ ìmọ̀ n bẹ̀rẹ̀. Padà wá ní ìṣẹ́jú 2.",
    noAlerts: "Kò sí ìkìlọ̀ àgbáyé báyìí",
    noAlertsMsg: "AI yóò ṣàwárí àwọn ìṣẹ̀lẹ̀ àgbáyé ní ìmúdójúìwọ̀n tókàn.",
    noSocial: "Kò sí àwọn àmì àwùjọ tí ó tí",
    noSocialMsg: "A n kó àwọn àmì àwùjọ gbogbo wakati 2.",
    stayInformed: "Mọ Ohun tí Ń Ṣẹlẹ̀",
    subscribeTitle: "Gba àkópọ̀ Nigeria Pulse",
    subscribeDesc: "Àwọn ìsọ̀rọ̀ gbígbóná 5 tí a firanṣẹ́ ní gbogbo ọjọ́ ní 6AM àti 6PM WAT. Ọfẹ láé.",
    subscribeCTA: "Forúkọsílẹ̀ Ọfẹ",
    namePlaceholder: "Orúkọ rẹ",
    emailPlaceholder: "Àdírẹ́sì email",
    whatsappPlaceholder: "Nọ́mbà WhatsApp (àṣeyọ̀rí)",
    subscribing: "N ṣe forúkọsílẹ̀…",
    subscribed: "O wà nínú!",
    subscribedMsg: "Àkókò àkọ́kọ́ rẹ dé ní 6AM ọlọ́la.",
    noSpam: "Kò sí spam. Yọ̀ orúkọ rẹ kúrò nígbàkúgbà.",
    footerBuilt: "Ti a kọ́ fún àwọn ènìyàn Nàìjíríà",
    aiAsk: "Béèrè nípa ìròyìn Nàìjíríà…",
    aiTitle: "Nigeria Pulse AI",
    aiSubtitle: "Béèrè lọ́wọ́ mi ohunkóhun nípa Nàìjíríà",
    aiWelcome: "Káàbọ̀! Béèrè lọ́wọ́ mi nípa àwọn ìsọ̀rọ̀ gbígbóná, ọrọ̀ ajé, ìṣèlú, tàbí ohunkóhun tí ń ṣẹlẹ̀ ní Nàìjíríà ní báyìí.",
    aiSend: "Firanṣẹ́",
    aiShare: "Pin eyi",
    react: "Fèsì",
    trending: "Tí Ó Gbéni",
    mapTitle: "Ìfẹ̀ Ẹkùn",
    mapSub: "Ìyọnu àwọn ènìyàn ní abala geopolitical",
  },
};

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

function LiveDot({ label }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "#dcfce7", border: "1px solid #86efac", borderRadius: "20px", padding: "4px 10px" }}>
      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#16a34a", display: "inline-block", animation: "pulseDot 1.5s ease infinite" }} />
      <span style={{ fontSize: "10px", color: "#15803d", fontWeight: 700, letterSpacing: "0.1em" }}>{label}</span>
    </span>
  );
}

function NewsTicker({ articles }) {
  if (!articles.length) return null;
  const items = [...articles, ...articles];
  return (
    <div style={{ background: "#008751", padding: "9px 0", overflow: "hidden" }}>
      <div style={{ display: "flex", gap: "56px", animation: "ticker 80s linear infinite", whiteSpace: "nowrap" }}>
        {items.map((a, i) => (
          <span key={i} style={{ fontSize: "12px", color: "#fff", fontWeight: 500, flexShrink: 0, letterSpacing: "0.01em" }}>
            <span style={{ opacity: 0.4, marginRight: "14px", fontSize: "10px" }}>—</span>{a.title}
          </span>
        ))}
      </div>
    </div>
  );
}

function IntensityBar({ value }) {
  const color = value >= 8 ? "#dc2626" : value >= 5 ? "#d97706" : "#16a34a";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div style={{ flex: 1, height: "3px", background: "#e5e7eb", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{ width: `${value * 10}%`, height: "100%", background: color, borderRadius: "2px", transition: "width 1s ease" }} />
      </div>
      <span style={{ fontSize: "11px", color, fontWeight: 700, minWidth: "28px", textAlign: "right" }}>{value}/10</span>
    </div>
  );
}

function TopicCard({ topic, index, isActive, t, reactions, onReact, onDetailClick }) {
  const accentColors = ["#008751", "#2563eb", "#dc2626", "#d97706", "#7c3aed"];
  const color = accentColors[index] || "#6b7280";
  return (
    <div
      onClick={onDetailClick}
      style={{ background: "#fff", border: `1px solid ${isActive ? color + "40" : "#e5e7eb"}`, borderRadius: "16px", overflow: "hidden", transition: "box-shadow 0.25s, transform 0.25s", boxShadow: isActive ? `0 6px 24px ${color}18` : "none", display: "flex", flexDirection: "column", cursor: "pointer" }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 10px 36px ${color}18`; e.currentTarget.style.transform = "translateY(-3px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = isActive ? `0 6px 24px ${color}18` : "none"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ height: "5px", background: color }} />
      <div style={{ padding: "20px 20px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "36px", fontWeight: 800, color: "#f3f4f6", lineHeight: 1, letterSpacing: "-0.03em" }}>{String(index + 1).padStart(2, "0")}</span>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "flex-end" }}>
            {topic.in_govt_agenda && <span style={{ fontSize: "9px", background: "#dcfce7", color: "#15803d", border: "1px solid #86efac", borderRadius: "20px", padding: "3px 8px", fontWeight: 600 }}>{t.govtBadge}</span>}
            {topic.foreign_impact && <span style={{ fontSize: "9px", background: "#fef3c7", color: "#92400e", border: "1px solid #fcd34d", borderRadius: "20px", padding: "3px 8px", fontWeight: 600 }}>{t.globalBadge}</span>}
            {topic.sentiment && (
              <span style={{ fontSize: "9px", background: topic.sentiment === "positive" ? "#dcfce7" : topic.sentiment === "negative" ? "#fee2e2" : "#f1f5f9", color: topic.sentiment === "positive" ? "#15803d" : topic.sentiment === "negative" ? "#b91c1c" : "#475569", borderRadius: "20px", padding: "3px 8px", fontWeight: 600, textTransform: "capitalize" }}>
                {topic.sentiment === "positive" ? "↑" : topic.sentiment === "negative" ? "↓" : "→"} {topic.sentiment}
              </span>
            )}
          </div>
        </div>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700, color: "#111827", lineHeight: 1.3, marginBottom: "8px" }}>{topic.name}</h3>
        <p style={{ fontSize: "13px", color: "#4b5563", lineHeight: 1.65, marginBottom: "16px", flex: 1 }}>{topic.summary}</p>
        <div style={{ marginBottom: "14px" }}>
          <div style={{ fontSize: "10px", color: "#9ca3af", letterSpacing: "0.1em", marginBottom: "6px" }}>INTENSITY</div>
          <IntensityBar value={topic.intensity} />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "14px" }}>
          {(topic.sources_cited || topic.sources || []).slice(0, 3).map((s, i) => (
            <span key={i} style={{ fontSize: "10px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "4px", padding: "2px 7px", color: "#6b7280" }}>{s}</span>
          ))}
          {topic.category && <span style={{ fontSize: "10px", background: color + "10", border: `1px solid ${color}30`, borderRadius: "4px", padding: "2px 7px", color, fontWeight: 600, marginLeft: "auto", textTransform: "uppercase" }}>{topic.category}</span>}
        </div>
        <div style={{ paddingTop: "12px", borderTop: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap" }}>
          {[{ key: "fire", label: "Hot" }, { key: "clap", label: "Good" }, { key: "angry", label: "Bad" }, { key: "wow", label: "Wow" }].map(({ key, label }) => (
            <button key={key} onClick={e => { e.stopPropagation(); onReact(topic.name, key); }}
              style={{ display: "flex", alignItems: "center", gap: "3px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "20px", padding: "4px 9px", cursor: "pointer", fontSize: "11px", color: "#6b7280", fontWeight: 500, fontFamily: "inherit" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f3f4f6"}
              onMouseLeave={e => e.currentTarget.style.background = "#f9fafb"}
            >
              <span>{label}</span>
              <span style={{ fontSize: "10px", color: "#9ca3af" }}>{reactions?.[key] || 0}</span>
            </button>
          ))}
          <button onClick={e => { e.stopPropagation(); onDetailClick(); }}
            style={{ marginLeft: "auto", fontSize: "11px", fontWeight: 700, color, background: color + "10", border: `1px solid ${color}30`, borderRadius: "20px", padding: "5px 12px", cursor: "pointer", fontFamily: "inherit" }}
            onMouseEnter={e => e.currentTarget.style.background = color + "20"}
            onMouseLeave={e => e.currentTarget.style.background = color + "10"}
          >Full analysis →</button>
        </div>
      </div>
    </div>
  );
}

function ForeignAlertCard({ alert }) {
  const sectorColors = { oil: "#ea580c", forex: "#d97706", diaspora: "#7c3aed", trade: "#2563eb", security: "#dc2626", food: "#16a34a", other: "#6b7280" };
  const sectorBgs = { oil: "#fff7ed", forex: "#fef3c7", diaspora: "#f5f3ff", trade: "#eff6ff", security: "#fee2e2", food: "#dcfce7", other: "#f9fafb" };
  const color = sectorColors[alert.impact_sector] || "#6b7280";
  const bg = sectorBgs[alert.impact_sector] || "#f9fafb";
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "14px", overflow: "hidden" }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ height: "4px", background: color }} />
      <div style={{ padding: "16px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "7px", flexWrap: "wrap" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: color, flexShrink: 0 }} />
            <span style={{ fontSize: "10px", background: bg, color, border: `1px solid ${color}30`, borderRadius: "20px", padding: "3px 9px", fontWeight: 700 }}>{(alert.impact_sector || "").toUpperCase()}</span>
            <span style={{ fontSize: "11px", color: "#9ca3af" }}>{alert.country}</span>
          </div>
          {alert.impact_score && (
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{ fontSize: "9px", color: "#9ca3af", margin: "0 0 1px", letterSpacing: "0.1em" }}>IMPACT</p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700, color, margin: 0, lineHeight: 1 }}>{alert.impact_score}</p>
            </div>
          )}
        </div>
        <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "14px", fontWeight: 700, color: "#111827", marginBottom: "7px", lineHeight: 1.3 }}>{alert.event}</h4>
        <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "10px", lineHeight: 1.55 }}>{alert.nigeria_impact}</p>
        {alert.what_to_watch && (
          <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "9px 11px" }}>
            <p style={{ fontSize: "9px", color: "#9ca3af", letterSpacing: "0.1em", marginBottom: "3px" }}>WHAT TO WATCH</p>
            <p style={{ fontSize: "12px", color: "#374151", margin: 0, lineHeight: 1.45 }}>{alert.what_to_watch}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SocialCard({ item, accentColor }) {
  return (
    <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "12px 14px", transition: "box-shadow 0.2s, transform 0.2s", height: "100%" }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "7px" }}>
          <span style={{ fontSize: "10px", background: accentColor + "12", border: `1px solid ${accentColor}30`, color: accentColor, borderRadius: "4px", padding: "2px 7px", fontWeight: 600 }}>{item.source}</span>
          <span style={{ fontSize: "10px", color: "#9ca3af", whiteSpace: "nowrap", flexShrink: 0 }}>{timeAgo(item.scraped_at)}</span>
        </div>
        <p style={{ fontSize: "13px", color: "#111827", lineHeight: 1.45, margin: 0 }}>{item.title}</p>
      </div>
    </a>
  );
}

function NigeriaMap({ t }) {
  const [hovered, setHovered] = useState(null);
  const zones = [
    { id: "nw", label: "North West", x: 120, y: 80, sentiment: "neutral", score: 5.2, topics: ["Security", "Agriculture"] },
    { id: "ne", label: "North East", x: 260, y: 70, sentiment: "negative", score: 7.1, topics: ["Security", "IDPs"] },
    { id: "nc", label: "North Central", x: 190, y: 155, sentiment: "neutral", score: 5.8, topics: ["Land disputes", "Power"] },
    { id: "sw", label: "South West", x: 110, y: 245, sentiment: "positive", score: 6.4, topics: ["Tech", "Economy"] },
    { id: "se", label: "South East", x: 250, y: 255, sentiment: "negative", score: 6.9, topics: ["Insecurity", "Tension"] },
    { id: "ss", label: "South South", x: 210, y: 310, sentiment: "neutral", score: 5.5, topics: ["Oil", "Environment"] },
  ];
  const sc = { positive: "#16a34a", negative: "#dc2626", neutral: "#d97706" };
  const sb = { positive: "#dcfce7", negative: "#fee2e2", neutral: "#fef3c7" };
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "20px" }}>
      <div style={{ marginBottom: "14px" }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "15px", fontWeight: 700, color: "#111827", marginBottom: "3px" }}>{t.mapTitle}</h3>
        <p style={{ fontSize: "12px", color: "#9ca3af" }}>{t.mapSub}</p>
      </div>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-start" }}>
        <svg viewBox="0 0 380 380" style={{ width: "100%", maxWidth: "260px", height: "auto", minWidth: "200px" }}>
          <path d="M60,60 L320,55 L340,200 L290,340 L160,355 L60,300 L30,180 Z" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="1.5" />
          {zones.map(z => (
            <g key={z.id} onMouseEnter={() => setHovered(z)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
              <circle cx={z.x} cy={z.y} r={hovered?.id === z.id ? 22 : 17} fill={sb[z.sentiment]} stroke={sc[z.sentiment]} strokeWidth="2" style={{ transition: "r 0.2s" }} />
              <circle cx={z.x} cy={z.y} r="5" fill={sc[z.sentiment]} />
              <text x={z.x} y={z.y + 32} textAnchor="middle" fontSize="9" fill="#374151" fontFamily="sans-serif" fontWeight="600">{z.label}</text>
            </g>
          ))}
        </svg>
        <div style={{ flex: 1, minWidth: "130px" }}>
          {[{ s: "positive", label: "Positive", color: "#16a34a" }, { s: "neutral", label: "Neutral", color: "#d97706" }, { s: "negative", label: "Negative", color: "#dc2626" }].map(item => (
            <div key={item.s} style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "8px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: item.color, flexShrink: 0 }} />
              <span style={{ fontSize: "12px", color: "#374151" }}>{item.label}</span>
            </div>
          ))}
          {hovered && (
            <div style={{ marginTop: "10px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "10px" }}>
              <p style={{ fontWeight: 700, fontSize: "12px", color: "#111827", marginBottom: "4px" }}>{hovered.label}</p>
              <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px" }}>Score: <strong style={{ color: "#111827" }}>{hovered.score}/10</strong></p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {hovered.topics.map(tp => <span key={tp} style={{ fontSize: "11px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "4px", padding: "2px 6px", color: "#374151" }}>{tp}</span>)}
              </div>
            </div>
          )}
          <div style={{ marginTop: "12px" }}>
            {zones.map(z => (
              <div key={z.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #f3f4f6" }}>
                <span style={{ fontSize: "11px", color: "#374151" }}>{z.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <div style={{ width: `${z.score * 6}px`, height: "3px", borderRadius: "2px", background: sc[z.sentiment] }} />
                  <span style={{ fontSize: "10px", color: "#9ca3af" }}>{z.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AIChatWidget({ t, isOpen, onClose, pulse }) {
  const [messages, setMessages] = useState([{ role: "assistant", content: t.aiWelcome }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const getShareText = () => {
    const lastAI = [...messages].reverse().find(m => m.role === "assistant");
    return lastAI
      ? `Nigeria Pulse AI: "${lastAI.content.slice(0, 120)}…" — nigeriapulse.com`
      : "Check out Nigeria Pulse — Real-Time National Intelligence. nigeriapulse.com";
  };

  const shareLinks = [
    { label: "WhatsApp", color: "#25d366", letter: "W", url: () => `https://wa.me/?text=${encodeURIComponent(getShareText())}` },
    { label: "X / Twitter", color: "#000", letter: "X", url: () => `https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText())}` },
    { label: "Facebook", color: "#1877f2", letter: "f", url: () => `https://www.facebook.com/sharer/sharer.php?u=https://nigeriapulse.com&quote=${encodeURIComponent(getShareText())}` },
    { label: "LinkedIn", color: "#0077b5", letter: "in", url: () => `https://www.linkedin.com/sharing/share-offsite/?url=https://nigeriapulse.com` },
    { label: "Copy link", color: "#6b7280", letter: "⧉", url: () => null, action: () => { navigator.clipboard?.writeText(getShareText()); setShowShare(false); } },
  ];

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);
    try {
      const context = pulse
        ? `Top topics: ${pulse.top_topics?.map(tp => tp.name).join(", ")}. Sentiment: ${pulse.overall_sentiment}.`
        : "";
      const res = await fetch(`${API}/api/ai-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context,
          messages: messages.filter(m => m.role !== "system").concat({ role: "user", content: userMsg }),
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.text || "Sorry, I could not get a response. Please try again.",
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Connection error. Please try again.",
      }]);
    } finally { setLoading(false); }
  };

  if (!isOpen) return null;

  // On mobile, make the chat full-screen
  const isMobileStyle = {
    position: "fixed",
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
    width: "100%",
    maxHeight: "100%",
    borderRadius: 0,
  };

  return (
    <>
      <style>{`
        @media (min-width: 480px) {
          .chat-widget {
            bottom: 88px !important;
            right: 24px !important;
            left: auto !important;
            top: auto !important;
            width: 360px !important;
            max-height: 540px !important;
            border-radius: 20px !important;
          }
        }
      `}</style>
      <div className="chat-widget" style={{ position: "fixed", bottom: 0, right: 0, left: 0, top: 0, width: "100%", maxHeight: "100%", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 0, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", zIndex: 1000, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ background: "#008751", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, color: "#fff", fontFamily: "'Playfair Display', serif", flexShrink: 0 }}>NP</div>
            <div>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: "13px", margin: 0, fontFamily: "'Playfair Display', serif" }}>{t.aiTitle}</p>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "10px", margin: 0 }}>{t.aiSubtitle}</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button onClick={() => setShowShare(s => !s)}
              style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "20px", padding: "5px 10px", color: "#fff", cursor: "pointer", fontSize: "11px", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ fontSize: "12px" }}>↗</span> <span className="share-label">{t.aiShare}</span>
            </button>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: "28px", height: "28px", color: "#fff", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>×</button>
          </div>
        </div>

        {showShare && (
          <div style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb", padding: "12px 16px", flexShrink: 0 }}>
            <p style={{ fontSize: "11px", color: "#6b7280", fontWeight: 600, letterSpacing: "0.08em", marginBottom: "10px", textTransform: "uppercase" }}>Share Nigeria Pulse</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {shareLinks.map(({ label, color, letter, url, action }) => (
                <a key={label} href={url() || undefined} target="_blank" rel="noopener noreferrer"
                  onClick={action ? e => { e.preventDefault(); action(); } : undefined} title={label}
                  style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#fff", border: `1.5px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontSize: "12px", fontWeight: 700, color, cursor: "pointer" }}
                  onMouseEnter={e => { e.currentTarget.style.background = color; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = color; }}
                >{letter}</a>
              ))}
            </div>
          </div>
        )}

        <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "82%", padding: "9px 13px", borderRadius: msg.role === "user" ? "14px 14px 3px 14px" : "14px 14px 14px 3px", background: msg.role === "user" ? "#008751" : "#f3f4f6", color: msg.role === "user" ? "#fff" : "#111827", fontSize: "13px", lineHeight: 1.5 }}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: "4px", padding: "9px 13px", background: "#f3f4f6", borderRadius: "14px 14px 14px 3px", width: "fit-content" }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#9ca3af", animation: `bounce 1.2s ${i * 0.2}s infinite` }} />)}
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div style={{ padding: "10px 14px", borderTop: "1px solid #e5e7eb", display: "flex", gap: "7px", flexShrink: 0 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder={t.aiAsk}
            style={{ flex: 1, padding: "10px 13px", border: "1px solid #e5e7eb", borderRadius: "20px", fontSize: "14px", outline: "none", color: "#111827", background: "#f9fafb" }} />
          <button onClick={send} style={{ background: "#008751", color: "#fff", border: "none", borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>→</button>
        </div>
      </div>
    </>
  );
}

function Skeleton({ h = 20, w = "100%", mb = 0, dark = false }) {
  const bg = dark
    ? "linear-gradient(90deg,#1a1a1a 25%,#222 50%,#1a1a1a 75%)"
    : "linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%)";
  return <div style={{ height: h, width: w, background: bg, backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: 8, marginBottom: mb }} />;
}

export default function Home() {
  const router = useRouter();
  const [pulse, setPulse] = useState(null);
  const [news, setNews] = useState([]);
  const [foreignAlerts, setForeignAlerts] = useState([]);
  const [socialSignals, setSocialSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [socialLoading, setSocialLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeTab, setActiveTab] = useState("pulse");
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [lang, setLang] = useState("en");
  const [darkMode, setDarkMode] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [reactions, setReactions] = useState({});
  const [subscribeName, setSubscribeName] = useState("");
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeWhatsapp, setSubscribeWhatsapp] = useState("");
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [subscribeError, setSubscribeError] = useState("");
  const [heroPulse, setHeroPulse] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const theme = darkMode ? {
    bg: "#0a0a0a", surface: "#111", surface2: "#1a1a1a", border: "#2a2a2a",
    text: "#f9fafb", textMuted: "#9ca3af", headerBg: "rgba(10,10,10,0.95)",
    cardBg: "#111", cardBorder: "#2a2a2a", inputBg: "#1a1a1a", inputBorder: "#2a2a2a", inputColor: "#f9fafb",
  } : {
    bg: "#f8fafc", surface: "#fff", surface2: "#f1f5f9", border: "#e5e7eb",
    text: "#111827", textMuted: "#6b7280", headerBg: "rgba(255,255,255,0.97)",
    cardBg: "#fff", cardBorder: "#e5e7eb", inputBg: "#fff", inputBorder: "#e5e7eb", inputColor: "#111827",
  };

  useEffect(() => {
    const id = setInterval(() => {
      setActiveTopicIndex(prev => (prev + 1) % 5);
      setHeroPulse(true);
      setTimeout(() => setHeroPulse(false), 700);
    }, 8000);
    return () => clearInterval(id);
  }, []);

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
          ["social_reddit", "social_video", "social_signal", "trending_search", "youtube_comment"].includes(a.category)
        );
        setSocialSignals(social);
      }
    } catch (e) { console.error(e); }
    finally { setSocialLoading(false); }
  }, []);

  useEffect(() => {
    fetchPulse(); fetchNews(); fetchForeignAlerts(); fetchSocialSignals();
    const id = setInterval(() => { fetchPulse(); fetchNews(); fetchForeignAlerts(); }, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [fetchPulse, fetchNews, fetchForeignAlerts, fetchSocialSignals]);

  const formatTime = d => d ? new Date(d).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }) : "";

  const reddit   = socialSignals.filter(s => s.category === "social_reddit");
  const trends   = socialSignals.filter(s => s.category === "trending_search");
  const youtube  = socialSignals.filter(s => s.category === "social_video");
  const comments = socialSignals.filter(s => s.category === "youtube_comment");
  const signals  = socialSignals.filter(s => s.category === "social_signal");

  const handleReact = (topicName, key) => {
    setReactions(prev => ({ ...prev, [topicName]: { ...(prev[topicName] || {}), [key]: ((prev[topicName]?.[key]) || 0) + 1 } }));
  };

  const handleSubscribe = async () => {
    if (!subscribeEmail) { setSubscribeError("Please enter your email address."); return; }
    setSubscribeLoading(true); setSubscribeError("");
    try {
      const res = await fetch(`${API}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: subscribeName, email: subscribeEmail, whatsapp: subscribeWhatsapp || null }),
      });
      const data = await res.json();
      if (data.success) setSubscribeSuccess(true);
      else setSubscribeError(data.error || "Something went wrong.");
    } catch { setSubscribeError("Connection error."); }
    finally { setSubscribeLoading(false); }
  };

  const tabs = [{ id: "pulse", label: t.tabs[0] }, { id: "foreign", label: t.tabs[1] }, { id: "social", label: t.tabs[2] }];
  const langs = [{ code: "en", label: "EN" }, { code: "ha", label: "HA" }, { code: "yo", label: "YO" }];
  const currentTopic = pulse?.top_topics?.[activeTopicIndex];

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.text, transition: "background 0.3s, color 0.3s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,700&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Source Serif 4', Georgia, serif; }
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.3)} }
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
        @keyframes heroFlash { 0%{opacity:0.4} 100%{opacity:1} }
        .topic-card { animation: fadeUp 0.5s ease both; }
        input::placeholder { color: #9ca3af; }
        input:focus { outline: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 2px; }

        /* ── RESPONSIVE GRID ── */
        .topics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }
        .alerts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 14px;
        }
        .social-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 10px;
        }
        .stats-row {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        .hero-stats {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .header-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .dark-toggle-label { display: inline; }
        .updated-label { display: inline; }

        @media (max-width: 640px) {
          .topics-grid { grid-template-columns: 1fr; }
          .alerts-grid { grid-template-columns: 1fr; }
          .social-grid { grid-template-columns: 1fr; }
          .hero-padding { padding: 32px 16px 28px !important; }
          .hero-title { font-size: 36px !important; }
          .hero-suffix { font-size: 18px !important; }
          .section-padding { padding: 24px 16px 80px !important; }
          .subscribe-section { padding: 48px 16px !important; }
          .footer-padding { padding: 28px 16px !important; }
          .tabs-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .tabs-scroll::-webkit-scrollbar { display: none; }
          .tab-btn { white-space: nowrap; padding: 12px 16px !important; font-size: 13px !important; }
          .dark-toggle-label { display: none; }
          .updated-label { display: none; }
          .hero-overline { font-size: 14px !important; }
          .stats-row { gap: 12px; }
          .map-container { flex-direction: column; }
        }

        @media (max-width: 480px) {
          .header-inner { height: 54px !important; }
          .brand-tagline { display: none; }
          .hero-watermark { display: none; }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
          .topics-grid { grid-template-columns: repeat(2, 1fr); }
          .alerts-grid { grid-template-columns: repeat(2, 1fr); }
          .hero-padding { padding: 48px 24px 40px !important; }
        }
      `}</style>

      {/* HEADER */}
      <header style={{ position: "sticky", top: 0, background: theme.headerBg, backdropFilter: "blur(14px)", borderBottom: `1px solid ${theme.border}`, zIndex: 100, padding: "0 16px" }}>
        <div className="header-inner" style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "62px", gap: "8px" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "#008751", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <div style={{ width: "12px", height: "2px", background: "#fff", borderRadius: "1px" }} />
            </div>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 800, color: theme.text, margin: 0 }}>Nigeria <span style={{ color: "#008751" }}>Pulse</span></h1>
              <p className="brand-tagline" style={{ fontSize: "8px", color: theme.textMuted, letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>{t.tagline}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="header-controls" style={{ flexShrink: 0 }}>
            {/* Language switcher */}
            <div style={{ display: "flex", background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: "20px", padding: "2px" }}>
              {langs.map(l => (
                <button key={l.code} onClick={() => setLang(l.code)}
                  style={{ padding: "4px 9px", borderRadius: "16px", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: 700, background: lang === l.code ? "#008751" : "transparent", color: lang === l.code ? "#fff" : theme.textMuted, transition: "all 0.2s", fontFamily: "'Source Serif 4', serif" }}>
                  {l.label}
                </button>
              ))}
            </div>

            {/* Dark mode */}
            <button onClick={() => setDarkMode(!darkMode)}
              style={{ background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: "20px", padding: "6px 10px", cursor: "pointer", fontSize: "13px", color: theme.text, display: "flex", alignItems: "center", gap: "4px" }}>
              {darkMode ? "☀" : "◑"} <span className="dark-toggle-label" style={{ fontSize: "12px" }}>{darkMode ? "Light" : "Dark"}</span>
            </button>

            {/* Updated time — hidden on small screens */}
            {lastUpdated && <span className="updated-label" style={{ fontSize: "10px", color: theme.textMuted, whiteSpace: "nowrap" }}>{t.updated} {formatTime(lastUpdated)}</span>}

            <LiveDot label={t.liveLabel} />
          </div>
        </div>
      </header>

      <NewsTicker articles={news.slice(0, 12)} />

      {/* HERO */}
      <section style={{ background: darkMode ? "linear-gradient(160deg, #0a0a0a 0%, #0d1a11 60%, #0a0a0a 100%)" : "linear-gradient(160deg, #f0fdf4 0%, #fff 55%, #f8fafc 100%)", borderBottom: `1px solid ${theme.border}`, overflow: "hidden", position: "relative" }}>
        <div className="hero-watermark" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontFamily: "'Playfair Display', serif", fontSize: "clamp(60px, 18vw, 220px)", fontWeight: 800, color: darkMode ? "rgba(0,135,81,0.04)" : "rgba(0,135,81,0.05)", whiteSpace: "nowrap", pointerEvents: "none", userSelect: "none", letterSpacing: "-0.04em", lineHeight: 1 }}>NIGERIA</div>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px", background: "linear-gradient(180deg, #008751 0%, #00b86a 50%, #008751 100%)" }} />
        <div className="hero-padding" style={{ maxWidth: "1280px", margin: "0 auto", padding: "48px 24px 40px", position: "relative", zIndex: 1 }}>

          {/* Top row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ position: "relative", width: "12px", height: "12px", flexShrink: 0 }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#008751", opacity: 0.25, animation: "pulseDot 2s ease infinite", transform: "scale(2.2)" }} />
                <div style={{ position: "absolute", inset: "2px", borderRadius: "50%", background: "#008751" }} />
              </div>
              <span className="hero-overline" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(13px, 2vw, 20px)", fontWeight: 700, fontStyle: "italic", color: darkMode ? "#4ade80" : "#008751" }}>{t.heroOverline}</span>
            </div>
            <div className="hero-stats">
              {[
                { val: pulse?.total_articles_analyzed || "—", label: t.signalsAnalyzed, color: "#008751" },
                { val: "23+", label: "sources", color: "#2563eb" },
                foreignAlerts.length > 0 && { val: foreignAlerts.length, label: t.alertsCount, color: "#ea580c" },
                socialSignals.length > 0 && { val: socialSignals.length, label: "social", color: "#7c3aed" },
              ].filter(Boolean).map((item, i) => (
                <div key={i} style={{ background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,135,81,0.06)", border: `1px solid ${darkMode ? "rgba(0,135,81,0.2)" : "rgba(0,135,81,0.15)"}`, borderRadius: "8px", padding: "6px 12px", display: "flex", flexDirection: "column", alignItems: "center", minWidth: "52px" }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 800, color: item.color, lineHeight: 1 }}>{item.val}</span>
                  <span style={{ fontSize: "8px", color: theme.textMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "2px" }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero headline */}
          <div style={{ maxWidth: "820px" }}>
            {!loading && currentTopic && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", marginBottom: "14px", flexWrap: "wrap" }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "10px", fontWeight: 700, background: "#008751", color: "#fff", borderRadius: "6px", padding: "3px 9px", letterSpacing: "0.1em", textTransform: "uppercase" }}>#{activeTopicIndex + 1} Trending</span>
                {currentTopic.category && <span style={{ fontSize: "10px", color: theme.textMuted, background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: "6px", padding: "3px 9px", letterSpacing: "0.06em", textTransform: "uppercase" }}>{currentTopic.category}</span>}
              </div>
            )}

            <h2 className="hero-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 5.5vw, 72px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05, color: theme.text, marginBottom: "16px", animation: heroPulse ? "heroFlash 0.6s ease" : "none" }}>
              {loading ? <span style={{ color: theme.textMuted, fontStyle: "italic" }}>Loading intelligence…</span>
                : currentTopic?.name ? (
                  <>
                    <span style={{ color: "#008751", fontStyle: "italic", borderBottom: darkMode ? "3px solid rgba(0,135,81,0.4)" : "3px solid rgba(0,135,81,0.25)", paddingBottom: "2px" }}>{currentTopic.name}</span>
                    <br />
                    <span className="hero-suffix" style={{ color: theme.textMuted, fontWeight: 400, fontSize: "clamp(16px, 2.2vw, 30px)", fontStyle: "normal" }}>{t.heroSuffix}</span>
                  </>
                ) : t.heroDefault}
            </h2>

            {!loading && currentTopic?.summary && (
              <p style={{ fontSize: "clamp(13px, 1.3vw, 16px)", color: theme.textMuted, lineHeight: 1.75, maxWidth: "580px", marginBottom: "20px", borderLeft: "3px solid rgba(0,135,81,0.4)", paddingLeft: "14px" }}>
                {currentTopic.summary}
              </p>
            )}

            {!loading && currentTopic && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
                {currentTopic.sentiment && (
                  <span style={{ fontSize: "11px", fontWeight: 700, background: currentTopic.sentiment === "positive" ? "#dcfce7" : currentTopic.sentiment === "negative" ? "#fee2e2" : "#f1f5f9", color: currentTopic.sentiment === "positive" ? "#15803d" : currentTopic.sentiment === "negative" ? "#b91c1c" : "#475569", borderRadius: "20px", padding: "4px 11px", textTransform: "capitalize" }}>
                    {currentTopic.sentiment === "positive" ? "↑" : currentTopic.sentiment === "negative" ? "↓" : "→"} {currentTopic.sentiment} sentiment
                  </span>
                )}
                {currentTopic.intensity && (
                  <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                    <span style={{ fontSize: "10px", color: theme.textMuted, letterSpacing: "0.06em" }}>INTENSITY</span>
                    <div style={{ width: "70px", height: "4px", background: theme.border, borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ width: `${currentTopic.intensity * 10}%`, height: "100%", background: currentTopic.intensity >= 8 ? "#dc2626" : currentTopic.intensity >= 5 ? "#d97706" : "#16a34a", borderRadius: "2px" }} />
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: theme.text }}>{currentTopic.intensity}/10</span>
                  </div>
                )}
                {currentTopic.in_govt_agenda && <span style={{ fontSize: "10px", background: "#dcfce7", color: "#15803d", border: "1px solid #86efac", borderRadius: "20px", padding: "3px 9px", fontWeight: 600 }}>{t.govtBadge}</span>}
              </div>
            )}

            {/* Topic pills */}
            {!loading && pulse?.top_topics && (
              <div>
                <span style={{ fontSize: "10px", color: theme.textMuted, letterSpacing: "0.12em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>{t.trending}:</span>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {pulse.top_topics.map((tp, i) => (
                    <button key={i} onClick={() => { setActiveTopicIndex(i); setHeroPulse(true); setTimeout(() => setHeroPulse(false), 700); }}
                      style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 12px", borderRadius: "30px", border: `1.5px solid ${i === activeTopicIndex ? "#008751" : theme.border}`, background: i === activeTopicIndex ? "#dcfce7" : theme.surface, cursor: "pointer", transition: "all 0.25s", fontSize: "12px", fontWeight: i === activeTopicIndex ? 700 : 400, color: i === activeTopicIndex ? "#15803d" : theme.textMuted, fontFamily: "'Source Serif 4', serif" }}>
                      {i === activeTopicIndex && <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#008751", display: "inline-block", flexShrink: 0, animation: "pulseDot 1.5s infinite" }} />}
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "10px", fontWeight: 800, opacity: 0.4 }}>{String(i + 1).padStart(2, "0")}</span>
                      {tp.name.split(" ").slice(0, 3).join(" ")}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Hero footer */}
          <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: `1px solid ${theme.border}`, display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "11px", color: theme.textMuted }}>{t.heroDesc}</span>
            <span style={{ fontSize: "11px", color: theme.textMuted }}>·</span>
            <span style={{ fontSize: "11px", color: theme.textMuted }}>{t.autoRefresh}</span>
            {lastUpdated && <><span style={{ fontSize: "11px", color: theme.textMuted }}>·</span><span style={{ fontSize: "11px", color: "#008751", fontWeight: 600 }}>{t.updated} {formatTime(lastUpdated)}</span></>}
          </div>
        </div>
      </section>

      {/* TABS */}
      <div style={{ background: theme.surface, borderBottom: `1px solid ${theme.border}`, position: "sticky", top: "54px", zIndex: 90 }}>
        <div className="tabs-scroll" style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", padding: "0 8px" }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="tab-btn"
              style={{ padding: "14px 18px", border: "none", borderBottom: activeTab === tab.id ? "2px solid #008751" : "2px solid transparent", background: "transparent", cursor: "pointer", fontFamily: "'Playfair Display', serif", fontWeight: activeTab === tab.id ? 700 : 400, fontSize: "13px", color: activeTab === tab.id ? "#008751" : theme.textMuted, transition: "all 0.2s", whiteSpace: "nowrap" }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="section-padding" style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 16px 100px" }}>

        {/* NATIONAL PULSE TAB */}
        {activeTab === "pulse" && (
          <div>
            {loading ? (
              <div className="topics-grid">
                {[1,2,3,4,5].map(i => (
                  <div key={i} style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: "16px", padding: "20px", height: "260px" }}>
                    <Skeleton h={14} w="35%" mb={14} dark={darkMode} />
                    <Skeleton h={24} w="80%" mb={10} dark={darkMode} />
                    <Skeleton h={13} w="100%" mb={7} dark={darkMode} />
                    <Skeleton h={13} w="90%" mb={7} dark={darkMode} />
                    <Skeleton h={13} w="70%" dark={darkMode} />
                  </div>
                ))}
              </div>
            ) : !pulse ? (
              <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 700, marginBottom: "10px", color: theme.text }}>{t.warmingUp}</h3>
                <p style={{ fontSize: "14px", color: theme.textMuted, lineHeight: 1.6 }}>{t.warmingUpMsg}</p>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "8px" }}>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "12px", fontWeight: 700, color: theme.textMuted, letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>{t.topicsLabel}</h2>
                  {pulse.engine_used && <span style={{ fontSize: "10px", color: theme.textMuted, background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: "4px", padding: "3px 9px" }}>{pulse.engine_used} · {Math.round((pulse.analysis_confidence || 0) * 100)}% confidence</span>}
                </div>

                <div className="topics-grid" style={{ marginBottom: "40px" }}>
                  {pulse.top_topics?.map((topic, i) => (
                    <div key={i} className="topic-card" style={{ animationDelay: `${i * 80}ms` }}>
                      <TopicCard topic={topic} index={i} isActive={i === activeTopicIndex} t={t} reactions={reactions[topic.name]} onReact={handleReact} onDetailClick={() => router.push(`/topic/${i}`)} />
                    </div>
                  ))}
                </div>

                {/* Stats bar */}
                <div style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: "14px", padding: "20px 24px", marginBottom: "40px", overflowX: "auto" }}>
                  <div className="stats-row">
                    {[
                      { label: "SIGNALS", value: pulse.total_articles_analyzed },
                      { label: "TOPICS", value: pulse.top_topics?.length },
                      { label: "GOVT AGENDA", value: pulse.top_topics?.filter(tp => tp.in_govt_agenda).length, color: "#008751" },
                      { label: "SOCIAL", value: socialSignals.length, color: "#7c3aed" },
                      { label: "GLOBAL", value: foreignAlerts.length, color: "#ea580c" },
                      { label: "SENTIMENT", value: pulse.overall_sentiment || "—", color: "#6b7280" },
                    ].map(({ label, value, color }) => (
                      <div key={label} style={{ flexShrink: 0 }}>
                        <p style={{ fontSize: "9px", color: theme.textMuted, letterSpacing: "0.14em", marginBottom: "3px" }}>{label}</p>
                        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 700, color: color || theme.text, margin: 0, textTransform: "capitalize" }}>{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <NigeriaMap t={t} />
              </>
            )}
          </div>
        )}

        {/* GLOBAL IMPACT TAB */}
        {activeTab === "foreign" && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 700, color: theme.text, marginBottom: "7px" }}>{t.globalTitle}</h2>
              <p style={{ fontSize: "13px", color: theme.textMuted, lineHeight: 1.65, maxWidth: "600px" }}>{t.globalDesc}</p>
            </div>
            {alertsLoading ? (
              <div className="alerts-grid">
                {[1,2,3,4].map(i => <div key={i} style={{ height: "160px", background: theme.cardBg, borderRadius: "14px", border: `1px solid ${theme.cardBorder}` }}><Skeleton h="100%" dark={darkMode} /></div>)}
              </div>
            ) : foreignAlerts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "70px 20px" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700, marginBottom: "10px", color: theme.text }}>{t.noAlerts}</h3>
                <p style={{ color: theme.textMuted, fontSize: "14px" }}>{t.noAlertsMsg}</p>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", marginBottom: "20px" }}>
                  {[...new Set(foreignAlerts.map(a => a.impact_sector))].map(sector => {
                    const sc = { oil:"#ea580c", forex:"#d97706", diaspora:"#7c3aed", trade:"#2563eb", security:"#dc2626", food:"#16a34a", other:"#6b7280" };
                    const bg = { oil:"#fff7ed", forex:"#fef3c7", diaspora:"#f5f3ff", trade:"#eff6ff", security:"#fee2e2", food:"#dcfce7", other:"#f9fafb" };
                    return <span key={sector} style={{ fontSize: "11px", background: bg[sector]||"#f9fafb", color: sc[sector]||"#6b7280", border: `1px solid ${sc[sector]||"#6b7280"}30`, borderRadius: "20px", padding: "4px 12px", fontWeight: 700 }}>{(sector||"").toUpperCase()} ({foreignAlerts.filter(a=>a.impact_sector===sector).length})</span>;
                  })}
                </div>
                <div className="alerts-grid">
                  {foreignAlerts.map((alert, i) => <ForeignAlertCard key={i} alert={alert} />)}
                </div>
              </>
            )}
          </div>
        )}

        {/* SOCIAL SIGNALS TAB */}
        {activeTab === "social" && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 700, color: theme.text, marginBottom: "7px" }}>{t.socialTitle}</h2>
              <p style={{ fontSize: "13px", color: theme.textMuted, lineHeight: 1.65, maxWidth: "600px" }}>{t.socialDesc}</p>
            </div>
            {socialLoading ? (
              <div className="social-grid">
                {[1,2,3,4,5,6].map(i => <div key={i} style={{ height: "100px", background: theme.cardBg, borderRadius: "12px", border: `1px solid ${theme.cardBorder}` }}><Skeleton h="100%" dark={darkMode} /></div>)}
              </div>
            ) : socialSignals.length === 0 ? (
              <div style={{ textAlign: "center", padding: "70px 20px" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700, marginBottom: "10px", color: theme.text }}>{t.noSocial}</h3>
                <p style={{ color: theme.textMuted, fontSize: "14px" }}>{t.noSocialMsg}</p>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
                  {[{ label:"Reddit",color:"#ea580c",count:reddit.length },{ label:"YouTube",color:"#dc2626",count:youtube.length },{ label:"Comments",color:"#f97316",count:comments.length },{ label:"Trends",color:"#d97706",count:trends.length },{ label:"Signals",color:"#16a34a",count:signals.length }].filter(x=>x.count>0).map(({label,color,count})=>(
                    <div key={label} style={{ display:"flex",alignItems:"center",gap:"6px",background:theme.cardBg,border:`1px solid ${theme.cardBorder}`,borderRadius:"10px",padding:"7px 13px" }}>
                      <div style={{ width:"7px",height:"7px",borderRadius:"50%",background:color }} />
                      <span style={{ fontSize:"12px",color:theme.textMuted }}>{label}</span>
                      <span style={{ fontFamily:"'Playfair Display', serif",fontSize:"15px",fontWeight:700,color:theme.text }}>{count}</span>
                    </div>
                  ))}
                </div>
                {[
                  { data:reddit, label:"REDDIT NIGERIA", color:"#ea580c", sub:"posts" },
                  { data:trends, label:"GOOGLE TRENDS NIGERIA", color:"#d97706", sub:"searches", type:"trends" },
                  { data:youtube, label:"YOUTUBE — NIGERIAN CHANNELS", color:"#dc2626", sub:"videos" },
                  { data:comments, label:"YOUTUBE COMMENTS", color:"#f97316", sub:"comments" },
                  { data:signals, label:"EDITORIAL SIGNALS", color:"#16a34a", sub:"articles", type:"list" },
                ].filter(s=>s.data.length>0).map(({data,label,color,sub,type})=>(
                  <div key={label} style={{ marginBottom:"36px" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:"8px",marginBottom:"14px",flexWrap:"wrap" }}>
                      <div style={{ width:"3px",height:"14px",background:color,borderRadius:"2px",flexShrink:0 }} />
                      <h3 style={{ fontFamily:"'Playfair Display', serif",fontSize:"12px",fontWeight:700,color,letterSpacing:"0.1em",margin:0 }}>{label}</h3>
                      <span style={{ fontSize:"11px",color:theme.textMuted }}>{data.length} {sub}</span>
                    </div>
                    {type==="trends" ? (
                      <div style={{ display:"flex",flexWrap:"wrap",gap:"7px" }}>
                        {data.map((trend,i)=>(
                          <a key={i} href={trend.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
                            <div style={{ display:"flex",alignItems:"center",gap:"9px",background:theme.cardBg,border:`1px solid ${theme.cardBorder}`,borderRadius:"8px",padding:"8px 14px" }}>
                              <span style={{ fontFamily:"'Playfair Display', serif",fontSize:"13px",fontWeight:700,color:"#d97706" }}>{String(i+1).padStart(2,"0")}</span>
                              <span style={{ fontSize:"13px",color:theme.text }}>{trend.title}</span>
                            </div>
                          </a>
                        ))}
                      </div>
                    ) : type==="list" ? (
                      <div style={{ background:theme.cardBg,border:`1px solid ${theme.cardBorder}`,borderRadius:"12px",overflow:"hidden" }}>
                        {data.slice(0,14).map((item,i)=>(
                          <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
                            <div style={{ padding:"12px 16px",borderBottom:i<13?`1px solid ${theme.border}`:"none",transition:"background 0.15s" }}
                              onMouseEnter={e=>e.currentTarget.style.background=theme.surface2}
                              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                              <div style={{ display:"flex",justifyContent:"space-between",gap:"10px" }}>
                                <div style={{ flex:1 }}>
                                  <span style={{ fontSize:"10px",color:"#16a34a",fontWeight:700,marginRight:"7px" }}>{item.source}</span>
                                  <p style={{ fontSize:"13px",color:theme.text,lineHeight:1.4,margin:"3px 0 0" }}>{item.title}</p>
                                </div>
                                <span style={{ fontSize:"10px",color:theme.textMuted,whiteSpace:"nowrap",marginTop:"2px",flexShrink:0 }}>{timeAgo(item.scraped_at)}</span>
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="social-grid">
                        {data.slice(0,9).map((item,i)=><SocialCard key={i} item={{...item,source:(item.source||"").replace("YouTube — ","")}} accentColor={color} />)}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </main>

      {/* SUBSCRIBE SECTION */}
      <section className="subscribe-section" style={{ borderTop: `1px solid ${theme.border}`, padding: "60px 16px", background: theme.surface }}>
        <div style={{ maxWidth: "520px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "10px", color: "#008751", letterSpacing: "0.2em", fontWeight: 700, marginBottom: "12px", textTransform: "uppercase" }}>{t.stayInformed}</p>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 5vw, 30px)", fontWeight: 800, color: theme.text, marginBottom: "12px", lineHeight: 1.2 }}>{t.subscribeTitle}</h3>
          <p style={{ fontSize: "14px", color: theme.textMuted, marginBottom: "28px", lineHeight: 1.7 }}>{t.subscribeDesc}</p>
          {subscribeSuccess ? (
            <div style={{ background: "#dcfce7", border: "1px solid #86efac", borderRadius: "14px", padding: "28px" }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700, color: "#15803d", margin: "0 0 7px" }}>{t.subscribed}</p>
              <p style={{ fontSize: "13px", color: "#166534", margin: 0 }}>{t.subscribedMsg}</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", textAlign: "left" }}>
              {[
                { type:"text", ph:t.namePlaceholder, val:subscribeName, set:setSubscribeName },
                { type:"email", ph:t.emailPlaceholder, val:subscribeEmail, set:setSubscribeEmail },
                { type:"tel", ph:t.whatsappPlaceholder, val:subscribeWhatsapp, set:setSubscribeWhatsapp },
              ].map(({type,ph,val,set})=>(
                <input key={type} type={type} placeholder={ph} value={val} onChange={e=>set(e.target.value)}
                  style={{ width:"100%",padding:"13px 15px",background:theme.inputBg,border:`1px solid ${theme.inputBorder}`,borderRadius:"10px",color:theme.inputColor,fontSize:"14px",fontFamily:"'Source Serif 4', serif" }}
                  onFocus={e=>e.target.style.borderColor="#008751"}
                  onBlur={e=>e.target.style.borderColor=theme.inputBorder}
                />
              ))}
              {subscribeError && <p style={{ fontSize:"13px",color:"#dc2626",margin:0 }}>{subscribeError}</p>}
              <button onClick={handleSubscribe} disabled={subscribeLoading}
                style={{ width:"100%",padding:"14px",background:subscribeLoading?"#d1d5db":"#008751",color:"#fff",border:"none",borderRadius:"10px",fontSize:"15px",fontFamily:"'Playfair Display', serif",fontWeight:700,cursor:subscribeLoading?"not-allowed":"pointer",transition:"background 0.2s" }}
                onMouseEnter={e=>{if(!subscribeLoading)e.currentTarget.style.background="#006b41";}}
                onMouseLeave={e=>{if(!subscribeLoading)e.currentTarget.style.background="#008751";}}
              >{subscribeLoading ? t.subscribing : t.subscribeCTA}</button>
              <p style={{ fontSize:"12px",color:theme.textMuted,textAlign:"center" }}>{t.noSpam}</p>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-padding" style={{ borderTop: `1px solid ${theme.border}`, background: theme.bg, padding: "28px 16px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
              <div style={{ width: "26px", height: "26px", borderRadius: "6px", background: "#008751", flexShrink: 0 }} />
              <div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "15px", fontWeight: 800, color: theme.text, margin: 0 }}>Nigeria <span style={{ color: "#008751" }}>Pulse</span></p>
                <p style={{ fontSize: "10px", color: theme.textMuted, margin: 0 }}>{t.footerBuilt}</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {[
                { icon:"in", label:"LinkedIn",  href:"https://linkedin.com",  color:"#0077b5" },
                { icon:"wa", label:"WhatsApp",  href:"https://whatsapp.com",  color:"#25d366" },
                { icon:"fb", label:"Facebook",  href:"https://facebook.com",  color:"#1877f2" },
                { icon:"x",  label:"X",         href:"https://twitter.com",   color:"#111827" },
                { icon:"ig", label:"Instagram", href:"https://instagram.com", color:"#e1306c" },
              ].map(({icon,label,href,color})=>(
                <a key={icon} href={href} target="_blank" rel="noopener noreferrer"
                  style={{ display:"flex",alignItems:"center",justifyContent:"center",width:"34px",height:"34px",borderRadius:"50%",background:theme.surface2,border:`1px solid ${theme.border}`,textDecoration:"none",fontSize:"12px",fontWeight:700,color:theme.textMuted,transition:"all 0.2s" }}
                  onMouseEnter={e=>{e.currentTarget.style.background=color+"15";e.currentTarget.style.borderColor=color+"50";e.currentTarget.style.color=color;}}
                  onMouseLeave={e=>{e.currentTarget.style.background=theme.surface2;e.currentTarget.style.borderColor=theme.border;e.currentTarget.style.color=theme.textMuted;}}
                  title={label}
                >{icon==="in"?"in":icon==="wa"?"W":icon==="fb"?"f":icon==="x"?"X":"ig"}</a>
              ))}
            </div>
          </div>
          <div style={{ borderTop:`1px solid ${theme.border}`,paddingTop:"16px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"8px" }}>
            <p style={{ fontSize:"11px",color:theme.textMuted }}>© 2026 Nigeria Pulse · All rights reserved</p>
            <p style={{ fontSize:"11px",color:theme.textMuted }}>Auto-refreshes every 5 min · 23+ sources · Powered by AI</p>
          </div>
        </div>
      </footer>

      {/* AI CHAT */}
      <AIChatWidget t={t} isOpen={chatOpen} onClose={() => setChatOpen(false)} pulse={pulse} />

      {/* FAB */}
      <button onClick={() => setChatOpen(!chatOpen)}
        style={{ position:"fixed",bottom:"24px",right:"24px",width:"54px",height:"54px",borderRadius:"50%",background:chatOpen?"#dc2626":"#008751",color:"#fff",border:"none",cursor:"pointer",fontSize:"14px",fontWeight:700,boxShadow:chatOpen?"0 4px 20px rgba(220,38,38,0.4)":"0 4px 20px rgba(0,135,81,0.4)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",transition:"background 0.2s, transform 0.2s",fontFamily:"'Playfair Display', serif" }}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"}
        onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
      >{chatOpen ? "×" : "AI"}</button>
    </div>
  );
}