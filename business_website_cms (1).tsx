import { useState } from "react";

const SUPABASE_URL = "https://jouw-project.supabase.co";
const SUPABASE_KEY = "jouw-anon-key";

async function askClaude(question, companyName, services) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `Je bent een vriendelijke klantenservice medewerker voor ${companyName}. Diensten: ${services}. Beantwoord kort en professioneel in het Nederlands (max 3 zinnen): ${question}`
      }]
    })
  });
  const d = await res.json();
  return d.content?.[0]?.text || "Bedankt voor uw vraag! Neem contact op via WhatsApp.";
}

const DEFAULT_CONTENT = {
  company_name: "Uw Bedrijf",
  hero_title: "Vakmanschap dat het verschil maakt",
  hero_subtitle: "Persoonlijke service, meetbaar resultaat — wij staan voor u klaar.",
  hero_cta: "Neem contact op",
  about_title: "Over Ons",
  about_text: "Wij zijn een gedreven team van professionals met jarenlange ervaring. Kwaliteit en persoonlijke betrokkenheid staan bij ons altijd voorop.",
  services_title: "Onze Diensten",
  service1_title: "Premium Advies", service1_text: "Strategisch advies op maat voor uw organisatie.",
  service2_title: "Maatwerk Oplossingen", service2_text: "Uw wensen centraal, van plan tot resultaat.",
  service3_title: "Support & Begeleiding", service3_text: "Persoonlijke begeleiding ook na oplevering.",
  contact_title: "Contact",
  contact_email: "info@uwbedrijf.nl",
  contact_phone: "+31 6 00 000 000",
  contact_address: "Voorbeeldstraat 1, 1234 AB Amsterdam",
  whatsapp_number: "31600000000",
  footer_text: "© 2026 Uw Bedrijf. Alle rechten voorbehouden.",
};

const DEFAULT_FAQS = [
  { id: 1, question: "Wat zijn jullie openingstijden?", answer: "Wij zijn bereikbaar op werkdagen van 09:00 tot 17:30." },
  { id: 2, question: "Hoe kan ik een offerte aanvragen?", answer: "Via het contactformulier of WhatsApp kunt u vrijblijvend een offerte aanvragen." },
  { id: 3, question: "Wat zijn de kosten?", answer: "Onze tarieven zijn afhankelijk van de opdracht. Neem contact op voor een persoonlijk gesprek." },
];

// Amber palette
const A = {
  900: "#2d1a04", 800: "#412402", 700: "#633806",
  600: "#854f0b", 500: "#ba7517", 400: "#ef9f27",
  300: "#fac775", 200: "#faeeda", 100: "#fef3c7", 50: "#fffbeb",
};

const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function App() {
  const [view, setView] = useState("website");
  const [content, setContent] = useState({ ...DEFAULT_CONTENT });
  const [faqs, setFaqs] = useState([...DEFAULT_FAQS]);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: "bot", text: "Goedendag! Hoe kan ik u vandaag helpen?" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [editContent, setEditContent] = useState({ ...DEFAULT_CONTENT });
  const [editFaqs, setEditFaqs] = useState([...DEFAULT_FAQS]);
  const [cmsTab, setCmsTab] = useState("texts");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setContent({ ...editContent });
    setFaqs([...editFaqs]);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const q = input.trim(); setInput("");
    setMessages(m => [...m, { from: "user", text: q }]);
    setLoading(true);
    const match = faqs.find(f =>
      f.question.toLowerCase().includes(q.toLowerCase().slice(0, 15)) ||
      q.toLowerCase().includes(f.question.toLowerCase().slice(0, 15))
    );
    if (match) {
      setMessages(m => [...m, { from: "bot", text: match.answer }]);
      setLoading(false);
    } else {
      try {
        const ans = await askClaude(q, content.company_name, `${content.service1_title}, ${content.service2_title}, ${content.service3_title}`);
        setMessages(m => [...m, { from: "bot", text: ans }]);
      } catch {
        setMessages(m => [...m, { from: "bot", text: "Bedankt! Neem contact op via WhatsApp voor hulp." }]);
      }
      setLoading(false);
    }
  };

  // ── Styles ──
  const nav = { background: A[900], padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, position: "sticky", top: 0, zIndex: 100, borderBottom: `2px solid ${A[700]}` };
  const navBtn = (a) => ({ background: a ? A[600] : "transparent", color: a ? A[100] : A[300], border: `1px solid ${a ? A[500] : "transparent"}`, borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600 });
  const hero = { background: `linear-gradient(160deg, ${A[900]} 0%, ${A[800]} 50%, ${A[700]} 100%)`, color: "#fff", padding: "90px 2rem 75px", textAlign: "center", borderBottom: `3px solid ${A[500]}` };
  const ctaBtn = { background: A[400], color: A[900], border: "none", borderRadius: 50, padding: "14px 38px", fontSize: 15, fontWeight: 700, cursor: "pointer", letterSpacing: 0.3 };
  const sec = { padding: "72px 2rem", maxWidth: 1100, margin: "0 auto" };
  const secTitle = { fontSize: "clamp(1.5rem, 3vw, 2.1rem)", fontWeight: 700, color: A[700], marginBottom: "0.5rem", textAlign: "center" };
  const divider = { width: 56, height: 3, background: A[400], borderRadius: 2, margin: "0 auto 2.5rem" };
  const card = { background: "#fff", borderRadius: 16, padding: "1.75rem", boxShadow: "0 2px 16px rgba(0,0,0,0.07)", border: `1px solid ${A[200]}` };
  const cardIcon = { width: 46, height: 46, borderRadius: 12, background: A[100], display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, fontSize: 22 };
  const icons = ["⭐", "🔧", "🤝"];

  // Chat
  const chatBtn = { position: "fixed", bottom: 28, right: 28, background: A[400], color: A[900], border: "none", borderRadius: "50%", width: 58, height: 58, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 20px rgba(239,159,39,0.4)`, zIndex: 200, fontSize: 24 };
  const chatBox = { position: "fixed", bottom: 98, right: 28, width: 330, background: "#fff", borderRadius: 20, boxShadow: "0 8px 40px rgba(0,0,0,0.16)", zIndex: 200, overflow: "hidden", display: "flex", flexDirection: "column", border: `1px solid ${A[200]}` };
  const chatHead = { background: `linear-gradient(135deg, ${A[800]}, ${A[600]})`, padding: "14px 16px", color: A[100] };
  const msgBot = { background: A[100], color: A[800], borderRadius: "14px 14px 14px 4px", padding: "9px 13px", fontSize: 13, maxWidth: "85%", lineHeight: 1.5 };
  const msgUser = { background: A[500], color: "#fff", borderRadius: "14px 14px 4px 14px", padding: "9px 13px", fontSize: 13, maxWidth: "85%", alignSelf: "flex-end", lineHeight: 1.5 };
  const waBtn = { display: "flex", alignItems: "center", gap: 8, background: "#25d366", color: "#fff", border: "none", borderRadius: 10, padding: "9px 14px", cursor: "pointer", width: "100%", fontWeight: 600, fontSize: 13, justifyContent: "center" };

  // CMS
  const inp = { width: "100%", border: `1.5px solid ${A[200]}`, borderRadius: 10, padding: "9px 13px", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  const ta = { ...inp, resize: "vertical", minHeight: 75 };
  const label = { display: "block", fontWeight: 600, color: A[700], marginBottom: 5, fontSize: 13 };
  const saveBtn = { background: A[500], color: "#fff", border: "none", borderRadius: 12, padding: "11px 30px", fontSize: 15, fontWeight: 700, cursor: "pointer" };
  const cmsTabBtn = (a) => ({ background: a ? A[500] : "#fff", color: a ? "#fff" : A[700], border: `2px solid ${a ? A[500] : A[200]}`, borderRadius: 10, padding: "7px 18px", cursor: "pointer", fontWeight: 600, fontSize: 13 });
  const faqCard = { background: A[50], border: `1.5px solid ${A[200]}`, borderRadius: 14, padding: "1.1rem", marginBottom: 12 };

  const Field = ({ lbl, id, multi }) => (
    <div style={{ marginBottom: 16 }}>
      <label style={label}>{lbl}</label>
      {multi
        ? <textarea style={ta} value={editContent[id] || ""} onChange={e => setEditContent(c => ({ ...c, [id]: e.target.value }))} />
        : <input style={inp} value={editContent[id] || ""} onChange={e => setEditContent(c => ({ ...c, [id]: e.target.value }))} />
      }
    </div>
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh", background: A[50] }}>
      {/* Nav */}
      <nav style={nav}>
        <span style={{ color: A[300], fontWeight: 700, fontSize: 19, letterSpacing: "-0.3px" }}>{content.company_name}</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={navBtn(view === "website")} onClick={() => setView("website")}>🌐 Website</button>
          <button style={navBtn(view === "cms")} onClick={() => setView("cms")}>⚙️ CMS Beheer</button>
        </div>
      </nav>

      {view === "website" && <>
        {/* Hero */}
        <section style={hero}>
          <div style={{ display: "inline-block", background: A[700], color: A[300], fontSize: 12, fontWeight: 600, padding: "4px 14px", borderRadius: 99, marginBottom: 20, letterSpacing: 1 }}>PROFESSIONELE DIENSTVERLENING</div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 800, color: A[50], margin: "0 0 1rem", lineHeight: 1.15 }}>{content.hero_title}</h1>
          <p style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", color: A[300], maxWidth: 580, margin: "0 auto 2rem", lineHeight: 1.7 }}>{content.hero_subtitle}</p>
          <button style={ctaBtn} onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>{content.hero_cta}</button>
        </section>

        {/* Services */}
        <div style={sec}>
          <h2 style={secTitle}>{content.services_title}</h2>
          <div style={divider} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 22 }}>
            {[1,2,3].map((i, idx) => (
              <div key={i} style={card}>
                <div style={cardIcon}>{icons[idx]}</div>
                <div style={{ fontWeight: 700, fontSize: 17, color: A[800], marginBottom: 8 }}>{content[`service${i}_title`]}</div>
                <div style={{ color: "#64748b", lineHeight: 1.65, fontSize: 14 }}>{content[`service${i}_text`]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* About */}
        <div style={{ background: A[900], padding: "70px 2rem" }}>
          <h2 style={{ ...secTitle, color: A[300] }}>{content.about_title}</h2>
          <div style={{ ...divider, background: A[400] }} />
          <div style={{ background: A[800], border: `1px solid ${A[700]}`, borderRadius: 20, padding: "2.5rem", maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
            <p style={{ color: A[200], fontSize: 16, lineHeight: 1.85 }}>{content.about_text}</p>
          </div>
        </div>

        {/* Contact */}
        <div id="contact" style={sec}>
          <h2 style={secTitle}>{content.contact_title}</h2>
          <div style={divider} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 18 }}>
            {[["📧 E-mail", content.contact_email], ["📞 Telefoon", content.contact_phone], ["📍 Adres", content.contact_address]].map(([l, v]) => (
              <div key={l} style={{ ...card, textAlign: "center" }}>
                <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{l}</div>
                <div style={{ color: A[700], fontWeight: 600, fontSize: 15 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        <footer style={{ background: A[900], color: A[500], textAlign: "center", padding: "1.75rem", fontSize: 13, borderTop: `2px solid ${A[700]}` }}>{content.footer_text}</footer>

        {/* Chat button */}
        <button style={chatBtn} onClick={() => setChatOpen(o => !o)}>
          {chatOpen ? "✕" : <WhatsAppIcon />}
        </button>

        {/* Chat widget */}
        {chatOpen && (
          <div style={chatBox}>
            <div style={chatHead}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>💬 {content.company_name}</div>
              <div style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>Stel uw vraag — wij helpen u!</div>
            </div>
            <div style={{ flex: 1, padding: "0.9rem", overflowY: "auto", maxHeight: 270, display: "flex", flexDirection: "column", gap: 8 }}>
              {messages.map((m, i) => <div key={i} style={m.from === "bot" ? msgBot : msgUser}>{m.text}</div>)}
              {loading && <div style={msgBot}>⏳ Even geduld...</div>}
            </div>
            <div style={{ padding: "0 0.75rem 0.6rem" }}>
              <button style={waBtn} onClick={() => window.open(`https://wa.me/${content.whatsapp_number}`, "_blank")}>
                <WhatsAppIcon /> Verder op WhatsApp
              </button>
            </div>
            <div style={{ display: "flex", borderTop: `1px solid ${A[200]}`, padding: "0.65rem" }}>
              <input style={{ flex: 1, border: `1px solid ${A[200]}`, borderRadius: 9, padding: "7px 11px", fontSize: 13, outline: "none" }}
                value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="Uw vraag..." />
              <button style={{ background: A[500], color: "#fff", border: "none", borderRadius: 9, padding: "7px 14px", marginLeft: 7, cursor: "pointer", fontWeight: 600, fontSize: 12 }} onClick={sendMessage}>Stuur</button>
            </div>
          </div>
        )}
      </>}

      {/* CMS */}
      {view === "cms" && (
        <div style={{ padding: "2rem", maxWidth: 880, margin: "0 auto" }}>
          <h1 style={{ color: A[700], marginBottom: 6, fontSize: 24, fontWeight: 700 }}>⚙️ Contentbeheer</h1>
          <p style={{ color: "#64748b", marginBottom: 22, fontSize: 14 }}>Pas alle teksten en FAQ's aan. Klik Opslaan om direct toe te passen.</p>
          <div style={{ background: A[100], border: `1px solid ${A[300]}`, borderRadius: 10, padding: "11px 15px", marginBottom: 22, fontSize: 13, color: A[700], lineHeight: 1.5 }}>
            ℹ️ Vervang <code>SUPABASE_URL</code> en <code>SUPABASE_KEY</code> in de code voor permanente opslag.
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
            {["texts","services","contact","faqs"].map(t => (
              <button key={t} style={cmsTabBtn(cmsTab === t)} onClick={() => setCmsTab(t)}>
                {{ texts: "📝 Algemeen", services: "🛠 Diensten", contact: "📬 Contact", faqs: "❓ FAQ's" }[t]}
              </button>
            ))}
          </div>

          {cmsTab === "texts" && <>
            <Field lbl="Bedrijfsnaam" id="company_name" />
            <Field lbl="Hero Titel" id="hero_title" />
            <Field lbl="Hero Subtitel" id="hero_subtitle" multi />
            <Field lbl="Hero Knoptekst" id="hero_cta" />
            <Field lbl="Over Ons Titel" id="about_title" />
            <Field lbl="Over Ons Tekst" id="about_text" multi />
            <Field lbl="Diensten Sectietitel" id="services_title" />
            <Field lbl="Footertekst" id="footer_text" />
          </>}

          {cmsTab === "services" && [1,2,3].map(i => (
            <div key={i} style={{ ...faqCard, marginBottom: 20 }}>
              <strong style={{ color: A[700] }}>Dienst {i}</strong>
              <div style={{ marginTop: 10 }}>
                <Field lbl="Titel" id={`service${i}_title`} />
                <Field lbl="Omschrijving" id={`service${i}_text`} multi />
              </div>
            </div>
          ))}

          {cmsTab === "contact" && <>
            <Field lbl="Sectietitel" id="contact_title" />
            <Field lbl="E-mailadres" id="contact_email" />
            <Field lbl="Telefoonnummer" id="contact_phone" />
            <Field lbl="Adres" id="contact_address" />
            <Field lbl="WhatsApp (bijv. 31612345678)" id="whatsapp_number" />
          </>}

          {cmsTab === "faqs" && <>
            <p style={{ color: "#64748b", marginBottom: 14, fontSize: 13 }}>Vragen die de chatbot direct beantwoordt. Overige vragen gaan via AI.</p>
            {editFaqs.map((f, idx) => (
              <div key={f.id} style={faqCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <strong style={{ color: A[700], fontSize: 13 }}>FAQ {idx + 1}</strong>
                  <button style={{ background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 7, padding: "3px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}
                    onClick={() => setEditFaqs(f2 => f2.filter(x => x.id !== f.id))}>✕ Verwijder</button>
                </div>
                <label style={label}>Vraag</label>
                <input style={{ ...inp, marginBottom: 10 }} value={f.question} onChange={e => setEditFaqs(f2 => f2.map(x => x.id === f.id ? { ...x, question: e.target.value } : x))} />
                <label style={label}>Antwoord</label>
                <textarea style={ta} value={f.answer} onChange={e => setEditFaqs(f2 => f2.map(x => x.id === f.id ? { ...x, answer: e.target.value } : x))} />
              </div>
            ))}
            <button style={{ background: A[100], color: A[600], border: `2px dashed ${A[400]}`, borderRadius: 12, padding: "9px 18px", fontWeight: 600, cursor: "pointer", width: "100%", fontSize: 13 }}
              onClick={() => setEditFaqs(f => [...f, { id: Date.now(), question: "", answer: "" }])}>+ Nieuwe FAQ toevoegen</button>
          </>}

          <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 14 }}>
            <button style={saveBtn} onClick={handleSave}>💾 Opslaan & toepassen</button>
            {saved && <span style={{ background: "#dcfce7", color: "#16a34a", borderRadius: 8, padding: "6px 14px", fontWeight: 600, fontSize: 13 }}>✓ Opgeslagen!</span>}
          </div>
        </div>
      )}
    </div>
  );
}
