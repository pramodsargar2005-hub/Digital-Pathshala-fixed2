"use strict";

// Digital Pathshala class server
// 1. npm install
// 2. npm start
// 3. Open http://localhost:3000

const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

const ROOT = __dirname;
const WORKSPACE = path.join(ROOT, "student-workspace");
const DATA_DIR = path.join(ROOT, "data");
const TMP_DIR = path.join(ROOT, "tmp-uploads");
const PROGRESS_FILE = path.join(DATA_DIR, "progress.json");
const CONTACT_FILE = path.join(DATA_DIR, "contact.json");
const ACCOUNTS_FILE = path.join(DATA_DIR, "accounts.json");
const TEACHER_FILE = path.join(DATA_DIR, "teacher.json");
const PORT = process.env.PORT || 3000;
const ALLOWED_EXTENSIONS = new Set([
  ".txt", ".pdf", ".png", ".jpg", ".jpeg", ".doc", ".docx", ".ppt", ".pptx"
]);
const ACTIVITIES = new Set(["quiz", "detective", "file-lab"]);

function pack(en, hi, mr) {
  return { en: en, hi: hi, mr: mr };
}

const CASES = [
  {
    id: "prize-otp",
    from: pack("Unknown number", "अनजान नंबर", "अनोळखी नंबर"),
    text: pack(
      "Congratulations! You won ₹50,000. Send your OTP now to claim the prize.",
      "बधाई हो! आपने ₹50,000 जीते हैं। इनाम पाने के लिए अभी अपना OTP भेजें।",
      "अभिनंदन! तुम्ही ₹50,000 जिंकले आहे. बक्षीस मिळवण्यासाठी आत्ता OTP पाठवा."
    ),
    real: false,
    why: pack(
      "You did not enter a contest. A real prize never asks for your OTP.",
      "आपने कोई प्रतियोगिता नहीं भरी। असली इनाम OTP नहीं माँगता।",
      "तुम्ही कोणतीही स्पर्धा भरली नव्हती. खरे बक्षीस OTP मागत नाही."
    )
  },
  {
    id: "lab-time",
    from: pack("Class teacher", "कक्षा शिक्षक", "वर्ग शिक्षक"),
    text: pack(
      "Dear students, the computer lab is open on Friday from 10 am to 12 pm. Bring your notebook. — Government School",
      "प्रिय विद्यार्थियों, कंप्यूटर लैब शुक्रवार को सुबह 10 से 12 बजे तक खुली है। अपनी कॉपी लाइए। — सरकारी स्कूल",
      "प्रिय विद्यार्थ्यांनो, संगणक प्रयोगशाळा शुक्रवारी सकाळी 10 ते 12 वाजेपर्यंत उघडी आहे. वही आणा. — शासकीय शाळा"
    ),
    real: true,
    why: pack(
      "It tells the class time and what to bring. It does not ask for money, a password, or a link.",
      "यह कक्षा का समय और क्या लाना है बताता है। यह पैसे, पासवर्ड या लिंक नहीं माँगता।",
      "हा वर्गाची वेळ आणि काय आणायचे ते सांगतो. तो पैसे, पासवर्ड किंवा लिंक मागत नाही."
    )
  },
  {
    id: "bank-scare",
    from: pack("Unknown number", "अनजान नंबर", "अनोळखी नंबर"),
    text: pack(
      "Your bank account will be blocked today. Share your password and Aadhaar number immediately.",
      "आपका बैंक खाता आज बंद हो जाएगा। तुरंत अपना पासवर्ड और आधार नंबर भेजें।",
      "तुमचे बँक खाते आज बंद होईल. लगेच पासवर्ड आणि आधार क्रमांक पाठवा."
    ),
    real: false,
    why: pack(
      "Banks do not ask for your password or Aadhaar in a message. The scary hurry is a trick.",
      "बैंक संदेश में पासवर्ड या आधार नहीं माँगते। डराने वाली जल्दी एक धोखा है।",
      "बँका संदेशात पासवर्ड किंवा आधार मागत नाहीत. भीतीची घाई ही फसवणूक आहे."
    )
  },
  {
    id: "notebook",
    from: pack("Priya Ma'am", "प्रिया मैडम", "प्रिया मॅडम"),
    text: pack(
      "Please bring your notebook for the keyboard practice class tomorrow. — Priya Ma'am",
      "कृपया कल कीबोर्ड अभ्यास के लिए अपनी कॉपी लाइए। — प्रिया मैडम",
      "उद्या कीबोर्ड सरावासाठी वही आणा. — प्रिया मॅडम"
    ),
    real: true,
    why: pack(
      "A teacher is reminding you about class. There is no link and no request for secrets.",
      "शिक्षक कक्षा की याद दिला रहे हैं। न लिंक है, न कोई रहस्य माँगा गया है।",
      "शिक्षक वर्गाची आठवण करून देत आहेत. लिंक नाही आणि गुपित मागितले नाही."
    )
  },
  {
    id: "free-laptop",
    from: pack("Unknown number", "अनजान नंबर", "अनोळखी नंबर"),
    text: pack(
      "Click this link bit.ly/free-laptop to get a free laptop for students. Hurry, only today!",
      "छात्रों के लिए मुफ्त लैपटॉप पाने के लिए इस लिंक पर क्लिक करें bit.ly/free-laptop। जल्दी करें, सिर्फ आज!",
      "विद्यार्थ्यांसाठी मोफत लॅपटॉप मिळवण्यासाठी ही लिंक उघडा bit.ly/free-laptop. लवकर करा, फक्त आज!"
    ),
    real: false,
    why: pack(
      "Free gifts plus a strange short link are a common trick. Do not tap the link.",
      "मुफ्त उपहार और अजीब छोटी लिंक एक आम धोखा है। लिंक न खोलें।",
      "मोफत भेट आणि विचित्र छोटी लिंक ही नेहमीची फसवणूक आहे. लिंक उघडू नका."
    )
  },
  {
    id: "homework",
    from: pack("Class teacher", "कक्षा शिक्षक", "वर्ग शिक्षक"),
    text: pack(
      "Homework: write the names of 4 computer parts and show the page in class on Monday.",
      "होमवर्क: कंप्यूटर के 4 भागों के नाम लिखो और सोमवार को कक्षा में दिखाओ।",
      "गृहपाठ: संगणकाच्या 4 भागांची नावे लिहा आणि सोमवारी वर्गात दाखवा."
    ),
    real: true,
    why: pack(
      "This is school work. It asks you to learn and show the teacher, not to send money or a password.",
      "यह स्कूल का काम है। यह सीखने और शिक्षक को दिखाने को कहता है, पैसे या पासवर्ड भेजने को नहीं।",
      "हा शाळेचा अभ्यास आहे. तो शिकायला आणि शिक्षकाला दाखवायला सांगतो, पैसे किंवा पासवर्ड पाठवायला नाही."
    )
  },
  {
    id: "exam-money",
    from: pack("Unknown number", "अनजान नंबर", "अनोळखी नंबर"),
    text: pack(
      "I am your teacher. Send ₹500 on PhonePe to this number or your name will be removed from the exam. Do not tell your parents.",
      "मैं तुम्हारी टीचर हूँ। इस नंबर पर PhonePe से ₹500 भेजो, नहीं तो तुम्हारा नाम परीक्षा से हटा दिया जाएगा। माता-पिता को मत बताना।",
      "मी तुमची शिक्षिका आहे. या नंबरवर PhonePe ने ₹500 पाठवा, नाहीतर तुमचे नाव परीक्षेतून काढले जाईल. पालकांना सांगू नका."
    ),
    real: false,
    why: pack(
      "A real teacher does not demand money on PhonePe or tell you to hide it from your parents.",
      "असली शिक्षक PhonePe पर पैसे नहीं माँगते और माता-पिता से छुपाने को नहीं कहते।",
      "खरे शिक्षक PhonePe वर पैसे मागत नाहीत आणि पालकांपासून लपवायला सांगत नाहीत."
    )
  },
  {
    id: "kyc-pin",
    from: pack("Unknown number", "अनजान नंबर", "अनोळखी नंबर"),
    text: pack(
      "KYC expired. Your SIM will stop in 1 hour. Enter your PIN here: http://kyc-update-now.com",
      "KYC खत्म हो गया। आपका सिम 1 घंटे में बंद हो जाएगा। अपना पिन यहाँ डालें: http://kyc-update-now.com",
      "KYC संपले आहे. तुमचे सिम 1 तासात बंद होईल. पिन येथे टाका: http://kyc-update-now.com"
    ),
    real: false,
    why: pack(
      "It uses fear, a web link, and your PIN. Phone companies do not collect a PIN this way.",
      "यह डर, वेब लिंक और पिन इस्तेमाल करता है। फोन कंपनी इस तरह पिन नहीं लेती।",
      "हा भीती, वेब लिंक आणि पिन वापरतो. फोन कंपनी अशी पिन घेत नाही."
    )
  }
];

const VERDICTS = {
  fake: pack("This looks like a fake message", "यह संदेश नकली लग रहा है", "हा संदेश खोटा वाटतो आहे"),
  suspicious: pack("Be careful with this message", "इस संदेश से सावधान रहें", "या संदेशाबाबत सावध राहा"),
  "likely-real": pack("This looks like a normal message", "यह सामान्य संदेश लग रहा है", "हा सामान्य संदेश वाटतो आहे")
};

const TIPS = {
  fake: pack(
    "Do not reply. Do not share an OTP, password, or money. Show the message to a teacher or parent.",
    "जवाब न दें। OTP, पासवर्ड या पैसे न भेजें। संदेश शिक्षक या माता-पिता को दिखाएँ।",
    "उत्तर देऊ नका. OTP, पासवर्ड किंवा पैसे पाठवू नका. संदेश शिक्षक किंवा पालकांना दाखवा."
  ),
  suspicious: pack(
    "Pause before you tap or answer. If you are not sure, ask a teacher.",
    "दबाने या जवाब देने से पहले रुकें। शक हो तो शिक्षक से पूछें।",
    "दाबण्यापूर्वी किंवा उत्तर देण्यापूर्वी थांबा. शंका असल्यास शिक्षकाला विचारा."
  ),
  "likely-real": pack(
    "It does not show the usual tricks. If something still feels odd, ask a teacher.",
    "इसमें आम धोखे नहीं दिखे। फिर भी कुछ अजीब लगे तो शिक्षक से पूछें।",
    "यात नेहमीच्या फसवणुकी दिसल्या नाहीत. तरी काही विचित्र वाटले तर शिक्षकाला विचारा."
  )
};

const REMINDER = pack(
  "This class helper looks for common tricks. It can miss some. When you are unsure, ask a teacher.",
  "यह कक्षा सहायक आम धोखे देखता है। कुछ छूट सकते हैं। शक हो तो शिक्षक से पूछें।",
  "हा वर्ग मदतनीस नेहमीच्या फसवणुकी पाहतो. काही सुटू शकतात. शंका असल्यास शिक्षकाला विचारा."
);

function ensureDirs() {
  [WORKSPACE, DATA_DIR, TMP_DIR].forEach(function (dir) {
    fs.mkdirSync(dir, { recursive: true });
  });

  const starter = path.join(WORKSPACE, "Class Work");
  if (!fs.existsSync(starter)) {
    fs.mkdirSync(starter, { recursive: true });
    fs.writeFileSync(
      path.join(starter, "welcome.txt"),
      "Welcome to the class folder.\r\nCreate your own folder and send your homework here.\r\n",
      "utf8"
    );
  }
}

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    return fallback;
  }
}

function writeJson(file, data) {
  const temporary = file + ".tmp";
  fs.writeFileSync(temporary, JSON.stringify(data, null, 2));
  fs.renameSync(temporary, file);
}

function cleanPersonName(input) {
  const name = String(input || "")
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}\s.'-]/gu, "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 40);

  if (name.length < 2) {
    return "";
  }

  return name;
}

const sessions = new Map();
const loginTries = new Map();

function hashSecret(secret, salt) {
  return crypto.scryptSync(String(secret), salt, 32).toString("hex");
}

function secretsMatch(secret, salt, hash) {
  let next;
  let prev;

  try {
    next = Buffer.from(hashSecret(secret, salt), "hex");
    prev = Buffer.from(String(hash || ""), "hex");
  } catch (error) {
    return false;
  }

  if (next.length !== prev.length) {
    return false;
  }

  return crypto.timingSafeEqual(next, prev);
}

function validPin(pin) {
  return /^\d{4}$/.test(String(pin || ""));
}

function cleanClassName(input) {
  return String(input || "")
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 40);
}

function readCookie(req) {
  const header = String(req.headers.cookie || "");
  const parts = header.split(";");

  for (let i = 0; i < parts.length; i += 1) {
    const bit = parts[i].trim();
    if (bit.indexOf("pathshala=") === 0) {
      return bit.slice("pathshala=".length);
    }
  }

  return "";
}

function currentSession(req) {
  const token = readCookie(req);
  if (!token) {
    return null;
  }
  return sessions.get(token) || null;
}

function startSession(req, res, record) {
  const previous = readCookie(req);
  if (previous) {
    sessions.delete(previous);
  }
  const token = crypto.randomBytes(24).toString("hex");
  sessions.set(token, record);
  res.setHeader(
    "Set-Cookie",
    "pathshala=" + token + "; HttpOnly; SameSite=Lax; Path=/; Max-Age=28800"
  );
}

function clearSession(req, res) {
  const token = readCookie(req);
  if (token) {
    sessions.delete(token);
  }
  res.setHeader("Set-Cookie", "pathshala=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0");
}

function tooManyTries(key) {
  const now = Date.now();
  const entry = loginTries.get(key) || { count: 0, at: now };

  if (now - entry.at > 10 * 60 * 1000) {
    loginTries.set(key, { count: 1, at: now });
    return false;
  }

  entry.count += 1;
  loginTries.set(key, entry);
  return entry.count > 8;
}

function ensureTeacher() {
  if (fs.existsSync(TEACHER_FILE)) {
    return;
  }

  const pin = String(crypto.randomInt(1000, 10000));
  const salt = crypto.randomBytes(16).toString("hex");
  writeJson(TEACHER_FILE, { salt: salt, hash: hashSecret(pin, salt) });
  console.log("Teacher sign-in PIN (write this in your notebook): " + pin);
}

function readAccounts() {
  return readJson(ACCOUNTS_FILE, { students: {} });
}

function safeFolder(input) {
  let name = String(input || "").normalize("NFKC");

  if (/[\\/]|(\.\.)/.test(name)) {
    return "";
  }

  name = name.replace(/[\\/:*?"<>|]/g, "");
  name = name.replace(/[^\p{L}\p{N}\s\-_]/gu, "");
  name = name.trim().replace(/\s+/g, " ").slice(0, 40);

  if (!name || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(name)) {
    return "";
  }

  return name;
}

function safeFile(input) {
  const name = path.basename(String(input || ""));

  if (!name || name.startsWith(".") || name.indexOf("..") !== -1) {
    return "";
  }

  return name;
}

function insideWorkspace(target) {
  const root = path.resolve(WORKSPACE);
  const resolved = path.resolve(target);
  return resolved === root || resolved.indexOf(root + path.sep) === 0;
}

function listFolders() {
  return fs
    .readdirSync(WORKSPACE, { withFileTypes: true })
    .filter(function (entry) {
      return entry.isDirectory() && !entry.name.startsWith(".");
    })
    .map(function (entry) {
      return entry.name;
    })
    .sort(function (a, b) {
      return a.localeCompare(b);
    });
}

function notesPath(folder) {
  return path.join(WORKSPACE, folder, ".notes.json");
}

function readNotes(folder) {
  const file = notesPath(folder);
  if (!insideWorkspace(file)) {
    return {};
  }
  return readJson(file, {});
}

function listFiles(folder) {
  const dir = path.join(WORKSPACE, folder);

  if (!insideWorkspace(dir) || !fs.existsSync(dir)) {
    return [];
  }

  const notes = readNotes(folder);

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter(function (entry) {
      return entry.isFile() && !entry.name.startsWith(".");
    })
    .map(function (entry) {
      const stat = fs.statSync(path.join(dir, entry.name));
      const meta = notes[entry.name] || {};
      return {
        name: entry.name,
        size: stat.size,
        at: stat.mtime.toISOString(),
        note: meta.note || "",
        student: meta.student || ""
      };
    })
    .sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
}

function saveScore(name, activity, score, total, detail) {
  const clean = cleanPersonName(name);
  if (!clean || !ACTIVITIES.has(activity)) {
    return null;
  }

  const db = readJson(PROGRESS_FILE, { students: {} });
  const key = clean.toLowerCase();

  if (!db.students[key]) {
    db.students[key] = { name: clean, activities: {} };
  }

  db.students[key].name = clean;
  db.students[key].activities[activity] = {
    score: score,
    total: total,
    detail: detail || "",
    at: new Date().toISOString()
  };

  writeJson(PROGRESS_FILE, db);
  return db.students[key];
}

function asksForSecret(text) {
  const teachesSafety = /\b(never|do not|don't|dont)\b.{0,50}(password|otp|pin|aadhaar|aadhar)/i.test(text);
  const asks = /\botp\b|one[ -]?time password|ओटीपी|पासवर्ड|आधार/i.test(text) ||
    /(send|share|enter|give|tell|type|भेज|पाठव|सांग|टाक).{0,40}(password|pin\b|cvv|aadhaar|aadhar|bank account|atm|पिन)/i.test(text);

  if (teachesSafety && !/\botp\b/i.test(text)) {
    return false;
  }

  return asks;
}

function scanMessage(message) {
  let text = String(message || "").replace(/\s+/g, " ").trim();

  if (text.length < 8) {
    return {
      ok: false,
      message: pack(
        "Paste a full message so the class can look at it together.",
        "पूरा संदेश चिपकाएँ ताकि कक्षा मिलकर उसे देख सके।",
        "पूर्ण संदेश चिकटवा म्हणजे वर्ग मिळून तो पाहू शकेल."
      )
    };
  }

  if (text.length > 1000) {
    text = text.slice(0, 1000);
  }

  const found = [];

  if (asksForSecret(text)) {
    found.push({
      weight: 2,
      text: pack(
      "It asks for an OTP, password, PIN, or ID number. Real schools and banks do not ask for those in a message.",
      "यह OTP, पासवर्ड, पिन या पहचान संख्या माँगता है। असली स्कूल और बैंक संदेश में ये नहीं माँगते।",
      "हा OTP, पासवर्ड, पिन किंवा ओळख क्रमांक मागतो आहे. खऱ्या शाळा आणि बँका संदेशात हे मागत नाहीत."
    )
    });
  }

  if (/(you (have )?won|lottery|free laptop|gift card|congratulations.{0,40}(won|prize|lakh|cash)|बधाई|इनाम|लॉटरी|अभिनंदन|बक्षीस|जिंकले)/i.test(text)) {
    found.push({
      weight: 2,
      text: pack(
        "It offers a prize or free gift you did not ask for. That is a common trick.",
        "यह ऐसा इनाम या मुफ्त उपहार देता है जिसके लिए आपने नाम नहीं लिखा। यह आम धोखा है।",
        "हे बक्षीस किंवा मोफत भेट देते आहे ज्यासाठी तुम्ही नाव दिले नव्हते. ही नेहमीची फसवणूक आहे."
      )
    });
  }

  if (/(https?:\/\/|bit\.ly|tinyurl|wa\.me|t\.me)/i.test(text)) {
    found.push({
      weight: 2,
      text: pack(
      "It pushes you to open a link. Do not tap links from people you do not know.",
      "यह लिंक खोलने को कहता है। अनजान लोगों की लिंक न खोलें।",
      "हा लिंक उघडायला सांगतो. अनोळखी लोकांच्या लिंक उघडू नका."
    )
    });
  }

  if (/(phonepe|paytm|gpay|google pay|send ₹|send rs|send money|upi|पैसे भेज|पैसे पाठव|फोनपे)/i.test(text)) {
    found.push({
      weight: 2,
      text: pack(
        "It asks you to send money. Stop and show it to a trusted adult.",
        "यह पैसे भेजने को कहता है। रुकें और भरोसेमंद बड़े को दिखाएँ।",
        "हा पैसे पाठवायला सांगतो. थांबा आणि विश्वासू मोठ्यांना दाखवा."
      )
    });
  }

  if (/\bkyc\b|केवाईसी|sim (will|card).{0,30}(block|stop)|account (will be )?(blocked|suspended)|सिम.{0,20}बंद/i.test(text)) {
    found.push({
      weight: 2,
      text: pack(
        "It tries to scare you about a blocked SIM, KYC, or bank account.",
        "यह बंद सिम, केवाईसी या बैंक खाते का डर दिखाता है।",
        "हा बंद सिम, केवायसी किंवा बँक खात्याची भीती दाखवतो."
      )
    });
  }

  if (/(do not|don't|dont).{0,40}(tell|show).{0,25}(parent|teacher|family)|keep (this|it) (a )?secret|माता-पिता को मत बता|पालकांना सांगू नका|गुप्त रख/i.test(text)) {
    found.push({
      weight: 2,
      text: pack(
        "It tells you to hide the message from your parents or teacher. A real teacher will not do that.",
        "यह संदेश माता-पिता या शिक्षक से छुपाने को कहता है। असली शिक्षक ऐसा नहीं कहते।",
        "हा संदेश पालक किंवा शिक्षक यांच्यापासून लपवायला सांगतो. खरे शिक्षक तसे सांगत नाहीत."
      )
    });
  }

  const urgent = /(urgent|immediately|hurry|act now|last chance|within \d+ (hour|minute)|in \d+ hour)/i.test(text);
  if (urgent && found.length > 0) {
    found.push({
      weight: 1,
      text: pack(
      "It tells you to hurry so you do not have time to think.",
      "यह जल्दी करने को कहता है ताकि सोचने का समय न मिले।",
      "हा घाई करायला सांगतो म्हणजे विचारायला वेळ मिळू नये."
    )
    });
  }

  const weight = found.reduce(function (sum, item) {
    return sum + item.weight;
  }, 0);

  let verdict = "likely-real";
  if (weight >= 2) {
    verdict = "fake";
  } else if (weight === 1) {
    verdict = "suspicious";
  }

  return {
    ok: true,
    verdict: verdict,
    title: VERDICTS[verdict],
    reasons: found.map(function (item) {
      return item.text;
    }),
    tip: TIPS[verdict],
    reminder: REMINDER
  };
}

ensureDirs();
ensureTeacher();

const app = express();
const upload = multer({
  dest: TMP_DIR,
  limits: { fileSize: 5 * 1024 * 1024 }
});

app.use(express.json({ limit: "80kb" }));

app.get("/api/health", function (req, res) {
  res.json({ ok: true, name: "Digital Pathshala" });
});

app.get("/api/folders", function (req, res) {
  res.json({ ok: true, folders: listFolders() });
});

app.post("/api/folders", function (req, res) {
  const name = safeFolder(req.body && req.body.name);

  if (!name) {
    return res.status(400).json({
      ok: false,
      message: pack(
        "Type a folder name with letters and numbers. Example: My Homework",
        "अक्षरों और अंकों से फ़ोल्डर का नाम लिखें। उदाहरण: My Homework",
        "अक्षरे आणि अंकांनी फोल्डरचे नाव लिहा. उदाहरण: My Homework"
      )
    });
  }

  const dir = path.join(WORKSPACE, name);

  if (!insideWorkspace(dir)) {
    return res.status(400).json({
      ok: false,
      message: pack(
        "Please choose a simpler folder name.",
        "कृपया सरल फ़ोल्डर नाम चुनें।",
        "कृपया सोपे फोल्डर नाव निवडा."
      )
    });
  }

  if (fs.existsSync(dir)) {
    return res.status(400).json({
      ok: false,
      message: pack(
        "A folder with that name is already here. Try a new name.",
        "इस नाम का फ़ोल्डर पहले से है। नया नाम लिखें।",
        "या नावाचे फोल्डर आधीच आहे. नवीन नाव लिहा."
      )
    });
  }

  fs.mkdirSync(dir);
  res.json({
    ok: true,
    message: pack(
      "Folder created. Now you can send a file into it.",
      "फ़ोल्डर बन गया। अब उसमें फ़ाइल भेज सकते हैं।",
      "फोल्डर तयार झाले. आता त्यात फाइल पाठवू शकता."
    ),
    folders: listFolders()
  });
});

app.delete("/api/folders", function (req, res) {
  const name = safeFolder(req.body && req.body.name);
  const dir = path.join(WORKSPACE, name);

  if (!name || !insideWorkspace(dir) || dir === path.resolve(WORKSPACE) || !fs.existsSync(dir)) {
    return res.status(400).json({
      ok: false,
      message: pack(
        "That folder could not be removed.",
        "वह फ़ोल्डर हटाया नहीं जा सका।",
        "ते फोल्डर काढता आले नाही."
      )
    });
  }

  fs.rmSync(dir, { recursive: true, force: true });
  res.json({
    ok: true,
    message: pack(
      "Folder removed from the class computer.",
      "फ़ोल्डर कक्षा के कंप्यूटर से हटा दिया गया।",
      "फोल्डर वर्गाच्या संगणकातून काढले."
    ),
    folders: listFolders()
  });
});

app.get("/api/files", function (req, res) {
  const folder = safeFolder(req.query.folder);
  const dir = path.join(WORKSPACE, folder);

  if (!folder || !insideWorkspace(dir) || !fs.existsSync(dir)) {
    return res.status(404).json({
      ok: false,
      message: pack(
        "Choose a folder first.",
        "पहले फ़ोल्डर चुनें।",
        "आधी फोल्डर निवडा."
      )
    });
  }

  res.json({ ok: true, folder: folder, files: listFiles(folder) });
});

app.get("/api/files/download", function (req, res) {
  const folder = safeFolder(req.query.folder);
  const file = safeFile(req.query.file);
  const full = path.join(WORKSPACE, folder, file);

  if (!folder || !file || !insideWorkspace(full) || !fs.existsSync(full) || !fs.statSync(full).isFile()) {
    return res.status(404).json({
      ok: false,
      message: pack(
        "That file is not in the class folder.",
        "वह फ़ाइल कक्षा के फ़ोल्डर में नहीं है।",
        "ती फाइल वर्गाच्या फोल्डरमध्ये नाही."
      )
    });
  }

  res.download(full);
});

function removeTempFile(file) {
  if (file && file.path && fs.existsSync(file.path)) {
    fs.unlinkSync(file.path);
  }
}

app.post("/api/files", function (req, res) {
  upload.single("file")(req, res, function (error) {
    if (error) {
      const tooBig = error.code === "LIMIT_FILE_SIZE";
      return res.status(400).json({
        ok: false,
        message: tooBig
          ? pack(
            "That file is too big. Please send a file smaller than 5 MB.",
            "यह फ़ाइल बहुत बड़ी है। 5 MB से छोटी फ़ाइल भेजें।",
            "ही फाइल खूप मोठी आहे. 5 MB पेक्षा लहान फाइल पाठवा."
          )
          : pack(
            "Could not send that file. Please try a document or a picture.",
            "वह फ़ाइल नहीं भेजी जा सकी। दस्तावेज़ या चित्र आज़माएँ।",
            "ती फाइल पाठवता आली नाही. दस्तऐवज किंवा चित्र वापरून पाहा."
          )
      });
    }

    if (!req.file) {
      return res.status(400).json({
        ok: false,
        message: pack(
          "Please choose a file to send.",
          "कृपया भेजने के लिए फ़ाइल चुनें।",
          "कृपया पाठवण्यासाठी फाइल निवडा."
        )
      });
    }

    const folder = safeFolder(req.body.folder);
    const dir = path.join(WORKSPACE, folder);

    if (!folder || !insideWorkspace(dir) || !fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
      removeTempFile(req.file);
      return res.status(400).json({
        ok: false,
        message: pack(
          "Please create or choose a folder first.",
          "पहले फ़ोल्डर बनाएँ या चुनें।",
          "आधी फोल्डर तयार करा किंवा निवडा."
        )
      });
    }

    const extension = path.extname(req.file.originalname || "").toLowerCase();

    if (!ALLOWED_EXTENSIONS.has(extension)) {
      removeTempFile(req.file);
      return res.status(400).json({
        ok: false,
        message: pack(
          "Please send a txt, pdf, png, jpg, doc, or ppt file.",
          "कृपया txt, pdf, png, jpg, doc या ppt फ़ाइल भेजें।",
          "कृपया txt, pdf, png, jpg, doc किंवा ppt फाइल पाठवा."
        )
      });
    }

    let base = path.basename(req.file.originalname, extension);
    base = base.replace(/[\\/:*?"<>|]/g, "").trim().slice(0, 40) || "homework";

    let stored = base + extension;
    let copy = 1;

    while (fs.existsSync(path.join(dir, stored))) {
      stored = base + "-" + copy + extension;
      copy += 1;
    }

    const destination = path.join(dir, stored);

    if (!insideWorkspace(destination)) {
      removeTempFile(req.file);
      return res.status(400).json({
        ok: false,
        message: pack(
          "Could not save that file.",
          "वह फ़ाइल सहेजी नहीं जा सकी।",
          "ती फाइल जतन करता आली नाही."
        )
      });
    }

    fs.copyFileSync(req.file.path, destination);
    removeTempFile(req.file);

    const note = String(req.body.note || "").replace(/\s+/g, " ").trim().slice(0, 140);
    const student = cleanPersonName(req.body.studentName);
    const notes = readNotes(folder);
    notes[stored] = {
      note: note,
      student: student,
      at: new Date().toISOString()
    };
    writeJson(notesPath(folder), notes);

    if (student) {
      saveScore(student, "file-lab", 1, 1, "Sent a file");
    }

    res.json({
      ok: true,
      message: pack(
        "Your file is now inside the folder “" + folder + "”.",
        "आपकी फ़ाइल अब “" + folder + "” फ़ोल्डर में है।",
        "तुमची फाइल आता “" + folder + "” फोल्डरमध्ये आहे."
      ),
      file: stored,
      files: listFiles(folder)
    });
  });
});

app.delete("/api/files", function (req, res) {
  const folder = safeFolder(req.body && req.body.folder);
  const file = safeFile(req.body && req.body.file);
  const full = path.join(WORKSPACE, folder, file);

  if (!folder || !file || !insideWorkspace(full) || !fs.existsSync(full) || !fs.statSync(full).isFile()) {
    return res.status(400).json({
      ok: false,
      message: pack(
        "That file could not be removed.",
        "वह फ़ाइल हटाई नहीं जा सकी।",
        "ती फाइल काढता आली नाही."
      )
    });
  }

  fs.unlinkSync(full);
  const notes = readNotes(folder);
  delete notes[file];
  writeJson(notesPath(folder), notes);

  res.json({
    ok: true,
    message: pack(
      "File removed.",
      "फ़ाइल हटा दी गई।",
      "फाइल काढली."
    ),
    files: listFiles(folder)
  });
});

app.get("/api/detective", function (req, res) {
  res.json({
    ok: true,
    messages: CASES.map(function (item) {
      return {
        id: item.id,
        from: item.from,
        text: item.text
      };
    })
  });
});

app.post("/api/detective/check", function (req, res) {
  const found = CASES.find(function (item) {
    return item.id === (req.body && req.body.id);
  });

  if (!found) {
    return res.status(404).json({
      ok: false,
      message: pack(
        "That practice message was not found.",
        "वह अभ्यास संदेश नहीं मिला।",
        "तो सराव संदेश सापडला नाही."
      )
    });
  }

  const choice = req.body.choice === "real" ? "real" : "fake";
  const answer = found.real ? "real" : "fake";

  res.json({
    ok: true,
    correct: choice === answer,
    answer: answer,
    why: found.why
  });
});

app.post("/api/detective/finish", function (req, res) {
  const answers = Array.isArray(req.body && req.body.answers) ? req.body.answers : [];
  let score = 0;

  const review = CASES.map(function (item) {
    const given = answers.find(function (answer) {
      return answer && answer.id === item.id;
    });
    const choice = given && given.choice === "real" ? "real" : "fake";
    const answer = item.real ? "real" : "fake";
    const correct = Boolean(given) && choice === answer;

    if (correct) {
      score += 1;
    }

    return {
      id: item.id,
      correct: correct,
      answered: Boolean(given),
      answer: answer,
      why: item.why
    };
  });

  const student = saveScore(
    req.body && req.body.name,
    "detective",
    score,
    CASES.length,
    "Spotted fake messages"
  );

  res.json({
    ok: true,
    score: score,
    total: CASES.length,
    review: review,
    saved: Boolean(student)
  });
});

app.post("/api/detective/scan", function (req, res) {
  const result = scanMessage(req.body && req.body.message);

  if (!result.ok) {
    return res.status(400).json(result);
  }

  res.json(result);
});

app.get("/api/progress", function (req, res) {
  const name = cleanPersonName(req.query.name);

  if (!name) {
    return res.status(400).json({
      ok: false,
      message: pack(
        "Type your name first. Use at least 2 letters.",
        "पहले अपना नाम लिखें। कम से कम 2 अक्षर लिखें।",
        "आधी तुमचे नाव लिहा. किमान 2 अक्षरे लिहा."
      )
    });
  }

  const db = readJson(PROGRESS_FILE, { students: {} });
  const student = db.students[name.toLowerCase()] || null;

  res.json({ ok: true, student: student });
});

app.post("/api/progress", function (req, res) {
  const name = cleanPersonName(req.body && req.body.name);
  const activity = req.body && req.body.activity;
  let total = Number(req.body && req.body.total);
  let score = Number(req.body && req.body.score);

  if (!name) {
    return res.status(400).json({
      ok: false,
      message: pack(
        "Save your name on the home page first.",
        "पहले मुख्य पृष्ठ पर अपना नाम सहेजें।",
        "आधी मुख्य पानावर तुमचे नाव जतन करा."
      )
    });
  }

  if (!ACTIVITIES.has(activity)) {
    return res.status(400).json({
      ok: false,
      message: pack(
        "That activity is not part of this class.",
        "वह गतिविधि इस कक्षा का हिस्सा नहीं है।",
        "ती कृती या वर्गाचा भाग नाही."
      )
    });
  }

  if (!Number.isFinite(total) || total < 0 || total > 50) {
    return res.status(400).json({
      ok: false,
      message: pack(
        "The score could not be saved.",
        "अंक सहेजे नहीं जा सके।",
        "गुण जतन करता आले नाहीत."
      )
    });
  }

  if (!Number.isFinite(score) || score < 0) {
    score = 0;
  }

  if (score > total) {
    score = total;
  }

  const student = saveScore(name, activity, score, total, req.body.detail || "");
  res.json({ ok: true, student: student });
});

app.post("/api/contact", function (req, res) {
  const name = cleanPersonName(req.body && req.body.name);
  const className = String((req.body && req.body.className) || "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .slice(0, 40);
  const message = String((req.body && req.body.message) || "").trim().slice(0, 500);

  if (!name || message.length < 5) {
    return res.status(400).json({
      ok: false,
      message: pack(
        "Please write your name and a short message for the teacher.",
        "कृपया अपना नाम और शिक्षक के लिए छोटा संदेश लिखें।",
        "कृपया तुमचे नाव आणि शिक्षकांसाठी छोटा संदेश लिहा."
      )
    });
  }

  const book = readJson(CONTACT_FILE, { notes: [] });
  book.notes.push({
    name: name,
    className: className,
    message: message,
    at: new Date().toISOString()
  });
  writeJson(CONTACT_FILE, book);

  res.json({
    ok: true,
    message: pack(
      "Your note is saved on this class computer. Thank you, " + name + ".",
      "आपका नोट इस कक्षा के कंप्यूटर पर सहेज लिया गया। धन्यवाद, " + name + "।",
      "तुमची नोंद या वर्गाच्या संगणकावर जतन झाली. धन्यवाद, " + name + "."
    )
  });
});

app.post("/api/register", function (req, res) {
  const name = cleanPersonName(req.body && req.body.name);
  const className = cleanClassName(req.body && req.body.className);
  const pin = String((req.body && req.body.pin) || "");
  const pinAgain = String((req.body && req.body.pinAgain) || "");

  if (!name) {
    return res.status(400).json({
      ok: false,
      message: pack(
        "Type your name with at least 2 letters.",
        "कम से कम 2 अक्षरों का नाम लिखें।",
        "किमान 2 अक्षरांचे नाव लिहा."
      )
    });
  }

  if (!className) {
    return res.status(400).json({
      ok: false,
      message: pack(
        "Type your class. Example: Class 6",
        "अपनी कक्षा लिखें। उदाहरण: कक्षा 6",
        "तुमची इयत्ता लिहा. उदाहरण: इयत्ता 6"
      )
    });
  }

  if (!validPin(pin)) {
    return res.status(400).json({
      ok: false,
      message: pack(
        "Choose a PIN with 4 numbers. Example: 1234",
        "4 अंकों का पिन चुनें। उदाहरण: 1234",
        "4 अंकांचा पिन निवडा. उदाहरण: 1234"
      )
    });
  }

  if (pin !== pinAgain) {
    return res.status(400).json({
      ok: false,
      message: pack(
        "The two PINs do not match. Type them again.",
        "दोनों पिन एक जैसे नहीं हैं। फिर लिखें।",
        "दोन्ही पिन सारखे नाहीत. पुन्हा लिहा."
      )
    });
  }

  const accounts = readAccounts();
  const key = name.toLowerCase();

  if (accounts.students[key]) {
    return res.status(400).json({
      ok: false,
      message: pack(
        "That name is already registered. Log in, or ask the teacher to reset the PIN.",
        "यह नाम पहले से दर्ज है। लॉग इन करें, या शिक्षक से पिन बदलवाएँ।",
        "हे नाव आधीच नोंदले आहे. लॉग इन करा, किंवा शिक्षकाला पिन बदलायला सांगा."
      )
    });
  }

  const salt = crypto.randomBytes(16).toString("hex");
  accounts.students[key] = {
    name: name,
    className: className,
    salt: salt,
    hash: hashSecret(pin, salt),
    at: new Date().toISOString()
  };
  writeJson(ACCOUNTS_FILE, accounts);
  startSession(req, res, { role: "student", name: name, className: className });

  res.json({
    ok: true,
    user: { role: "student", name: name, className: className },
    message: pack(
      "Welcome, " + name + ". Your name and scores stay on this class computer.",
      "स्वागत है, " + name + "। आपका नाम और अंक इस कक्षा के कंप्यूटर पर रहेंगे।",
      "स्वागत आहे, " + name + ". तुमचे नाव आणि गुण या वर्गाच्या संगणकावर राहतील."
    )
  });
});

app.post("/api/login", function (req, res) {
  const name = cleanPersonName(req.body && req.body.name);
  const pin = String((req.body && req.body.pin) || "");
  const key = (name || "unknown").toLowerCase();

  if (tooManyTries("student:" + key)) {
    return res.status(429).json({
      ok: false,
      message: pack(
        "Too many tries. Wait a few minutes, or ask the teacher.",
        "बहुत बार कोशिश हो गई। कुछ मिनट रुकें, या शिक्षक से पूछें।",
        "खूप वेळा प्रयत्न झाले. काही मिनिटे थांबा, किंवा शिक्षकाला विचारा."
      )
    });
  }

  const accounts = readAccounts();
  const account = name ? accounts.students[name.toLowerCase()] : null;
  const wrong = !account || !validPin(pin) || !secretsMatch(pin, account.salt, account.hash);

  if (wrong) {
    return res.status(400).json({
      ok: false,
      message: pack(
        "That name or PIN is not right. Try again, or register if you are new.",
        "नाम या पिन सही नहीं है। फिर कोशिश करें, या नए हों तो पंजीकरण करें।",
        "नाव किंवा पिन बरोबर नाही. पुन्हा प्रयत्न करा, किंवा नवीन असाल तर नोंदणी करा."
      )
    });
  }

  loginTries.delete("student:" + key);
  startSession(req, res, { role: "student", name: account.name, className: account.className });

  res.json({
    ok: true,
    user: { role: "student", name: account.name, className: account.className },
    message: pack(
      "Hello, " + account.name + ". You are signed in.",
      "नमस्ते, " + account.name + "। आप साइन इन हो गए।",
      "नमस्कार, " + account.name + ". तुम्ही साइन इन झाला आहात."
    )
  });
});

app.post("/api/logout", function (req, res) {
  clearSession(req, res);
  res.json({
    ok: true,
    message: pack(
      "You are signed out. The next student can log in.",
      "आप साइन आउट हो गए। अगला विद्यार्थी लॉग इन कर सकता है।",
      "तुम्ही साइन आउट झाला आहात. पुढील विद्यार्थी लॉग इन करू शकतो."
    )
  });
});

app.get("/api/me", function (req, res) {
  const session = currentSession(req);
  res.json({ ok: true, user: session });
});

app.post("/api/teacher/login", function (req, res) {
  const pin = String((req.body && req.body.pin) || "");

  if (tooManyTries("teacher")) {
    return res.status(429).json({
      ok: false,
      message: pack(
        "Too many tries. Wait a few minutes.",
        "बहुत बार कोशिश हो गई। कुछ मिनट रुकें।",
        "खूप वेळा प्रयत्न झाले. काही मिनिटे थांबा."
      )
    });
  }

  const teacher = readJson(TEACHER_FILE, null);
  if (!teacher || !validPin(pin) || !secretsMatch(pin, teacher.salt, teacher.hash)) {
    return res.status(400).json({
      ok: false,
      message: pack(
        "That teacher PIN is not right.",
        "शिक्षक पिन सही नहीं है।",
        "शिक्षक पिन बरोबर नाही."
      )
    });
  }

  loginTries.delete("teacher");
  startSession(req, res, { role: "teacher", name: "Teacher", className: "" });
  res.json({
    ok: true,
    user: { role: "teacher", name: "Teacher", className: "" },
    message: pack(
      "Teacher sign-in is ready.",
      "शिक्षक साइन-इन तैयार है।",
      "शिक्षक साइन-इन तयार आहे."
    )
  });
});

function requireTeacher(req, res) {
  const session = currentSession(req);
  if (!session || session.role !== "teacher") {
    res.status(403).json({
      ok: false,
      message: pack(
        "Sign in with the teacher PIN first.",
        "पहले शिक्षक पिन से साइन इन करें।",
        "आधी शिक्षक पिनने साइन इन करा."
      )
    });
    return null;
  }
  return session;
}

app.get("/api/teacher/class", function (req, res) {
  if (!requireTeacher(req, res)) {
    return;
  }

  const accounts = readAccounts();
  const progress = readJson(PROGRESS_FILE, { students: {} });
  const students = Object.keys(accounts.students).map(function (key) {
    const account = accounts.students[key];
    const scores = progress.students[key] || { activities: {} };
    return {
      name: account.name,
      className: account.className,
      activities: scores.activities || {}
    };
  }).sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });

  res.json({ ok: true, students: students });
});

app.post("/api/teacher/reset-pin", function (req, res) {
  if (!requireTeacher(req, res)) {
    return;
  }

  const name = cleanPersonName(req.body && req.body.name);
  const pin = String((req.body && req.body.pin) || "");
  const accounts = readAccounts();
  const account = name ? accounts.students[name.toLowerCase()] : null;

  if (!account) {
    return res.status(404).json({
      ok: false,
      message: pack(
        "That student is not registered.",
        "वह विद्यार्थी पंजीकृत नहीं है।",
        "तो विद्यार्थी नोंदलेला नाही."
      )
    });
  }

  if (!validPin(pin)) {
    return res.status(400).json({
      ok: false,
      message: pack(
        "Choose a new PIN with 4 numbers.",
        "4 अंकों का नया पिन चुनें।",
        "4 अंकांचा नवीन पिन निवडा."
      )
    });
  }

  const salt = crypto.randomBytes(16).toString("hex");
  account.salt = salt;
  account.hash = hashSecret(pin, salt);
  accounts.students[name.toLowerCase()] = account;
  writeJson(ACCOUNTS_FILE, accounts);

  res.json({
    ok: true,
    message: pack(
      "New PIN saved for " + account.name + ". Tell it only to that student.",
      account.name + " का नया पिन सहेज लिया। इसे सिर्फ उसी विद्यार्थी को बताएँ।",
      account.name + " यांचा नवीन पिन जतन झाला. तो फक्त त्या विद्यार्थ्याला सांगा."
    )
  });
});

app.use("/api", function (req, res) {
  res.status(404).json({
    ok: false,
    message: pack(
      "That class tool was not found.",
      "वह कक्षा उपकरण नहीं मिला।",
      "ते वर्ग साधन सापडले नाही."
    )
  });
});

app.use(function (req, res, next) {
  let urlPath = req.path;

  try {
    urlPath = decodeURIComponent(req.path).toLowerCase();
  } catch (error) {
    return res.status(400).end();
  }

  const blocked = ["/data", "/student-workspace", "/tmp-uploads", "/node_modules"];
  const hidden = blocked.some(function (prefix) {
    return urlPath === prefix || urlPath.indexOf(prefix + "/") === 0;
  });

  if (hidden) {
    return res.status(404).send("Not found");
  }

  next();
});

app.use(express.static(ROOT, { index: "index.html", dotfiles: "deny" }));

app.use(function (error, req, res, next) {
  if (error && error.type === "entity.parse.failed") {
    return res.status(400).json({
      ok: false,
      message: pack(
        "Please send the form again.",
        "कृपया फ़ॉर्म फिर से भेजें।",
        "कृपया फॉर्म पुन्हा पाठवा."
      )
    });
  }

  console.error(error);
  res.status(500).json({
    ok: false,
    message: pack(
      "The class server had a problem. Please try again.",
      "कक्षा सर्वर में समस्या हुई। कृपया फिर कोशिश करें।",
      "वर्ग सर्व्हरमध्ये अडचण आली. कृपया पुन्हा प्रयत्न करा."
    )
  });
});

app.listen(PORT, function () {
  console.log("Digital Pathshala is ready at http://localhost:" + PORT);
});
