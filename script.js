"use strict";

/* ---------- Helpers ---------- */
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const EXT = 'target="_blank" rel="noopener noreferrer"';

/* ---------- Data ---------- */
const STATS = [
  { n: "$16.6B", l: "Reported losses to the FBI from internet crime in 2024", s: "FBI IC3 Internet Crime Report 2024", d: "Apr 2025", u: "https://www.ic3.gov/AnnualReport/Reports/2024_IC3Report.pdf" },
  { n: "$4.44M", l: "Global average cost of a data breach", s: "IBM Cost of a Data Breach Report 2025", d: "Jul 2025", u: "https://www.ibm.com/reports/data-breach" },
  { n: "~60%", l: "Of breaches involved a human element", s: "Verizon DBIR 2025", d: "Apr 2025", u: "https://www.verizon.com/business/resources/reports/dbir/" },
  { n: "22%", l: "Of breaches began with stolen credentials", s: "Verizon DBIR 2025", d: "Apr 2025", u: "https://www.verizon.com/business/resources/reports/dbir/" },
];

const TOPICS = [
  { id: "phishing", t: "Phishing Awareness", e: "🎣", sum: "Fake messages that trick you into clicking, paying or sharing logins.", threat: "Fake emails, texts and calls impersonating banks, couriers and employers.",
    sec: [
      ["What is phishing?", "Phishing is a scam where an attacker pretends to be someone you trust to steal credentials, money or data."],
      ["How phishing emails work", "They create urgency (“account locked”), imitate a brand, and push you to a fake login page or a malicious attachment. Credentials you enter go straight to the attacker."],
      ["Spotting suspicious links", "Hover to preview the real address. The real domain is the part just before the first single slash, so paypal.com.example.net belongs to example.net. Watch for typos, extra hyphens and shortened links."],
      ["Common techniques", "Spear phishing (personalised), smishing (SMS), vishing (voice), QR-code phishing, and business email compromise (fake invoices or executive requests)."],
      ["Protect yourself", "Never act on urgency. Open the official app or type the website yourself. Verify requests through a second channel. Report and delete."],
    ] },
  { id: "passwords", t: "Password Security", e: "🔑", sum: "Strong, unique passwords and multi-factor authentication.", threat: "Credential stuffing reuses leaked passwords across many sites.",
    sec: [
      ["Creating strong passwords", "Use long passphrases of 14+ characters, such as four or more unrelated words. Length beats complexity."],
      ["Password managers", "A manager creates and stores a unique password per site and will not autofill on look-alike domains. You only remember one strong master passphrase."],
      ["Multi-factor authentication", "Add a second proof: an authenticator app, hardware key or passkey. Prefer these over SMS codes."],
      ["Common mistakes", "Reusing passwords, using names or birthdays, sharing codes, keeping passwords in plain notes, and ignoring breach alerts."],
    ] },
  { id: "social", t: "Social Engineering", e: "🎭", sum: "Manipulating people, not machines, to gain access.", threat: "Attackers exploit trust, authority and urgency.",
    sec: [
      ["Understanding it", "Social engineering targets human psychology. The attacker needs you to hand over access willingly."],
      ["Manipulation techniques", "Pretexting (invented scenario), false authority, urgency, reciprocity, tailgating into buildings, and baiting with free USB drives."],
      ["Realistic example", "A caller claims to be IT support and says your account is compromised. They ask for the one-time code “to secure it”. That code is how they get in."],
      ["Prevention", "Pause, verify identity using a number you already know, never share OTPs, and follow a clear process for sensitive requests."],
    ] },
  { id: "malware", t: "Malware and Ransomware", e: "🦠", sum: "Malicious software that spies, damages or locks your data.", threat: "Ransomware encrypts files and demands payment.",
    sec: [
      ["Types of malware", "Viruses, worms, trojans, spyware, keyloggers, adware and ransomware."],
      ["How infections happen", "Malicious attachments, pirated software, fake updates, infected ads and unpatched software."],
      ["Warning signs", "Sudden slowness, unknown apps, pop-ups, disabled antivirus, locked files or a ransom note."],
      ["Prevention and recovery", "Patch promptly, use reputable security software, and keep offline backups (3-2-1 rule). If infected, disconnect from the network, seek professional help and report it."],
    ] },
  { id: "privacy", t: "Data Privacy", e: "🔒", sum: "Control what you share and who can see it.", threat: "Oversharing feeds identity theft and targeted scams.",
    sec: [
      ["Protecting personal information", "Share the minimum. Avoid posting ID numbers, tickets, addresses and travel plans."],
      ["Social media privacy", "Set profiles to private, limit the audience of old posts, and review app permissions and tagging."],
      ["Browser privacy", "Block third-party cookies, review site permissions and keep your browser updated."],
      ["Data protection practices", "Encrypt devices, use screen locks, back up data and delete accounts you no longer use."],
    ] },
  { id: "browsing", t: "Safe Browsing", e: "🌐", sum: "Habits that keep your sessions safe.", threat: "Malicious ads, fake shops and look-alike sites.",
    sec: [["Habits", "HTTPS only means the connection is encrypted, not that the site is trustworthy. Download only from official stores, and keep your browser and extensions updated."]] },
  { id: "identity", t: "Identity Theft", e: "🪪", sum: "Criminals using your details to open accounts or borrow.", threat: "Stolen identity data used for loans, SIMs and accounts.",
    sec: [["Protection", "Check statements and credit reports, turn on account alerts, shred sensitive documents, and freeze or lock your credit where available."]] },
  { id: "wifi", t: "Public Wi-Fi Security", e: "📶", sum: "Stay safe on cafe, airport and hotel networks.", threat: "Fake hotspots and snooping on open networks.",
    sec: [["Protection", "Confirm the network name with staff, avoid banking on open Wi-Fi, use your mobile hotspot or a trusted VPN, and turn off auto-connect and file sharing."]] },
];

const QUIZ = [
  { q: "An email says your account closes in 1 hour unless you log in. Best action?", o: ["Click the link quickly", "Open the official app or site yourself", "Reply with your password", "Forward it to friends"], a: 1, t: "phishing", e: "Urgency is a classic phishing tactic. Go to the official site directly." },
  { q: "Which password is strongest?", o: ["Password@123", "Summer2024!", "violet-tractor-lantern-ocean", "qwerty"], a: 2, t: "passwords", e: "Long random passphrases beat short, predictable complexity." },
  { q: "A caller posing as IT support asks for the SMS code you just received. You should:", o: ["Share it to fix the issue", "Refuse and verify through an official number", "Share half of it", "Ask them to email it"], a: 1, t: "social", e: "One-time codes should never be shared with anyone." },
  { q: "Your files are locked and a note demands payment. First step?", o: ["Pay immediately", "Disconnect from the network and get help", "Restart repeatedly", "Delete backups"], a: 1, t: "malware", e: "Isolate the device to stop the spread. Paying does not guarantee recovery." },
  { q: "Which MFA method is generally the most phishing-resistant?", o: ["SMS code", "Security question", "Hardware key or passkey", "Email code"], a: 2, t: "passwords", e: "Hardware keys and passkeys are bound to the real website." },
  { q: "Does the padlock icon prove a website is safe?", o: ["Yes, always", "No, it only means the connection is encrypted", "Yes, if the site is popular", "Only on mobile"], a: 1, t: "browsing", e: "Criminals also use HTTPS on fake sites." },
];

const EMAILS = [
  { from: "support@paypa1-secure.example", subj: "Urgent: verify account within 1 hour", body: "Dear customer, we noticed unusual activity. Click verify-now.example/login or your account will be suspended.", phish: true,
    why: "Look-alike sender domain (paypa1), artificial urgency, a generic greeting and a link to an unrelated domain." },
  { from: "no-reply@university.example", subj: "Your library book is due Friday", body: "Hi Ananya, your loan of “Networks 101” is due Friday. Renew by signing in to the library portal you normally use.", phish: false,
    why: "Personalised, no pressure, no link demanding a login, and it points you to the portal you already know." },
  { from: "ceo@company-mail.example", subj: "Quick favour, confidential", body: "I'm in a meeting. Buy 5 gift cards for a client and send me the codes. I'll reimburse you.", phish: true,
    why: "Authority plus secrecy plus an unusual payment request is a classic business email compromise." },
];

const CHECK = ["Use a password manager", "Use a unique password on every account", "Turn on MFA for email and banking", "Enable automatic updates", "Back up important files offline", "Lock devices with a PIN or biometrics", "Review social media privacy settings", "Avoid banking on public Wi-Fi", "Verify links before clicking", "Know how to report phishing"];

const GLOSS = [["MFA", "Using two or more proofs of identity to sign in."], ["Phishing", "Deceptive messages designed to steal data."], ["Ransomware", "Malware that locks data for payment."], ["VPN", "An encrypted tunnel for your traffic."], ["Zero-day", "A flaw exploited before a fix exists."], ["Encryption", "Scrambling data so only authorised parties can read it."]];

const ORGS = [
  ["CISA", "US Cybersecurity and Infrastructure Security Agency: alerts and guidance.", "https://www.cisa.gov/secure-our-world"],
  ["CERT-In", "India's national cyber incident response team.", "https://www.cert-in.org.in"],
  ["NIST", "Standards and the Cybersecurity Framework.", "https://www.nist.gov/cyberframework"],
  ["OWASP", "Open community for web application security.", "https://owasp.org"],
  ["NCSC UK", "Practical advice for individuals and organisations.", "https://www.ncsc.gov.uk"],
  ["Have I Been Pwned", "Check whether your email appears in known breaches.", "https://haveibeenpwned.com"],
];

const NEWS = [
  ["Recent cyber threats and alerts", "CISA Cybersecurity Alerts and Advisories", "https://www.cisa.gov/news-events/cybersecurity-advisories"],
  ["India-specific advisories and vulnerability notes", "CERT-In Advisories", "https://www.cert-in.org.in"],
  ["Known exploited vulnerabilities", "CISA KEV Catalog", "https://www.cisa.gov/known-exploited-vulnerabilities-catalog"],
  ["Security vulnerabilities database", "NIST National Vulnerability Database", "https://nvd.nist.gov"],
  ["Emerging scams and breach guidance", "FTC Consumer Alerts", "https://consumer.ftc.gov/consumer-alerts"],
  ["Awareness campaigns", "Cybersecurity Awareness Month (October)", "https://www.cisa.gov/cybersecurity-awareness-month"],
];

/* ---------- Static renders ---------- */
$("#yr").textContent = new Date().getFullYear();

$("#stats").innerHTML = STATS.map((s) =>
  `<div class="card"><p class="big">${s.n}</p><p>${s.l}</p><a class="src" href="${s.u}" ${EXT}>${s.s}, ${s.d}</a></div>`).join("");

$("#topics").innerHTML = TOPICS.map((t) =>
  `<a class="card topic" href="#learn" data-id="${t.id}"><span class="ico" aria-hidden="true">${t.e}</span><h3>${t.t}</h3><p>${t.sum}</p></a>`).join("");

$("#threatList").innerHTML = TOPICS.map((t) =>
  `<div class="card"><h3><span aria-hidden="true">${t.e}</span> ${t.t}</h3><p>${t.threat}</p><a href="#learn" data-id="${t.id}">How to defend</a></div>`).join("");

$("#newsList").innerHTML = NEWS.map(([topic, name, url]) =>
  `<a class="card" href="${url}" ${EXT}><span class="mute">${topic}</span><h3>${name} &#8599;</h3></a>`).join("");

$("#orgs").innerHTML = ORGS.map(([n, d, u]) =>
  `<div class="card"><h3><a href="${u}" ${EXT}>${n} &#8599;</a></h3><p>${d}</p></div>`).join("");

$("#gloss").innerHTML = GLOSS.map(([k, v]) => `<dt>${k}: </dt><dd>${v}</dd>`).join("");

/* ---------- Learn ---------- */
let current = "phishing";
function renderLearn() {
  const t = TOPICS.find((x) => x.id === current);
  $("#learnNav").innerHTML = TOPICS.map((x) =>
    `<button type="button" data-id="${x.id}" aria-current="${x.id === current}">${x.t}</button>`).join("");
  $("#learnBody").innerHTML = `<h3>${t.t}</h3>` +
    t.sec.map(([h, b]) => `<div class="card"><h4>${h}</h4><p>${b}</p></div>`).join("");
}
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-id]");
  if (!el) return;
  current = el.dataset.id;
  renderLearn();
  if (el.tagName === "BUTTON") window.scrollTo({ top: 0 });
});
renderLearn();

/* ---------- Router ---------- */
const pages = [...document.querySelectorAll(".page")];
const TITLES = { home: "CyberShield | Stay Aware. Stay Secure. Stay Protected.", learn: "Learn Cybersecurity | CyberShield", threats: "Cyber Threats | CyberShield", tools: "Security Tools | CyberShield", news: "Cyber News | CyberShield", resources: "Resources | CyberShield", about: "About and Contact | CyberShield" };
function route() {
  const hash = location.hash.slice(1) || "home";
  let id = hash === "quiz" ? "tools" : hash;
  if (!pages.some((p) => p.id === id)) id = "home";
  pages.forEach((p) => (p.hidden = p.id !== id));
  document.title = TITLES[id];
  document.querySelectorAll("#nav a:not(.btn)").forEach((a) =>
    a.getAttribute("href") === "#" + id ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
  $("#nav").classList.remove("open");
  $("#menuBtn").setAttribute("aria-expanded", "false");
  if (hash === "quiz") $("#quizCard").scrollIntoView(); else window.scrollTo({ top: 0 });
}
window.addEventListener("hashchange", route);
$("#menuBtn").addEventListener("click", () => {
  const open = $("#nav").classList.toggle("open");
  $("#menuBtn").setAttribute("aria-expanded", open);
});
route();

/* ---------- Password checker (runs locally, never stored or sent) ---------- */
const COMMON = ["password", "123456", "qwerty", "letmein", "admin", "welcome", "iloveyou", "abc123"];
function analyse(pw) {
  let s = 0; const tips = [];
  if (pw.length >= 12) s += 2; else tips.push("Use at least 12 characters; 14 or more is better.");
  if (pw.length >= 16) s += 1;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s += 1; else tips.push("Mix upper and lower case letters.");
  if (/\d/.test(pw)) s += 1; else tips.push("Add numbers.");
  if (/[^A-Za-z0-9]/.test(pw)) s += 1; else tips.push("Add a symbol, or separate words in a passphrase.");
  if (COMMON.some((c) => pw.toLowerCase().includes(c))) { s -= 3; tips.push("Avoid common words like “password” or “123456”."); }
  if (/(.)\1{2,}/.test(pw)) { s -= 1; tips.push("Avoid repeated characters."); }
  s = Math.max(0, Math.min(s, 6));
  return { s, tips, label: s >= 5 ? "Strong" : s >= 3 ? "Medium" : "Weak" };
}
const pw = $("#pw");
pw.addEventListener("input", () => {
  if (!pw.value) { $("#pwBar").style.width = "0"; $("#pwLabel").textContent = ""; $("#pwTips").innerHTML = ""; return; }
  const r = analyse(pw.value);
  const color = { Strong: "var(--good)", Medium: "var(--warn)", Weak: "var(--bad)" }[r.label];
  const bar = $("#pwBar");
  bar.style.width = (r.s / 6) * 100 + "%";
  bar.style.background = color;
  $("#pwLabel").textContent = r.label;
  $("#pwLabel").style.color = color;
  $("#pwTips").innerHTML = (r.tips.length ? r.tips : ["Looks good. Store it in a password manager and enable MFA."]).map((t) => `<li>${t}</li>`).join("");
});
$("#pwShow").addEventListener("click", (e) => {
  const show = pw.type === "password";
  pw.type = show ? "text" : "password";
  e.target.textContent = show ? "Hide" : "Show";
  e.target.setAttribute("aria-pressed", show);
});

/* ---------- Phishing simulator ---------- */
(function phishSim() {
  const box = $("#phish");
  let i = 0, score = 0;
  function show() {
    if (i >= EMAILS.length) {
      box.innerHTML = `<p><strong>You got ${score} of ${EMAILS.length} right.</strong></p><button class="btn" id="pAgain" type="button">Try again</button>`;
      $("#pAgain").onclick = () => { i = 0; score = 0; show(); };
      return;
    }
    const m = EMAILS[i];
    box.innerHTML = `<div class="mail"><div><span>From:</span> ${m.from}</div><div><span>Subject:</span> ${m.subj}</div><p>${m.body}</p></div>
      <div class="actions"><button class="btn ghost" data-v="1" type="button">Phishing</button><button class="btn ghost" data-v="0" type="button">Legitimate</button></div><div id="pFb"></div>`;
    box.querySelectorAll("[data-v]").forEach((b) => b.addEventListener("click", () => {
      const ok = (b.dataset.v === "1") === m.phish;
      if (ok) score++;
      box.querySelectorAll("[data-v]").forEach((x) => (x.disabled = true));
      $("#pFb").innerHTML = `<p class="${ok ? "good" : "bad"}">${ok ? "Correct" : "Not quite"}: this is ${m.phish ? "phishing" : "legitimate"}.</p><p>${m.why}</p><button class="btn" id="pNext" type="button">Next message</button>`;
      $("#pNext").onclick = () => { i++; show(); };
    }));
  }
  show();
})();

/* ---------- Quiz ---------- */
(function quiz() {
  const box = $("#quiz");
  let i = 0, score = 0, wrong = [];
  function show() {
    if (i >= QUIZ.length) {
      const topics = [...new Set(wrong)].map((id) => TOPICS.find((t) => t.id === id).t);
      const msg = score === QUIZ.length ? "Excellent. You have strong security instincts." : score >= QUIZ.length / 2 ? "Good foundation with a few gaps." : "Keep learning. The topics below will help.";
      box.innerHTML = `<p class="big">${score} / ${QUIZ.length}</p><p>${msg}</p>${topics.length ? `<p>Review in Learn: <strong>${topics.join(", ")}</strong></p>` : ""}<button class="btn" id="qAgain" type="button">Retake quiz</button>`;
      $("#qAgain").onclick = () => { i = 0; score = 0; wrong = []; show(); };
      return;
    }
    const q = QUIZ[i];
    box.innerHTML = `<p class="mute">Question ${i + 1} of ${QUIZ.length}</p><p><strong>${q.q}</strong></p>
      <div class="opts">${q.o.map((o, k) => `<button class="opt" data-k="${k}" type="button">${o}</button>`).join("")}</div><div id="qFb"></div>`;
    box.querySelectorAll(".opt").forEach((b) => b.addEventListener("click", () => {
      const k = +b.dataset.k;
      if (k === q.a) score++; else wrong.push(q.t);
      box.querySelectorAll(".opt").forEach((x) => { x.disabled = true; if (+x.dataset.k === q.a) x.classList.add("right"); });
      if (k !== q.a) b.classList.add("wrong");
      $("#qFb").innerHTML = `<p>${q.e}</p><button class="btn" id="qNext" type="button">${i + 1 === QUIZ.length ? "See results" : "Next question"}</button>`;
      $("#qNext").onclick = () => { i++; show(); };
    }));
  }
  show();
})();

/* ---------- Checklist ---------- */
(function checklist() {
  const list = $("#ckList");
  list.innerHTML = CHECK.map((c, k) => `<li><label><input type="checkbox" data-k="${k}"><span>${c}</span></label></li>`).join("");
  list.addEventListener("change", () => {
    const n = list.querySelectorAll("input:checked").length;
    const pct = Math.round((n / CHECK.length) * 100);
    $("#ckBar").style.width = pct + "%";
    $("#ckPct").textContent = pct + "% complete";
    $("#ckTrack").setAttribute("aria-valuenow", pct);
  });
})();

/* ---------- Download checklist ---------- */
$("#dl").addEventListener("click", () => {
  const text = "CyberShield Safety Checklist\n\n" + CHECK.map((c) => "[ ] " + c).join("\n");
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
  const a = document.createElement("a");
  a.href = url; a.download = "cybershield-checklist.txt"; a.click();
  URL.revokeObjectURL(url);
});

/* ---------- Contact form validation ---------- */
$("#form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#name").value.trim(), email = $("#email").value.trim(), msg = $("#msg").value.trim();
  const eN = name.length < 2 ? "Enter your name (at least 2 characters)." : "";
  const eE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? "" : "Enter a valid email address.";
  const eM = msg.length < 10 ? "Message must be at least 10 characters." : "";
  $("#eName").textContent = eN; $("#eEmail").textContent = eE; $("#eMsg").textContent = eM;
  $("#ok").textContent = "";
  if (eN || eE || eM) return;
  // TODO: send to your backend with CSRF protection and rate limiting.
  $("#ok").textContent = "Thanks, " + name + ". Your message is valid and ready to send once a backend is connected.";
  e.target.reset();
});
