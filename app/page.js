"use client";
import { useState, useEffect, useCallback, useRef } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// ─── TRANSLATIONS ───────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    tagline: "Real-Time National Intelligence",
    heroSubtitle: "is dominating Nigeria today",
    heroDefault: "National Intelligence Feed",
    signalsAnalyzed: "signals analyzed",
    sources: "23+ sources",
    socialSignals: "social signals",
    globalAlerts: "global alerts",
    tabs: ["🔥 National Pulse", "🌍 Global Impact", "📱 Social Signals"],
    topTopics: "TOP 5 NATIONAL TOPICS · AUTO-REFRESHES EVERY 5 MIN · CLICK TO READ",
    clickToRead: "↗ Click to read full story",
    globalDesc: "Foreign events detected by AI that directly impact Nigeria through oil, forex, diaspora, trade, security or food channels.",
    socialDesc: "Real-time signals from Reddit, YouTube videos & comments, Google Trends — what Nigerians are actually discussing.",
    stayInformed: "STAY INFORMED",
    subscribeTitle: "Get Nigeria Pulse delivered to you",
    subscribeDesc: "Top 5 trending topics + Naira rate + Global alerts — every day at 6AM and 6PM WAT. Free forever.",
    subscribeCTA: "SUBSCRIBE FREE →",
    noSpam: "No spam. Unsubscribe anytime.",
    namePlaceholder: "Your name",
    emailPlaceholder: "Email address",
    whatsappPlaceholder: "WhatsApp (optional) e.g. +2348012345678",
    subscribing: "Subscribing...",
    subscribed: "You're subscribed!",
    subscribedMsg: "Check your email for a welcome message. First digest arrives at 6AM tomorrow.",
    warmingUp: "Warming up…",
    warmingUpMsg: "The intelligence engine is starting. Check back in 2 minutes.",
    noAlerts: "No global alerts right now",
    noAlertsMsg: "The AI will detect foreign events on the next refresh.",
    noSocial: "No social signals yet",
    noSocialMsg: "Social signals are collected every 2 hours.",
    updated: "Updated",
    whatToWatch: "WHAT TO WATCH",
    impact: "Impact",
    askAI: "Ask Nigeria Pulse AI...",
    aiTitle: "Nigeria Pulse AI",
    aiSubtitle: "Ask me anything about Nigeria",
    aiWelcome: "Hello! I'm the Nigeria Pulse AI assistant. Ask me about trending topics, economy, politics, or anything happening in Nigeria right now.",
    sendMsg: "Send",
    trending: "TRENDING",
    react: "React",
    govtAgenda: "GOVT AGENDA",
    globalImpact: "GLOBAL IMPACT",
    notifyTitle: "Stay Ahead of Nigeria's News",
    notifyDesc: "Get instant alerts for breaking stories, major Naira moves, and national crises.",
    notifyAllow: "Allow Notifications",
    notifyLater: "Maybe later",
    footerText: "🇳🇬 Nigeria Pulse — Auto-refreshes every 5 minutes · 23+ sources · Built for the people",
    nairaRate: "NAIRA RATE",
    liveLabel: "LIVE",
    mapTitle: "Regional Sentiment Map",
    mapSubtitle: "Public mood by geopolitical zone",
    reactions: { fire: "🔥", clap: "👏", angry: "😤", wow: "😮" },
  },
  ha: {
    tagline: "Bayanan Kasa Na Ainihin Lokaci",
    heroSubtitle: "yana mulkin Najeriya a yau",
    heroDefault: "Cibiyar Bayanan Ƙasa",
    signalsAnalyzed: "alamomi da aka nazarta",
    sources: "23+ kafofin labarai",
    socialSignals: "alamomin zamantakewa",
    globalAlerts: "faɗakarwar duniya",
    tabs: ["🔥 Bugun Ƙasa", "🌍 Tasirin Duniya", "📱 Alamomin Zamantakewa"],
    topTopics: "MANYAN BATUTUWA 5 · YA SABUNTA KOWACE DAKIKA 5 · DANNA DON KARANTA",
    clickToRead: "↗ Danna don karanta cikakken labari",
    globalDesc: "Abubuwan da suka faru a duniya wanda AI ya gano wanda kai tsaye yana shafar Najeriya ta man fetur, forex, diaspora, kasuwanci, tsaro ko hanyoyin abinci.",
    socialDesc: "Alamomi na ainihin lokaci daga Reddit, bidiyon YouTube da sharhi, Google Trends — abin da Nigerians ke tattauna.",
    stayInformed: "KASANCE CIKIN SANI",
    subscribeTitle: "Karɓi Nigeria Pulse zuwa gare ka",
    subscribeDesc: "Manyan batutuwa 5 masu zuwa + Ƙimar Naira + Faɗakarwar Duniya — kowace rana da 6AM da 6PM WAT. Kyauta har abada.",
    subscribeCTA: "RIJISTA KYAUTA →",
    noSpam: "Babu spam. Ka cire rijista a kowane lokaci.",
    namePlaceholder: "Sunanka",
    emailPlaceholder: "Adireshin imel",
    whatsappPlaceholder: "WhatsApp (zaɓi) misali: +2348012345678",
    subscribing: "Ana rijista...",
    subscribed: "An yi rijistarka!",
    subscribedMsg: "Duba imelinka don sakon maraba. Farkon taƙaitawar ya isa da 6AM gobe.",
    warmingUp: "Ana ɗumama…",
    warmingUpMsg: "Injin bayanan yana farawa. Dawo bayan mintuna 2.",
    noAlerts: "Babu faɗakarwar duniya yanzu",
    noAlertsMsg: "AI za ta gano abubuwan waje a sabuntawa na gaba.",
    noSocial: "Babu alamomin zamantakewa tukuna",
    noSocialMsg: "Ana tattara alamomin zamantakewa kowace awa 2.",
    updated: "An sabunta",
    whatToWatch: "ABIN DA ZA A KIYAYE",
    impact: "Tasiri",
    askAI: "Tambayi Nigeria Pulse AI...",
    aiTitle: "Nigeria Pulse AI",
    aiSubtitle: "Tambaye ni kowane abu game da Najeriya",
    aiWelcome: "Sannu! Ni ne mataimaki na Nigeria Pulse AI. Tambaye ni game da batutuwan da ke zafi, tattalin arziki, siyasa, ko kowane abu da ke faruwa a Najeriya yanzu.",
    sendMsg: "Aika",
    trending: "MAFI SHAHARA",
    react: "Amsa",
    govtAgenda: "AJANDA GVT",
    globalImpact: "TASIRIN DUNIYA",
    notifyTitle: "Kasance gaban labarun Najeriya",
    notifyDesc: "Karɓi faɗakarwa nan take don labarun gaggawa, manyan motsin Naira, da rikicin ƙasa.",
    notifyAllow: "Yarda da Sanarwa",
    notifyLater: "Watakila daga baya",
    footerText: "🇳🇬 Nigeria Pulse — Ana sabuntawa kowace dakika 5 · 23+ kafofin labarai · An gina don jama'a",
    nairaRate: "ƘIMAR NAIRA",
    liveLabel: "RAYUWA",
    mapTitle: "Taswira Mood na Yanki",
    mapSubtitle: "Yanayin ra'ayin jama'a ta yankin geopolitical",
    reactions: { fire: "🔥", clap: "👏", angry: "😤", wow: "😮" },
  },
  yo: {
    tagline: "Ìmọ̀ Orílẹ̀-Èdè Àkókò Gidi",
    heroSubtitle: "n ṣe ako Nàìjíríà lónìí",
    heroDefault: "Ibi Ìmọ̀ Orílẹ̀-Èdè",
    signalsAnalyzed: "àwọn àmì tí a ṣe àyẹ̀wò",
    sources: "23+ orísun",
    socialSignals: "àwọn àmì àwùjọ",
    globalAlerts: "ìkìlọ̀ àgbáyé",
    tabs: ["🔥 Ìgbóná Orílẹ̀-Èdè", "🌍 Ipa Àgbáyé", "📱 Àwọn Àmì Àwùjọ"],
    topTopics: "ÀWỌ̀N ÌSỌ̀RỌ̀ TOP 5 · A MÀA N ṢÀTÚNṢE GBOGBO ÌṢẸ́JÚ 5 · TẸ LÀTi KA",
    clickToRead: "↗ Tẹ lati ka ìtàn kíkún",
    globalDesc: "Àwọn ìṣẹ̀lẹ̀ àgbáyé tí AI ṣe àwárí tí ó ní ipa tààràtà lórí Nàìjíríà nípasẹ̀ epo, forex, diaspora, iṣòwò, aabo tàbí ọ̀nà oúnjẹ.",
    socialDesc: "Àwọn àmì àkókò gidi láti Reddit, àwọn fídíò YouTube & àwọn àlàyé, Google Trends — ohun tí àwọn ará Nàìjíríà ń jíròrò.",
    stayInformed: "MỌ OHUN TÍ Ń ṢẸLẸ̀",
    subscribeTitle: "Gba Nigeria Pulse tọ̀ wọ́n",
    subscribeDesc: "Àwọn ìsọ̀rọ̀ gbígbóná 5 + Iye Naira + Ìkìlọ̀ Àgbáyé — ni gbogbo ọjọ́ ni 6AM àti 6PM WAT. Ọfẹ láé.",
    subscribeCTA: "FORÚKỌSÍLẸ̀ ỌFẸ →",
    noSpam: "Kò sí spam. Yọ̀ orúkọ rẹ kúrò nígbàkúgbà.",
    namePlaceholder: "Orúkọ rẹ",
    emailPlaceholder: "Àdírẹ́sì email",
    whatsappPlaceholder: "WhatsApp (àṣeyọ̀rí) ìfẹ̀ẹ́: +2348012345678",
    subscribing: "N ṣe forúkọsílẹ̀...",
    subscribed: "A ti forúkọsílẹ̀ rẹ!",
    subscribedMsg: "Ṣàyẹ̀wò email rẹ fún ìkíni. Àkókò àkọ́kọ́ dé ní 6AM ọlọ́la.",
    warmingUp: "N gbóná soke…",
    warmingUpMsg: "Ẹ̀rọ ìmọ̀ n bẹ̀rẹ̀. Padà wá ní ìṣẹ́jú 2.",
    noAlerts: "Kò sí ìkìlọ̀ àgbáyé báyìí",
    noAlertsMsg: "AI yóò ṣàwárí àwọn ìṣẹ̀lẹ̀ àgbáyé ní ìmúdójúìwọ̀n tókàn.",
    noSocial: "Kò sí àwọn àmì àwùjọ tí ó tí",
    noSocialMsg: "A n kó àwọn àmì àwùjọ gbogbo wakati 2.",
    updated: "Tí a ṣàtúnṣe",
    whatToWatch: "OHUN TÍ A MÀA N ṢÀ",
    impact: "Ipa",
    askAI: "Béèrè lọ́wọ́ Nigeria Pulse AI...",
    aiTitle: "Nigeria Pulse AI",
    aiSubtitle: "Béèrè lọ́wọ́ mi ohunkóhun nípa Nàìjíríà",
    aiWelcome: "Káàbọ̀! Mo jẹ́ olùrànlọ́wọ́ AI Nigeria Pulse. Béèrè lọ́wọ́ mi nípa àwọn ìsọ̀rọ̀ gbígbóná, ọrọ̀ ajé, ìṣèlú, tàbí ohunkóhun tí ń ṣẹlẹ̀ ní Nàìjíríà ní báyìí.",
    sendMsg: "Firanṣẹ́",
    trending: "TÍ Ó GBÉ NI",
    react: "Fèsì",
    govtAgenda: "ÈTÒ ÌJỌ̀BÀ",
    globalImpact: "IPA ÀGBÁYÉ",
    notifyTitle: "Ṣáájú Ìròyìn Nàìjíríà",
    notifyDesc: "Gba ìkìlọ̀ lẹ́sẹ̀kẹsẹ̀ fún àwọn ìtàn tuntun, gbígbé Naira ńlá, àti ìdákọ̀ orílẹ̀-èdè.",
    notifyAllow: "Gbà Àwọn Ìkìlọ̀",
    notifyLater: "Bóyá nígbà mìíràn",
    footerText: "🇳🇬 Nigeria Pulse — A maa n ṣàtúnṣe gbogbo ìṣẹ́jú 5 · 23+ orísun · Ti a kọ́ fún àwọn ènìyàn",
    nairaRate: "IYE NAIRA",
    liveLabel: "ÀKÓKÒ GIDI",
    mapTitle: "Maapu Ìfẹ̀ Ẹkùn",
    mapSubtitle: "Ìyọnu àwọn ènìyàn ní abala geopolitical",
    reactions: { fire: "🔥", clap: "👏", angry: "😤", wow: "😮" },
  },
};

// ─── Helpers ────────────────────────────────────────────────
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── Nigeria Map Component ───────────────────────────────────
function NigeriaMap({ t }) {
  const zones = [
    { id: "nw", label: "North West", x: 120, y: 80, sentiment: "neutral", score: 5.2, topics: ["Security", "Farming"] },
    { id: "ne", label: "North East", x: 260, y: 70, sentiment: "negative", score: 7.1, topics: ["Security", "IDPs"] },
    { id: "nc", label: "North Central", x: 190, y: 155, sentiment: "neutral", score: 5.8, topics: ["Land disputes", "Power"] },
    { id: "sw", label: "South West", x: 110, y: 245, sentiment: "positive", score: 6.4, topics: ["Tech", "Economy"] },
    { id: "se", label: "South East", x: 250, y: 255, sentiment: "negative", score: 6.9, topics: ["Insecurity", "IPOB"] },
    { id: "ss", label: "South South", x: 210, y: 310, sentiment: "neutral", score: 5.5, topics: ["Oil", "Pollution"] },
  ];
  const sentimentColor = { positive: "#16a34a", negative: "#dc2626", neutral: "#d97706" };
  const sentimentBg = { positive: "#dcfce7", negative: "#fee2e2", neutral: "#fef3c7" };
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "24px", marginBottom: "32px" }}>
      <div style={{ marginBottom: "16px" }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700, color: "#111827", marginBottom: "4px" }}>{t.mapTitle}</h3>
        <p style={{ fontSize: "13px", color: "#6b7280" }}>{t.mapSubtitle}</p>
      </div>
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "flex-start" }}>
        {/* SVG Map */}
        <svg viewBox="0 0 380 380" style={{ width: "100%", maxWidth: "340px", height: "auto" }}>
          {/* Nigeria outline simplified */}
          <path d="M60,60 L320,55 L340,200 L290,340 L160,355 L60,300 L30,180 Z" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1.5"/>
          {/* Zone dots */}
          {zones.map(z => (
            <g key={z.id} onMouseEnter={() => setHovered(z)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
              <circle cx={z.x} cy={z.y} r={hovered?.id === z.id ? 22 : 18} fill={sentimentBg[z.sentiment]} stroke={sentimentColor[z.sentiment]} strokeWidth="2" style={{ transition: "r 0.2s" }} />
              <circle cx={z.x} cy={z.y} r="6" fill={sentimentColor[z.sentiment]} />
              <text x={z.x} y={z.y + 34} textAnchor="middle" fontSize="9" fill="#374151" fontFamily="sans-serif" fontWeight="600">{z.label}</text>
              <text x={z.x} y={z.y + 44} textAnchor="middle" fontSize="8" fill={sentimentColor[z.sentiment]} fontFamily="sans-serif">{z.score}/10</text>
            </g>
          ))}
          {/* Title */}
          <text x="190" y="375" textAnchor="middle" fontSize="10" fill="#9ca3af" fontFamily="sans-serif">🇳🇬 Geopolitical Zones</text>
        </svg>
        {/* Legend + hovered info */}
        <div style={{ flex: 1, minWidth: "160px" }}>
          <div style={{ marginBottom: "16px" }}>
            {[{ label: "Positive", color: "#16a34a", bg: "#dcfce7" }, { label: "Neutral", color: "#d97706", bg: "#fef3c7" }, { label: "Negative", color: "#dc2626", bg: "#fee2e2" }].map(s => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: s.color }} />
                <span style={{ fontSize: "13px", color: "#374151" }}>{s.label} Sentiment</span>
              </div>
            ))}
          </div>
          {hovered ? (
            <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "14px" }}>
              <p style={{ fontWeight: 700, fontSize: "14px", color: "#111827", marginBottom: "6px" }}>{hovered.label}</p>
              <div style={{ display: "inline-block", background: sentimentBg[hovered.sentiment], color: sentimentColor[hovered.sentiment], fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "4px", marginBottom: "8px", textTransform: "capitalize" }}>{hovered.sentiment}</div>
              <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px" }}>Intensity: <strong style={{ color: "#111827" }}>{hovered.score}/10</strong></p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {hovered.topics.map(tp => (
                  <span key={tp} style={{ fontSize: "11px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "4px", padding: "2px 8px", color: "#374151" }}>{tp}</span>
                ))}
              </div>
            </div>
          ) : (
            <p style={{ fontSize: "12px", color: "#9ca3af", fontStyle: "italic" }}>Hover a zone to see details</p>
          )}
          <div style={{ marginTop: "16px" }}>
            {zones.map(z => (
              <div key={z.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f3f4f6" }}>
                <span style={{ fontSize: "12px", color: "#374151" }}>{z.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: `${z.score * 8}px`, height: "4px", borderRadius: "2px", background: sentimentColor[z.sentiment] }} />
                  <span style={{ fontSize: "11px", color: "#6b7280", minWidth: "26px" }}>{z.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AI Chat Component ───────────────────────────────────────
function AIChatWidget({ t, isOpen, onClose, pulse, nairaRate }) {
  const [messages, setMessages] = useState([{ role: "assistant", content: t.aiWelcome }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);
    try {
      const context = pulse ? `Current top topics in Nigeria: ${pulse.top_topics?.map(t => t.name).join(", ")}. Overall sentiment: ${pulse.overall_sentiment}. Naira rate: $1 = ₦${Number(nairaRate?.usd_to_ngn || 0).toFixed(0)}.` : "";
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are the Nigeria Pulse AI assistant. You help users understand Nigerian news, politics, economy, and current events. Be concise, factual, and helpful. Current context: ${context}`,
          messages: [
            ...messages.filter(m => m.role !== "system"),
            { role: "user", content: userMsg }
          ],
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "I'm having trouble connecting. Please try again.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: "fixed", bottom: "90px", right: "24px", width: "360px", maxHeight: "520px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "20px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", zIndex: 1000, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ background: "#008751", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>🇳🇬</div>
          <div>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: "14px", margin: 0 }}>{t.aiTitle}</p>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px", margin: 0 }}>{t.aiSubtitle}</p>
          </div>
        </div>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: "28px", height: "28px", color: "#fff", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
      </div>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "80%", padding: "10px 14px", borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: msg.role === "user" ? "#008751" : "#f3f4f6", color: msg.role === "user" ? "#fff" : "#111827", fontSize: "13px", lineHeight: 1.5 }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: "4px", padding: "10px 14px", background: "#f3f4f6", borderRadius: "16px 16px 16px 4px", width: "fit-content" }}>
            {[0,1,2].map(i => <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#9ca3af", animation: `bounce 1.2s ${i * 0.2}s infinite` }} />)}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Input */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid #e5e7eb", display: "flex", gap: "8px" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder={t.askAI}
          style={{ flex: 1, padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: "20px", fontSize: "13px", outline: "none", color: "#111827", background: "#f9fafb" }}
        />
        <button
          onClick={sendMessage}
          style={{ background: "#008751", color: "#fff", border: "none", borderRadius: "50%", width: "38px", height: "38px", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}
        >→</button>
      </div>
    </div>
  );
}

// ─── Notification Banner ─────────────────────────────────────
function NotificationBanner({ t, onDismiss }) {
  return (
    <div style={{ position: "fixed", top: "80px", left: "50%", transform: "translateX(-50%)", width: "min(480px, 90vw)", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", padding: "20px 24px", zIndex: 500, animation: "slideDown 0.4s ease" }}>
      <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
        <div style={{ fontSize: "28px", flexShrink: 0 }}>🔔</div>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "15px", color: "#111827", marginBottom: "4px" }}>{t.notifyTitle}</p>
          <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "14px", lineHeight: 1.5 }}>{t.notifyDesc}</p>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={onDismiss} style={{ background: "#008751", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>{t.notifyAllow}</button>
            <button onClick={onDismiss} style={{ background: "#f9fafb", color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", cursor: "pointer" }}>{t.notifyLater}</button>
          </div>
        </div>
        <button onClick={onDismiss} style={{ background: "none", border: "none", color: "#9ca3af", fontSize: "20px", cursor: "pointer", lineHeight: 1 }}>×</button>
      </div>
    </div>
  );
}

// ─── Sub-components (redesigned for white/clean) ─────────────
function IntensityBar({ value }) {
  const color = value >= 8 ? "#dc2626" : value >= 5 ? "#d97706" : "#16a34a";
  const bg = value >= 8 ? "#fee2e2" : value >= 5 ? "#fef3c7" : "#dcfce7";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{ flex: 1, height: "4px", background: "#f3f4f6", borderRadius: "2px" }}>
        <div style={{ width: `${value * 10}%`, height: "100%", background: color, borderRadius: "2px", transition: "width 1s ease" }} />
      </div>
      <span style={{ fontSize: "11px", background: bg, color, fontWeight: 700, minWidth: "24px", padding: "2px 6px", borderRadius: "4px", textAlign: "center" }}>{value}</span>
    </div>
  );
}

function LiveDot({ label }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "#dcfce7", border: "1px solid #86efac", borderRadius: "20px", padding: "3px 10px" }}>
      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#16a34a", display: "inline-block", animation: "pulse-dot 1.5s ease infinite" }} />
      <span style={{ fontSize: "10px", color: "#15803d", fontWeight: 700, letterSpacing: "0.08em" }}>{label}</span>
    </span>
  );
}

function NewsTicker({ articles }) {
  if (!articles.length) return null;
  const items = [...articles, ...articles];
  return (
    <div style={{ background: "#008751", padding: "9px 0", overflow: "hidden", borderBottom: "1px solid #006b41" }}>
      <div style={{ display: "flex", gap: "60px", animation: "ticker 50s linear infinite", whiteSpace: "nowrap" }}>
        {items.map((a, i) => (
          <span key={i} style={{ fontSize: "12px", color: "#fff", fontWeight: 500, flexShrink: 0 }}>
            <span style={{ opacity: 0.6, marginRight: "12px" }}>◆</span>{a.title}
          </span>
        ))}
      </div>
    </div>
  );
}

function NairaRateBar({ nairaRate, formatTime, t }) {
  if (!nairaRate) return null;
  return (
    <div style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb", padding: "8px 24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "10px", color: "#9ca3af", letterSpacing: "0.12em", fontWeight: 600 }}>{t.nairaRate}</span>
        </div>
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          {[
            { label: "USD/NGN", value: nairaRate.usd_to_ngn },
            { label: "EUR/NGN", value: nairaRate.eur_to_ngn },
            { label: "GBP/NGN", value: nairaRate.gbp_to_ngn },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "10px", color: "#9ca3af" }}>{label}</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "13px", fontWeight: 700, color: "#111827" }}>
                ₦{Number(value).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <span style={{ fontSize: "10px", color: "#9ca3af", marginLeft: "auto" }}>{t.updated} {formatTime(nairaRate.recorded_at)}</span>
      </div>
    </div>
  );
}

// ─── Topic Card (reactions added) ────────────────────────────
function TopicCard({ topic, index, isActive, t, reactions, onReact }) {
  const rankColors = ["#008751", "#d97706", "#dc2626", "#6b7280", "#6b7280"];
  const borderColors = ["#dcfce7", "#fef3c7", "#fee2e2", "#f3f4f6", "#f3f4f6"];
  const topicLink = topic.source_url ||
    (topic.sources_cited?.[0]
      ? `https://www.google.com/search?q=${encodeURIComponent(topic.name + " Nigeria " + topic.sources_cited[0])}`
      : `https://www.google.com/search?q=${encodeURIComponent(topic.name + " Nigeria")}`);

  const totalReacts = Object.values(reactions || {}).reduce((a, b) => a + b, 0);

  return (
    <div style={{ background: "#fff", border: `1px solid ${isActive ? borderColors[index] : "#e5e7eb"}`, borderRadius: "16px", overflow: "hidden", transition: "box-shadow 0.2s, transform 0.2s", boxShadow: isActive ? "0 4px 20px rgba(0,0,0,0.08)" : "none" }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = isActive ? "0 4px 20px rgba(0,0,0,0.08)" : "none"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Rank strip */}
      <div style={{ height: "4px", background: rankColors[index] || "#9ca3af" }} />
      <div style={{ padding: "20px" }}>
        {/* Number + badges */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", fontWeight: 700, color: "#f3f4f6", lineHeight: 1 }}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {topic.in_govt_agenda && <span style={{ fontSize: "10px", background: "#dcfce7", color: "#15803d", border: "1px solid #86efac", borderRadius: "4px", padding: "2px 7px", fontWeight: 600 }}>{t.govtAgenda}</span>}
            {topic.foreign_impact && <span style={{ fontSize: "10px", background: "#fef3c7", color: "#92400e", border: "1px solid #fcd34d", borderRadius: "4px", padding: "2px 7px", fontWeight: 600 }}>{t.globalImpact}</span>}
            {topic.sentiment && (
              <span style={{ fontSize: "10px", background: topic.sentiment === "positive" ? "#dcfce7" : topic.sentiment === "negative" ? "#fee2e2" : "#fef9c3", color: topic.sentiment === "positive" ? "#15803d" : topic.sentiment === "negative" ? "#b91c1c" : "#854d0e", borderRadius: "4px", padding: "2px 7px", fontWeight: 600, textTransform: "capitalize" }}>
                {topic.sentiment === "positive" ? "↑" : topic.sentiment === "negative" ? "↓" : "→"} {topic.sentiment}
              </span>
            )}
          </div>
        </div>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "17px", fontWeight: 700, marginBottom: "8px", color: "#111827", lineHeight: 1.3 }}>{topic.name}</h3>
        <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "14px", lineHeight: 1.5 }}>{topic.summary}</p>
        <IntensityBar value={topic.intensity} />
        {/* Sources */}
        <div style={{ marginTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {(topic.sources_cited || topic.sources || []).slice(0, 3).map((s, i) => (
              <span key={i} style={{ fontSize: "10px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "4px", padding: "2px 7px", color: "#6b7280" }}>{s}</span>
            ))}
          </div>
          {topic.category && <span style={{ fontSize: "10px", color: "#9ca3af", letterSpacing: "0.06em", textTransform: "uppercase" }}>{topic.category}</span>}
        </div>
        {/* Reactions */}
        <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: "6px" }}>
          {Object.entries(t.reactions).map(([key, emoji]) => (
            <button key={key} onClick={() => onReact(topic.name, key)}
              style={{ display: "flex", alignItems: "center", gap: "4px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "20px", padding: "4px 10px", cursor: "pointer", fontSize: "12px", color: "#374151", transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f3f4f6"}
              onMouseLeave={e => e.currentTarget.style.background = "#f9fafb"}
            >
              <span>{emoji}</span>
              <span>{reactions?.[key] || 0}</span>
            </button>
          ))}
          {totalReacts > 0 && <span style={{ fontSize: "11px", color: "#9ca3af", marginLeft: "4px" }}>{totalReacts} reactions</span>}
          <a href={topicLink} target="_blank" rel="noopener noreferrer" style={{ marginLeft: "auto", fontSize: "11px", color: "#008751", textDecoration: "none", display: "flex", alignItems: "center", gap: "3px" }}>↗ {t.clickToRead}</a>
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
  const icons = { oil: "🛢️", forex: "💵", diaspora: "🌍", trade: "🚢", security: "🔒", food: "🌾", other: "⚡" };
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "14px", overflow: "hidden", transition: "box-shadow 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
    >
      <div style={{ height: "3px", background: color }} />
      <div style={{ padding: "18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>{icons[alert.impact_sector] || "⚡"}</span>
            <span style={{ fontSize: "10px", background: bg, color, border: `1px solid ${color}30`, borderRadius: "4px", padding: "2px 8px", fontWeight: 700, letterSpacing: "0.06em" }}>{(alert.impact_sector || "").toUpperCase()}</span>
            <span style={{ fontSize: "11px", color: "#9ca3af" }}>{alert.country}</span>
          </div>
          {alert.impact_score && (
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "9px", color: "#9ca3af", margin: "0 0 1px" }}>IMPACT</p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700, color, margin: 0, lineHeight: 1 }}>{alert.impact_score}</p>
            </div>
          )}
        </div>
        <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "14px", fontWeight: 700, color: "#111827", marginBottom: "8px" }}>{alert.event}</h4>
        <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "12px", lineHeight: 1.5 }}>{alert.nigeria_impact}</p>
        {alert.what_to_watch && (
          <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "10px 12px" }}>
            <p style={{ fontSize: "9px", color: "#9ca3af", letterSpacing: "0.1em", marginBottom: "3px" }}>WHAT TO WATCH</p>
            <p style={{ fontSize: "12px", color: "#374151", margin: 0, lineHeight: 1.4 }}>{alert.what_to_watch}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SocialCard({ item, accentColor }) {
  return (
    <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "14px", transition: "box-shadow 0.2s, transform 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "8px" }}>
          <span style={{ fontSize: "10px", background: `${accentColor}12`, border: `1px solid ${accentColor}30`, color: accentColor, borderRadius: "4px", padding: "2px 7px", fontWeight: 600, whiteSpace: "nowrap" }}>{item.source}</span>
          <span style={{ fontSize: "10px", color: "#9ca3af", whiteSpace: "nowrap", flexShrink: 0 }}>{timeAgo(item.scraped_at)}</span>
        </div>
        <p style={{ fontSize: "13px", color: "#111827", lineHeight: 1.4, margin: 0 }}>{item.title}</p>
        {item.summary && !item.summary.startsWith("👍") && (
          <p style={{ fontSize: "11px", color: "#6b7280", marginTop: "7px", lineHeight: 1.4 }}>{item.summary.slice(0, 100)}{item.summary.length > 100 ? "..." : ""}</p>
        )}
      </div>
    </a>
  );
}

function CommentCard({ item }) {
  return (
    <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderLeft: "3px solid #f97316", borderRadius: "12px", padding: "14px", transition: "box-shadow 0.2s" }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"}
        onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <span style={{ fontSize: "10px", background: "#fff7ed", border: "1px solid #fed7aa", color: "#c2410c", borderRadius: "4px", padding: "2px 7px", fontWeight: 600 }}>
            {(item.source || "").replace("YouTube Comments — ", "💬 ")}
          </span>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>{timeAgo(item.scraped_at)}</span>
        </div>
        <p style={{ fontSize: "13px", color: "#111827", lineHeight: 1.5, margin: "0 0 6px" }}>{item.title}</p>
        {item.summary && <p style={{ fontSize: "11px", color: "#6b7280", margin: 0 }}>{item.summary}</p>}
      </div>
    </a>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────
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

  // New feature states
  const [lang, setLang] = useState("en");
  const [darkMode, setDarkMode] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [showNotify, setShowNotify] = useState(false);
  const [reactions, setReactions] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Theme
  const theme = darkMode ? {
    bg: "#0a0a0a", surface: "#111", surface2: "#1a1a1a", border: "#2a2a2a",
    text: "#f9fafb", textMuted: "#9ca3af", textSecondary: "#d1d5db",
    headerBg: "rgba(10,10,10,0.95)", cardBg: "#111", cardBorder: "#2a2a2a",
    inputBg: "#1a1a1a", inputBorder: "#2a2a2a", inputColor: "#f9fafb",
    rateBg: "#111", rateBorder: "#2a2a2a", tabBg: "#111", tabBorder: "#2a2a2a",
    statsBg: "#111", statsBorder: "#2a2a2a",
  } : {
    bg: "#f9fafb", surface: "#fff", surface2: "#f3f4f6", border: "#e5e7eb",
    text: "#111827", textMuted: "#6b7280", textSecondary: "#374151",
    headerBg: "rgba(255,255,255,0.97)", cardBg: "#fff", cardBorder: "#e5e7eb",
    inputBg: "#fff", inputBorder: "#e5e7eb", inputColor: "#111827",
    rateBg: "#f9fafb", rateBorder: "#e5e7eb", tabBg: "#fff", tabBorder: "#e5e7eb",
    statsBg: "#fff", statsBorder: "#e5e7eb",
  };

  // Subscribe
  const [subscribeName, setSubscribeName] = useState("");
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeWhatsapp, setSubscribeWhatsapp] = useState("");
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [subscribeError, setSubscribeError] = useState("");

  // Show notification banner after 8s
  useEffect(() => {
    const timer = setTimeout(() => setShowNotify(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate topics
  useEffect(() => {
    const id = setInterval(() => setActiveTopicIndex(prev => (prev + 1) % 5), 5000);
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
          ["social_reddit","social_video","social_signal","social_twitter","social_official","trending_search","youtube_comment"].includes(a.category)
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
    const id = setInterval(() => { fetchPulse(); fetchNews(); fetchForeignAlerts(); fetchNairaRate(); }, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [fetchPulse, fetchNews, fetchForeignAlerts, fetchSocialSignals, fetchNairaRate]);

  const formatTime = d => d ? new Date(d).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }) : "";

  const reddit   = socialSignals.filter(s => s.category === "social_reddit");
  const trends   = socialSignals.filter(s => s.category === "trending_search");
  const youtube  = socialSignals.filter(s => s.category === "social_video");
  const comments = socialSignals.filter(s => s.category === "youtube_comment");
  const signals  = socialSignals.filter(s => s.category === "social_signal");

  const handleReact = (topicName, reactionKey) => {
    setReactions(prev => ({
      ...prev,
      [topicName]: { ...(prev[topicName] || {}), [reactionKey]: ((prev[topicName]?.[reactionKey]) || 0) + 1 }
    }));
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
      else setSubscribeError(data.error || "Something went wrong. Try again.");
    } catch { setSubscribeError("Connection error."); }
    finally { setSubscribeLoading(false); }
  };

  const tabs = t.tabs.map((label, i) => ({ id: ["pulse","foreign","social"][i], label }));
  const languages = [{ code: "en", label: "EN", flag: "🇬🇧" }, { code: "ha", label: "HA", flag: "🇳🇬" }, { code: "yo", label: "YO", flag: "🇳🇬" }];

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.text, transition: "background 0.3s, color 0.3s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,400&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.3)} }
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideDown { from{opacity:0;transform:translateX(-50%) translateY(-12px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .skeleton { background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 8px; }
        .skeleton-dark { background: linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 8px; }
        .topic-appear { animation: fadeUp 0.4s ease both; }
        input::placeholder { color: #9ca3af; }
        input:focus { outline: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 2px; }
        a { color: inherit; }
      `}</style>

      {/* ── Notifications ── */}
      {showNotify && <NotificationBanner t={t} onDismiss={() => setShowNotify(false)} />}

      {/* ── Header ── */}
      <header style={{ position: "sticky", top: 0, background: theme.headerBg, backdropFilter: "blur(12px)", borderBottom: `1px solid ${theme.border}`, zIndex: 100, padding: "0 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px", gap: "12px" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            <span style={{ fontSize: "24px" }}>🇳🇬</span>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 800, color: theme.text, margin: 0, letterSpacing: "-0.01em" }}>
                Nigeria <span style={{ color: "#008751" }}>Pulse</span>
              </h1>
              <p style={{ fontSize: "9px", color: theme.textMuted, letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>{t.tagline}</p>
            </div>
          </div>

          {/* Right controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            {/* Language switcher */}
            <div style={{ display: "flex", background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: "20px", padding: "2px" }}>
              {languages.map(l => (
                <button key={l.code} onClick={() => setLang(l.code)}
                  style={{ padding: "4px 10px", borderRadius: "16px", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: 600, background: lang === l.code ? "#008751" : "transparent", color: lang === l.code ? "#fff" : theme.textMuted, transition: "all 0.2s" }}>
                  {l.flag} {l.label}
                </button>
              ))}
            </div>
            {/* Dark mode */}
            <button onClick={() => setDarkMode(!darkMode)}
              style={{ background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: "20px", padding: "5px 12px", cursor: "pointer", fontSize: "13px", color: theme.text, display: "flex", alignItems: "center", gap: "5px", transition: "all 0.2s" }}>
              {darkMode ? "☀️" : "🌙"}
            </button>
            {lastUpdated && <span style={{ fontSize: "11px", color: theme.textMuted, display: "none" /* hide on mobile */ }}>{t.updated} {formatTime(lastUpdated)}</span>}
            <LiveDot label={t.liveLabel} />
          </div>
        </div>
      </header>

      <NairaRateBar nairaRate={nairaRate} formatTime={formatTime} t={t} />
      <NewsTicker articles={news.slice(0, 12)} />

      {/* ── HERO ── */}
      <div style={{ padding: "52px 24px 36px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <div style={{ width: "20px", height: "3px", background: "#008751", borderRadius: "2px" }} />
          <p style={{ fontSize: "11px", letterSpacing: "0.18em", color: "#008751", fontWeight: 700, textTransform: "uppercase" }}>
            ◆ What Nigeria Is Thinking Right Now
          </p>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(30px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.05, color: theme.text }}>
            {pulse?.top_topics?.[activeTopicIndex]?.name
              ? <><span style={{ color: "#008751" }}>{pulse.top_topics[activeTopicIndex].name}</span><br /><span style={{ color: theme.textMuted, fontWeight: 400, fontSize: "clamp(18px,3vw,32px)" }}>{t.heroSubtitle}</span></>
              : <>{t.heroDefault}</>
            }
          </h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "13px", color: theme.textMuted }}>{pulse?.total_articles_analyzed || 0} {t.signalsAnalyzed}</span>
          <span style={{ color: theme.border }}>·</span>
          <span style={{ fontSize: "13px", color: theme.textMuted }}>{t.sources}</span>
          {nairaRate && (<><span style={{ color: theme.border }}>·</span><span style={{ fontSize: "13px", color: "#d97706", fontWeight: 600 }}>💵 $1 = ₦{Number(nairaRate.usd_to_ngn).toFixed(0)}</span></>)}
          {socialSignals.length > 0 && (<><span style={{ color: theme.border }}>·</span><span style={{ fontSize: "13px", color: "#7c3aed" }}>📱 {socialSignals.length} {t.socialSignals}</span></>)}
          {foreignAlerts.length > 0 && (<><span style={{ color: theme.border }}>·</span><span style={{ fontSize: "13px", color: "#ea580c" }}>🌍 {foreignAlerts.length} {t.globalAlerts}</span></>)}
          {pulse?.top_topics && (
            <div style={{ display: "flex", gap: "5px", marginLeft: "auto" }}>
              {pulse.top_topics.map((_, i) => (
                <button key={i} onClick={() => setActiveTopicIndex(i)}
                  style={{ width: i === activeTopicIndex ? "22px" : "6px", height: "6px", borderRadius: "3px", background: i === activeTopicIndex ? "#008751" : theme.border, border: "none", cursor: "pointer", transition: "all 0.3s ease", padding: 0 }} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ padding: "0 24px", maxWidth: "1200px", margin: "0 auto", marginBottom: "32px" }}>
        <div style={{ display: "flex", gap: "3px", background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: "10px", padding: "3px", width: "fit-content", flexWrap: "wrap" }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ padding: "8px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontFamily: "'Source Serif 4', serif", fontWeight: 600, fontSize: "13px", background: activeTab === tab.id ? "#fff" : "transparent", color: activeTab === tab.id ? "#111827" : theme.textMuted, boxShadow: activeTab === tab.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none", transition: "all 0.2s" }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Content ── */}
      <main style={{ padding: "0 24px 80px", maxWidth: "1200px", margin: "0 auto" }}>

        {/* ── NATIONAL PULSE ── */}
        {activeTab === "pulse" && (
          <div>
            {loading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: "16px" }}>
                {[1,2,3,4,5].map(i => (
                  <div key={i} style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: "16px", padding: "24px", height: "200px" }}>
                    <div className={darkMode ? "skeleton-dark" : "skeleton"} style={{ height: "14px", width: "40%", marginBottom: "16px" }} />
                    <div className={darkMode ? "skeleton-dark" : "skeleton"} style={{ height: "22px", width: "80%", marginBottom: "12px" }} />
                    <div className={darkMode ? "skeleton-dark" : "skeleton"} style={{ height: "14px", width: "100%" }} />
                  </div>
                ))}
              </div>
            ) : !pulse ? (
              <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📡</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", marginBottom: "8px", color: theme.text }}>{t.warmingUp}</h3>
                <p style={{ color: theme.textMuted }}>{t.warmingUpMsg}</p>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <p style={{ fontSize: "10px", color: theme.textMuted, letterSpacing: "0.12em" }}>{t.topTopics}</p>
                  {pulse.engine_used && (
                    <span style={{ fontSize: "10px", color: theme.textMuted, background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: "4px", padding: "3px 8px" }}>
                      AI: {pulse.engine_used} · {Math.round((pulse.analysis_confidence || 0) * 100)}% confidence
                    </span>
                  )}
                </div>

                {/* Nigeria Map */}
                <NigeriaMap t={t} />

                {/* Topic grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: "16px" }}>
                  {pulse.top_topics?.map((topic, i) => (
                    <div key={i} className="topic-appear" style={{ animationDelay: `${i * 80}ms` }}>
                      <TopicCard topic={topic} index={i} isActive={i === activeTopicIndex} t={t} reactions={reactions[topic.name]} onReact={handleReact} />
                    </div>
                  ))}
                </div>

                {/* Stats bar */}
                <div style={{ marginTop: "40px", padding: "24px", background: theme.statsBg, border: `1px solid ${theme.statsBorder}`, borderRadius: "16px", display: "flex", gap: "32px", flexWrap: "wrap" }}>
                  {[
                    { label: "SIGNALS ANALYZED", value: pulse.total_articles_analyzed, color: theme.text },
                    { label: "TOPICS TRACKED",   value: pulse.top_topics?.length, color: theme.text },
                    { label: "GOVT AGENDA",      value: pulse.top_topics?.filter(t => t.in_govt_agenda).length, color: "#008751" },
                    { label: "SOCIAL SIGNALS",   value: socialSignals.length, color: "#7c3aed" },
                    { label: "GLOBAL ALERTS",    value: foreignAlerts.length, color: "#ea580c" },
                    { label: "NAIRA RATE",        value: nairaRate ? `₦${Number(nairaRate.usd_to_ngn).toFixed(0)}` : "—", color: "#d97706" },
                    { label: "SENTIMENT",         value: pulse.overall_sentiment || "—", color: theme.textMuted },
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <div style={{ fontSize: "9px", color: theme.textMuted, letterSpacing: "0.12em", marginBottom: "4px" }}>{label}</div>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 700, color, textTransform: "capitalize" }}>{value}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── GLOBAL IMPACT ── */}
        {activeTab === "foreign" && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "14px", fontWeight: 700, color: "#ea580c", letterSpacing: "0.08em", marginBottom: "6px" }}>🌍 GLOBAL EVENTS AFFECTING NIGERIA</h3>
              <p style={{ fontSize: "14px", color: theme.textMuted, lineHeight: 1.6 }}>{t.globalDesc}</p>
            </div>
            {alertsLoading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: "16px" }}>
                {[1,2,3].map(i => <div key={i} className={darkMode ? "skeleton-dark" : "skeleton"} style={{ height: "160px", borderRadius: "14px" }} />)}
              </div>
            ) : foreignAlerts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🌐</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", marginBottom: "8px", color: theme.text }}>{t.noAlerts}</h3>
                <p style={{ color: theme.textMuted }}>{t.noAlertsMsg}</p>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
                  {[...new Set(foreignAlerts.map(a => a.impact_sector))].map(sector => {
                    const sc = { oil:"#ea580c", forex:"#d97706", diaspora:"#7c3aed", trade:"#2563eb", security:"#dc2626", food:"#16a34a", other:"#6b7280" };
                    const bg = { oil:"#fff7ed", forex:"#fef3c7", diaspora:"#f5f3ff", trade:"#eff6ff", security:"#fee2e2", food:"#dcfce7", other:"#f9fafb" };
                    return (
                      <div key={sector} style={{ background: bg[sector] || "#f9fafb", border: `1px solid ${sc[sector] || "#6b7280"}30`, borderRadius: "20px", padding: "5px 14px", display: "flex", gap: "6px", alignItems: "center" }}>
                        <span style={{ fontSize: "11px", color: sc[sector], fontWeight: 700 }}>{(sector||"").toUpperCase()}</span>
                        <span style={{ fontSize: "11px", color: theme.textMuted }}>{foreignAlerts.filter(a => a.impact_sector === sector).length}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: "16px" }}>
                  {foreignAlerts.map((alert, i) => <ForeignAlertCard key={i} alert={alert} />)}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── SOCIAL SIGNALS ── */}
        {activeTab === "social" && (
          <div>
            <div style={{ marginBottom: "28px" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "14px", fontWeight: 700, color: "#7c3aed", letterSpacing: "0.08em", marginBottom: "6px" }}>📱 SOCIAL MEDIA & SIGNAL INTELLIGENCE</h3>
              <p style={{ fontSize: "14px", color: theme.textMuted, lineHeight: 1.6 }}>{t.socialDesc}</p>
            </div>
            {socialLoading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "12px" }}>
                {[1,2,3,4,5,6].map(i => <div key={i} className={darkMode ? "skeleton-dark" : "skeleton"} style={{ height: "110px", borderRadius: "12px" }} />)}
              </div>
            ) : socialSignals.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📡</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", marginBottom: "8px", color: theme.text }}>{t.noSocial}</h3>
                <p style={{ color: theme.textMuted }}>{t.noSocialMsg}</p>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "36px" }}>
                  {[
                    { label: "Reddit", color: "#ea580c", data: reddit },
                    { label: "YouTube", color: "#dc2626", data: youtube },
                    { label: "YT Comments", color: "#f97316", data: comments },
                    { label: "Trends", color: "#d97706", data: trends },
                    { label: "Signals", color: "#16a34a", data: signals },
                  ].filter(x => x.data.length > 0).map(({ label, color, data }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px", background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: "10px", padding: "8px 16px" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: color }} />
                      <span style={{ fontSize: "12px", color: theme.textMuted }}>{label}</span>
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 700, color: theme.text }}>{data.length}</span>
                    </div>
                  ))}
                </div>

                {reddit.length > 0 && (
                  <div style={{ marginBottom: "40px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                      <span>💬</span>
                      <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "13px", fontWeight: 700, color: "#ea580c", letterSpacing: "0.08em", margin: 0 }}>REDDIT NIGERIA</h4>
                      <span style={{ fontSize: "11px", color: theme.textMuted }}>{reddit.length} posts</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "10px" }}>
                      {reddit.slice(0,9).map((p,i) => <SocialCard key={i} item={p} accentColor="#ea580c" />)}
                    </div>
                  </div>
                )}

                {trends.length > 0 && (
                  <div style={{ marginBottom: "40px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                      <span>🔍</span>
                      <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "13px", fontWeight: 700, color: "#d97706", letterSpacing: "0.08em", margin: 0 }}>GOOGLE TRENDS NIGERIA</h4>
                      <span style={{ fontSize: "11px", color: theme.textMuted }}>{trends.length} searches</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {trends.map((trend, i) => (
                        <a key={i} href={trend.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: "8px", padding: "8px 16px", transition: "box-shadow 0.2s" }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)"}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                          >
                            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "14px", fontWeight: 700, color: "#d97706", minWidth: "24px" }}>{String(i + 1).padStart(2, "0")}</span>
                            <span style={{ fontSize: "13px", color: theme.text }}>{trend.title}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {youtube.length > 0 && (
                  <div style={{ marginBottom: "40px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                      <span>▶️</span>
                      <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "13px", fontWeight: 700, color: "#dc2626", letterSpacing: "0.08em", margin: 0 }}>YOUTUBE — NIGERIAN BROADCASTERS</h4>
                      <span style={{ fontSize: "11px", color: theme.textMuted }}>{youtube.length} videos</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "10px" }}>
                      {youtube.slice(0,9).map((v,i) => <SocialCard key={i} item={{ ...v, source: (v.source||"").replace(" YouTube","") }} accentColor="#dc2626" />)}
                    </div>
                  </div>
                )}

                {comments.length > 0 && (
                  <div style={{ marginBottom: "40px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                      <span>💭</span>
                      <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "13px", fontWeight: 700, color: "#f97316", letterSpacing: "0.08em", margin: 0 }}>WHAT NIGERIANS ARE SAYING</h4>
                      <span style={{ fontSize: "11px", color: theme.textMuted }}>{comments.length} comments</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "10px" }}>
                      {comments.slice(0,12).map((c,i) => <CommentCard key={i} item={c} />)}
                    </div>
                  </div>
                )}

                {signals.length > 0 && (
                  <div style={{ marginBottom: "40px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                      <span>📡</span>
                      <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "13px", fontWeight: 700, color: "#16a34a", letterSpacing: "0.08em", margin: 0 }}>EDITORIAL SIGNALS</h4>
                      <span style={{ fontSize: "11px", color: theme.textMuted }}>{signals.length} articles</span>
                    </div>
                    <div style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: "12px", overflow: "hidden" }}>
                      {signals.slice(0,14).map((item,i) => (
                        <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                          <div style={{ padding: "12px 18px", borderBottom: i < 13 ? `1px solid ${theme.border}` : "none", transition: "background 0.15s, padding-left 0.15s" }}
                            onMouseEnter={e => { e.currentTarget.style.background = theme.surface2; e.currentTarget.style.paddingLeft = "24px"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.paddingLeft = "18px"; }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                              <div style={{ flex: 1 }}>
                                <span style={{ fontSize: "10px", color: "#16a34a", fontWeight: 600, marginRight: "8px" }}>{item.source}</span>
                                <p style={{ fontSize: "13px", color: theme.text, lineHeight: 1.4, margin: "3px 0 0" }}>{item.title}</p>
                              </div>
                              <span style={{ fontSize: "10px", color: theme.textMuted, whiteSpace: "nowrap", marginTop: "2px" }}>{timeAgo(item.scraped_at)}</span>
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

      {/* ── Subscribe ── */}
      <div style={{ borderTop: `1px solid ${theme.border}`, padding: "64px 24px", background: theme.surface }}>
        <div style={{ maxWidth: "540px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "10px", color: "#008751", letterSpacing: "0.18em", fontWeight: 700, marginBottom: "12px" }}>{t.stayInformed}</p>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: 800, color: theme.text, marginBottom: "12px", letterSpacing: "-0.01em" }}>{t.subscribeTitle}</h3>
          <p style={{ fontSize: "14px", color: theme.textMuted, marginBottom: "32px", lineHeight: 1.7 }}>{t.subscribeDesc}</p>
          {subscribeSuccess ? (
            <div style={{ background: "#dcfce7", border: "1px solid #86efac", borderRadius: "16px", padding: "28px" }}>
              <div style={{ fontSize: "36px", marginBottom: "10px" }}>🎉</div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700, color: "#15803d", margin: "0 0 8px" }}>{t.subscribed}</p>
              <p style={{ fontSize: "13px", color: "#166534", margin: 0 }}>{t.subscribedMsg}</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { type: "text",  placeholder: t.namePlaceholder,     value: subscribeName,     setter: setSubscribeName },
                { type: "email", placeholder: t.emailPlaceholder,    value: subscribeEmail,    setter: setSubscribeEmail },
                { type: "tel",   placeholder: t.whatsappPlaceholder, value: subscribeWhatsapp, setter: setSubscribeWhatsapp },
              ].map(({ type, placeholder, value, setter }) => (
                <input key={type} type={type} placeholder={placeholder} value={value} onChange={e => setter(e.target.value)}
                  style={{ width: "100%", padding: "13px 16px", background: theme.inputBg, border: `1px solid ${theme.inputBorder}`, borderRadius: "10px", color: theme.inputColor, fontSize: "14px" }}
                  onFocus={e => e.target.style.borderColor = "#008751"}
                  onBlur={e => e.target.style.borderColor = theme.inputBorder}
                />
              ))}
              {subscribeError && <p style={{ fontSize: "13px", color: "#dc2626", margin: 0 }}>{subscribeError}</p>}
              <button onClick={handleSubscribe} disabled={subscribeLoading}
                style={{ width: "100%", padding: "14px", background: subscribeLoading ? "#d1d5db" : "#008751", color: "#fff", border: "none", borderRadius: "10px", fontSize: "14px", fontFamily: "'Playfair Display', serif", fontWeight: 700, cursor: subscribeLoading ? "not-allowed" : "pointer", letterSpacing: "0.04em", transition: "background 0.2s" }}>
                {subscribeLoading ? t.subscribing : t.subscribeCTA}
              </button>
              <p style={{ fontSize: "11px", color: theme.textMuted, margin: 0 }}>{t.noSpam} 🇳🇬</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${theme.border}`, padding: "20px 24px", textAlign: "center", background: theme.bg }}>
        <p style={{ fontSize: "12px", color: theme.textMuted }}>{t.footerText}</p>
      </footer>

      {/* ── AI Chat ── */}
      <AIChatWidget t={t} isOpen={chatOpen} onClose={() => setChatOpen(false)} pulse={pulse} nairaRate={nairaRate} />

      {/* ── Floating AI button ── */}
      <button onClick={() => setChatOpen(!chatOpen)}
        style={{ position: "fixed", bottom: "24px", right: "24px", width: "54px", height: "54px", borderRadius: "50%", background: chatOpen ? "#dc2626" : "#008751", color: "#fff", border: "none", cursor: "pointer", fontSize: "22px", boxShadow: "0 4px 20px rgba(0,135,81,0.4)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s, transform 0.2s" }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        {chatOpen ? "×" : "🤖"}
      </button>
    </div>
  );
}