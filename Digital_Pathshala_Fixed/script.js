var Pathshala = window.Pathshala || {};
window.Pathshala = Pathshala;
Pathshala.storageKey = "pathshalaName";

Pathshala.getName = function () {
  return (localStorage.getItem(this.storageKey) || "").trim();
};

Pathshala.setName = function (name) {
  var clean = String(name || "").trim().replace(/\s+/g, " ").slice(0, 40);
  if (clean.length < 2) {
    return false;
  }
  localStorage.setItem(this.storageKey, clean);
  return true;
};

Pathshala.saveProgress = function (activity, score, total) {
  var name = this.getName();
  if (!name) {
    return Promise.resolve({ ok: false, reason: "name" });
  }

  return fetch("/api/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name,
      activity: activity,
      score: score,
      total: total
    })
  }).then(function (response) {
    return response.json();
  });
};

var WORDS = [
  { word: "Folder", hi: "फोल्डर", meaning: "A named place that keeps files together, like a school bag for papers." },
  { word: "File", hi: "फाइल", meaning: "One piece of work on the computer, such as a drawing, photo, or homework page." },
  { word: "Monitor", hi: "मॉनिटर", meaning: "The screen that shows words, pictures, and videos." },
  { word: "Keyboard", hi: "कीबोर्ड", meaning: "The board with keys we press to type letters and numbers." },
  { word: "Mouse", hi: "माउस", meaning: "A small tool that moves the pointer and clicks things on the screen." },
  { word: "CPU", hi: "सीपीयू", meaning: "The part that thinks through the computer's instructions. People call it the brain." },
  { word: "Browser", hi: "ब्राउज़र", meaning: "The app that opens websites, such as Chrome or Edge." },
  { word: "Password", hi: "पासवर्ड", meaning: "A secret word that opens your account. Never send it in a message." },
  { word: "Link", hi: "लिंक", meaning: "Words or a button that open another page. Do not open links from strangers." },
  { word: "Email", hi: "ईमेल", meaning: "An electronic letter sent through the internet." }
];

var PARTS = {
  partMonitor: {
    title: "Monitor",
    hi: "मॉनिटर",
    text: "The monitor is the screen. It shows words, pictures, and videos. We look at it. We do not type on it."
  },
  partKeyboard: {
    title: "Keyboard",
    hi: "कीबोर्ड",
    text: "The keyboard has many keys. We press them to write our name, numbers, and answers."
  },
  partMouse: {
    title: "Mouse",
    hi: "माउस",
    text: "The mouse moves the arrow on the screen. Left click chooses. Right click opens a small menu."
  },
  partCpu: {
    title: "CPU",
    hi: "सीपीयू",
    text: "The CPU is the computer's brain. It follows instructions and works with the other parts."
  }
};

document.addEventListener("DOMContentLoaded", function () {
  setupMenu();
  setupNameBar();
  setupDailyWord();
  setupComputerParts();
  setupContactForm();
  setupServerStatus();
  setupFileLab();
  setupDetective();
  setupProgress();
  setupSession();
});

function setupMenu() {
  var menuToggle = document.getElementById("menuToggle");
  var navLinks = document.getElementById("navLinks");

  if (!menuToggle || !navLinks) {
    return;
  }

  menuToggle.addEventListener("click", function () {
    var isOpen = navLinks.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    });
  });
}

function onPages() {
  return window.location.pathname.replace(/\\/g, "/").indexOf("/pages/") !== -1;
}

function accountPath(file) {
  return (onPages() ? "" : "pages/") + file;
}

function homePath() {
  return onPages() ? "../index.html" : "index.html";
}

function postJson(url, body) {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  }).then(function (response) {
    return response.json().then(function (data) {
      return { ok: response.ok, data: data };
    });
  });
}

function signOut() {
  fetch("/api/logout", { method: "POST" }).then(function () {
    localStorage.removeItem(Pathshala.storageKey);
    window.location.href = accountPath("login.html");
  });
}

function paintAccount(user) {
  var nav = document.getElementById("navLinks");
  if (!nav || nav.querySelector("[data-account]")) {
    return;
  }

  var li = document.createElement("li");
  li.setAttribute("data-account", "1");

  if (user && user.role === "student") {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "account-link";
    Pathshala.setText(button, "Log out");
    button.addEventListener("click", signOut);
    li.appendChild(button);
  } else if (user && user.role === "teacher") {
    var teacherLink = document.createElement("a");
    teacherLink.href = accountPath("teacher.html");
    Pathshala.setText(teacherLink, "Class list");
    li.appendChild(teacherLink);
  } else {
    var loginLink = document.createElement("a");
    loginLink.href = accountPath("login.html");
    Pathshala.setText(loginLink, "Log in");
    li.appendChild(loginLink);
  }

  nav.appendChild(li);
}

function showTeacherDesk() {
  var gate = document.getElementById("teacherGate");
  var desk = document.getElementById("teacherDesk");
  if (gate) gate.hidden = true;
  if (desk) desk.hidden = false;

  fetch("/api/teacher/class")
    .then(function (response) { return response.json(); })
    .then(function (data) {
      var box = document.getElementById("classList");
      if (!box) return;
      box.innerHTML = "";

      if (!data.ok) {
        setStatus(document.getElementById("classMessage"), data.message, "bad");
        return;
      }

      if (!data.students.length) {
        var empty = document.createElement("p");
        Pathshala.setText(empty, "No students have registered yet.");
        box.appendChild(empty);
        return;
      }

      var table = document.createElement("table");
      table.className = "class-table";

      data.students.forEach(function (student) {
        var row = document.createElement("tr");
        var who = document.createElement("td");
        who.textContent = student.name + " · " + student.className;

        var scores = document.createElement("td");
        var acts = student.activities || {};
        var bits = [];
        ["quiz", "file-lab", "detective"].forEach(function (key) {
          if (acts[key]) bits.push(acts[key].score + "/" + acts[key].total);
        });
        scores.textContent = bits.length ? bits.join(" · ") : "—";

        var pinCell = document.createElement("td");
        var form = document.createElement("form");
        form.className = "mini-row";
        var input = document.createElement("input");
        input.maxLength = 4;
        input.inputMode = "numeric";
        input.placeholder = "1234";
        input.dataset.enAria = "New PIN";
        input.setAttribute("aria-label", Pathshala.tr("New PIN"));
        var button = document.createElement("button");
        button.type = "submit";
        button.className = "mini-btn";
        Pathshala.setText(button, "Save new PIN");
        form.appendChild(input);
        form.appendChild(button);
        form.addEventListener("submit", function (event) {
          event.preventDefault();
          postJson("/api/teacher/reset-pin", { name: student.name, pin: input.value })
            .then(function (result) {
              setStatus(document.getElementById("classMessage"), result.data.message, result.ok ? "ok" : "bad");
              if (result.ok) input.value = "";
            });
        });
        pinCell.appendChild(form);
        row.appendChild(who);
        row.appendChild(scores);
        row.appendChild(pinCell);
        table.appendChild(row);
      });

      box.appendChild(table);
    })
    .catch(function () {
      setStatus(document.getElementById("classMessage"), "The class server is off. Ask a teacher to run npm start.", "bad");
    });
}

function setupAuthForms(user) {
  var loginForm = document.getElementById("loginForm");
  if (loginForm) {
    if (user && user.role === "student") {
      window.location.href = homePath();
      return;
    }
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var button = loginForm.querySelector("button");
      button.disabled = true;
      postJson("/api/login", {
        name: document.getElementById("loginName").value,
        pin: document.getElementById("loginPin").value
      }).then(function (result) {
        setStatus(document.getElementById("loginMessage"), result.data.message, result.ok ? "ok" : "bad");
        if (result.ok && result.data.user) {
          Pathshala.setName(result.data.user.name);
          window.location.href = homePath();
        }
      }).catch(function () {
        setStatus(document.getElementById("loginMessage"), "The class server is off. Ask a teacher to run npm start.", "bad");
      }).then(function () {
        button.disabled = false;
      });
    });
  }

  var registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var button = registerForm.querySelector("button");
      button.disabled = true;
      postJson("/api/register", {
        name: document.getElementById("registerName").value,
        className: document.getElementById("registerClass").value,
        pin: document.getElementById("registerPin").value,
        pinAgain: document.getElementById("registerPinAgain").value
      }).then(function (result) {
        setStatus(document.getElementById("registerMessage"), result.data.message, result.ok ? "ok" : "bad");
        if (result.ok && result.data.user) {
          Pathshala.setName(result.data.user.name);
          window.location.href = homePath();
        }
      }).catch(function () {
        setStatus(document.getElementById("registerMessage"), "The class server is off. Ask a teacher to run npm start.", "bad");
      }).then(function () {
        button.disabled = false;
      });
    });
  }

  var teacherForm = document.getElementById("teacherForm");
  if (teacherForm) {
    if (user && user.role === "teacher") {
      showTeacherDesk();
    }
    teacherForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var button = teacherForm.querySelector("button");
      button.disabled = true;
      postJson("/api/teacher/login", {
        pin: document.getElementById("teacherPin").value
      }).then(function (result) {
        setStatus(document.getElementById("teacherMessage"), result.data.message, result.ok ? "ok" : "bad");
        if (result.ok) showTeacherDesk();
      }).catch(function () {
        setStatus(document.getElementById("teacherMessage"), "The class server is off. Ask a teacher to run npm start.", "bad");
      }).then(function () {
        button.disabled = false;
      });
    });
  }
}

function setupSession() {
  fetch("/api/me")
    .then(function (response) { return response.json(); })
    .then(function (data) {
      var user = data && data.user;
      Pathshala.user = user || null;
      paintAccount(user);

      if (user && user.role === "student") {
        Pathshala.setName(user.name);
        paintNameSlots();
        var input = document.getElementById("studentName");
        var nameBar = document.getElementById("nameBar");
        if (input && nameBar) {
          input.value = user.name;
          input.readOnly = true;
        }
        var note = document.getElementById("nameNote");
        if (note) {
          Pathshala.fill(note, "You are signed in as {name}.", { name: user.name });
          note.className = "status ok";
        }
      }

      setupAuthForms(user);
    })
    .catch(function () {
      paintAccount(null);
      setupAuthForms(null);
    });
}

function paintNameSlots() {
  var name = Pathshala.getName();
  document.querySelectorAll("[data-student-slot]").forEach(function (slot) {
    if (name) {
      delete slot.dataset.en;
      slot.textContent = name;
    } else {
      Pathshala.setText(slot, "friend");
    }
  });
}

function setupNameBar() {
  var nameBar = document.getElementById("nameBar");
  var input = document.getElementById("studentName");
  var note = document.getElementById("nameNote");

  if (input && Pathshala.getName()) {
    input.value = Pathshala.getName();
  }

  paintNameSlots();

  if (!nameBar || !input) {
    return;
  }

  nameBar.addEventListener("submit", function (event) {
    event.preventDefault();
    var saved = Pathshala.setName(input.value);

    if (!note) {
      paintNameSlots();
      return;
    }

    if (saved) {
      Pathshala.fill(note, "Hello, {name}. Your name will appear on the certificate.", { name: Pathshala.getName() });
      note.className = "status ok";
    } else {
      Pathshala.setText(note, "Please type your name with at least 2 letters.");
      note.className = "status bad";
    }

    paintNameSlots();
  });
}

function setupDailyWord() {
  var box = document.getElementById("dailyWord");
  if (!box) {
    return;
  }

  var start = new Date(new Date().getFullYear(), 0, 0);
  var day = Math.floor((new Date() - start) / 86400000);
  var item = WORDS[day % WORDS.length];
  var word = box.querySelector("[data-word]");
  var hindi = box.querySelector("[data-hi]");
  var meaning = box.querySelector("[data-meaning]");

  if (word) Pathshala.setText(word, item.word);
  if (hindi) hindi.textContent = item.hi;
  if (meaning) Pathshala.setText(meaning, item.meaning);
}

function showPart(id) {
  var info = PARTS[id];
  var title = document.getElementById("partTitle");
  var hindi = document.getElementById("partHindi");
  var text = document.getElementById("partText");

  if (!info || !title || !text) {
    return;
  }

  Pathshala.setText(title, info.title);
  if (hindi) hindi.textContent = info.hi;
  Pathshala.setText(text, info.text);

  document.querySelectorAll(".part-btn").forEach(function (part) {
    part.classList.toggle("is-on", part.id === id);
  });

  document.querySelectorAll("[data-part]").forEach(function (button) {
    button.classList.toggle("is-on", button.getAttribute("data-part") === id);
  });
}

function setupComputerParts() {
  if (!document.getElementById("partMonitor")) {
    return;
  }

  document.querySelectorAll(".part-btn, [data-part]").forEach(function (part) {
    var id = part.id && PARTS[part.id] ? part.id : part.getAttribute("data-part");

    part.addEventListener("click", function () {
      showPart(id);
    });

    part.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showPart(id);
      }
    });
  });

  showPart("partMonitor");
}

function setupContactForm() {
  var form = document.getElementById("contactForm");
  var result = document.getElementById("contactResult");
  if (!form) {
    return;
  }

  var nameInput = document.getElementById("contactName");
  var classInput = document.getElementById("contactClass");
  var messageInput = document.getElementById("contactMessage");

  if (nameInput && !nameInput.value && Pathshala.getName()) {
    nameInput.value = Pathshala.getName();
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var button = form.querySelector("button");
    var payload = {
      name: nameInput ? nameInput.value : "",
      className: classInput ? classInput.value : "",
      message: messageInput ? messageInput.value : ""
    };

    if (nameInput && Pathshala.setName(nameInput.value)) {
      paintNameSlots();
    }

    button.disabled = true;
    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (response) {
        return response.json().then(function (data) {
          return { ok: response.ok, data: data };
        });
      })
      .then(function (resultData) {
        if (result) {
          setStatus(result, resultData.data.message || "Saved.", resultData.ok ? "ok" : "bad");
        }
        if (resultData.ok && messageInput) {
          messageInput.value = "";
        }
      })
      .catch(function () {
        if (result) {
          Pathshala.setText(result, "The class server is off. Ask a teacher to run npm start, then try again.");
          result.className = "status bad";
        }
      })
      .then(function () {
        button.disabled = false;
      });
  });
}

function setupServerStatus() {
  var box = document.getElementById("serverStatus");
  if (!box) {
    return;
  }

  fetch("/api/health")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("down");
      }
      Pathshala.setText(box, "Class server is on. Files and scores stay on this computer.");
      box.className = "server-status is-on";
    })
    .catch(function () {
      Pathshala.setText(box, "Class server is off. Ask a teacher to open this site with npm start.");
      box.className = "server-status is-off";
    });
}

function prettySize(bytes) {
  if (bytes < 1024) {
    return bytes + " B";
  }
  return Math.max(1, Math.round(bytes / 1024)) + " KB";
}

function line(template, vars, lang) {
  var table = lang === "en" ? null : (Pathshala.strings[lang] || {});
  var text = (table && table[template]) || template;
  Object.keys(vars || {}).forEach(function (key) {
    text = text.split("{" + key + "}").join(String(vars[key] == null ? "" : vars[key]));
  });
  return text;
}

function setStatus(element, text, kind) {
  if (!element) {
    return;
  }
  if (text && typeof text === "object") {
    Pathshala.showPack(element, text);
  } else {
    Pathshala.setText(element, text || "");
  }
  element.className = "status " + (kind || "");
}

function setupFileLab() {
  var folderForm = document.getElementById("folderForm");
  if (!folderForm) {
    return;
  }

  var folderList = document.getElementById("folderList");
  var fileForm = document.getElementById("fileForm");
  var fileFolder = document.getElementById("fileFolder");
  var fileList = document.getElementById("fileList");
  var labMessage = document.getElementById("labMessage");
  var folders = [];

  function drawFolders() {
    var selected = fileFolder.value;
    folderList.innerHTML = "";
    fileFolder.innerHTML = "";

    if (!folders.length) {
      var empty = document.createElement("p");
      empty.className = "hint";
      Pathshala.setText(empty, "No folders yet. Create your first one.");
      folderList.appendChild(empty);
      return;
    }

    folders.forEach(function (name) {
      var card = document.createElement("article");
      card.className = "folder-card";

      var tab = document.createElement("div");
      tab.className = "folder-tab";
      var body = document.createElement("div");
      body.className = "folder-body";
      var title = document.createElement("h3");
      title.textContent = name;
      var open = document.createElement("button");
      open.type = "button";
      open.className = "mini-btn";
      Pathshala.setText(open, "Open");
      open.addEventListener("click", function () {
        fileFolder.value = name;
        loadFiles(name);
      });

      var remove = document.createElement("button");
      remove.type = "button";
      remove.className = "mini-btn mini-btn-quiet";
      Pathshala.setText(remove, "Remove");
      remove.addEventListener("click", function () {
        if (!window.confirm(Pathshala.fillText("Remove the folder {name} and the files inside it?", { name: name }))) {
          return;
        }
        fetch("/api/folders", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name })
        })
          .then(function (response) { return response.json(); })
          .then(function (data) {
            setStatus(labMessage, data.message, data.ok ? "ok" : "bad");
            if (data.ok) {
              folders = data.folders;
              drawFolders();
              fileList.innerHTML = "";
            }
          })
          .catch(showOffline);
      });

      body.appendChild(title);
      body.appendChild(open);
      body.appendChild(remove);
      card.appendChild(tab);
      card.appendChild(body);
      folderList.appendChild(card);

      var option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      fileFolder.appendChild(option);
    });

    if (selected && folders.indexOf(selected) !== -1) {
      fileFolder.value = selected;
    }
  }

  function drawFiles(files) {
    fileList.innerHTML = "";

    if (!files.length) {
      var empty = document.createElement("p");
      empty.className = "hint";
      Pathshala.setText(empty, "This folder is empty. Send a homework file into it.");
      fileList.appendChild(empty);
      return;
    }

    files.forEach(function (file) {
      var row = document.createElement("article");
      row.className = "file-row";

      var title = document.createElement("h3");
      title.textContent = file.name;

      var meta = document.createElement("p");
      var bits = [prettySize(file.size)];
      if (file.student) bits.push(Pathshala.fillText("Sent by {name}", { name: file.student }));
      if (file.note) bits.push(file.note);
      meta.textContent = bits.join(" · ");

      var actions = document.createElement("div");
      var download = document.createElement("a");
      download.className = "mini-btn";
      download.href = "/api/files/download?folder=" + encodeURIComponent(fileFolder.value) + "&file=" + encodeURIComponent(file.name);
      Pathshala.setText(download, "Open");

      var remove = document.createElement("button");
      remove.type = "button";
      remove.className = "mini-btn mini-btn-quiet";
      Pathshala.setText(remove, "Remove");
      remove.addEventListener("click", function () {
        if (!window.confirm(Pathshala.fillText("Remove {name} from this folder?", { name: file.name }))) {
          return;
        }
        fetch("/api/files", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ folder: fileFolder.value, file: file.name })
        })
          .then(function (response) { return response.json(); })
          .then(function (data) {
            setStatus(labMessage, data.message, data.ok ? "ok" : "bad");
            if (data.ok) drawFiles(data.files);
          })
          .catch(showOffline);
      });

      actions.appendChild(download);
      actions.appendChild(remove);
      row.appendChild(title);
      row.appendChild(meta);
      row.appendChild(actions);
      fileList.appendChild(row);
    });
  }

  function loadFiles(folder) {
    fetch("/api/files?folder=" + encodeURIComponent(folder))
      .then(function (response) { return response.json(); })
      .then(function (data) {
        if (data.ok) drawFiles(data.files);
      })
      .catch(showOffline);
  }

  function showOffline() {
    setStatus(labMessage, "The class server is off. Ask a teacher to run npm start.", "bad");
  }

  window.addEventListener("pathshala-lang", function () {
    drawFolders();
    if (fileFolder.value) {
      loadFiles(fileFolder.value);
    }
  });

  function refresh(selectName) {
    return fetch("/api/folders")
      .then(function (response) { return response.json(); })
      .then(function (data) {
        folders = data.folders || [];
        drawFolders();
        if (selectName && folders.indexOf(selectName) !== -1) {
          fileFolder.value = selectName;
        }
        if (fileFolder.value) {
          loadFiles(fileFolder.value);
        }
      });
  }

  folderForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var button = folderForm.querySelector("button");
    var name = document.getElementById("folderName").value;
    button.disabled = true;

    fetch("/api/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name })
    })
      .then(function (response) {
        return response.json().then(function (data) {
          return { ok: response.ok, data: data };
        });
      })
      .then(function (result) {
        setStatus(labMessage, result.data.message, result.ok ? "ok" : "bad");
        if (result.ok) {
          document.getElementById("folderName").value = "";
          return refresh(name);
        }
      })
      .catch(showOffline)
      .then(function () {
        button.disabled = false;
      });
  });

  fileFolder.addEventListener("change", function () {
    if (fileFolder.value) loadFiles(fileFolder.value);
  });

  fileForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var button = fileForm.querySelector("button");
    var fileInput = document.getElementById("homeworkFile");

    if (!fileFolder.value) {
      setStatus(labMessage, "Create a folder first, then send the file into it.", "bad");
      return;
    }

    if (!fileInput.files.length) {
      setStatus(labMessage, "Choose a file from this computer.", "bad");
      return;
    }

    var body = new FormData();
    body.append("folder", fileFolder.value);
    body.append("studentName", Pathshala.getName());
    body.append("note", document.getElementById("fileNote").value);
    body.append("file", fileInput.files[0]);
    button.disabled = true;

    fetch("/api/files", { method: "POST", body: body })
      .then(function (response) {
        return response.json().then(function (data) {
          return { ok: response.ok, data: data };
        });
      })
      .then(function (result) {
        setStatus(labMessage, result.data.message, result.ok ? "ok" : "bad");
        if (result.ok) {
          fileInput.value = "";
          document.getElementById("fileNote").value = "";
          drawFiles(result.data.files || []);
        }
      })
      .catch(showOffline)
      .then(function () {
        button.disabled = false;
      });
  });

  refresh().catch(showOffline);
}

function setupDetective() {
  var app = document.getElementById("detectiveApp");
  if (!app) {
    return;
  }

  var messages = [];
  var index = 0;
  var answers = [];
  var locked = false;
  var fromEl = document.getElementById("msgFrom");
  var textEl = document.getElementById("msgText");
  var countEl = document.getElementById("msgCount");
  var whyEl = document.getElementById("msgWhy");
  var nextBtn = document.getElementById("msgNext");
  var resultEl = document.getElementById("detectiveResult");

  var lastWhy = null;

  function showMessage() {
    var current = messages[index];
    locked = false;
    lastWhy = null;
    Pathshala.showPack(fromEl, {
      en: line("From: {from}", { from: current.from.en || current.from }, "en"),
      hi: line("From: {from}", { from: current.from.hi || current.from.en || current.from }, "hi"),
      mr: line("From: {from}", { from: current.from.mr || current.from.en || current.from }, "mr")
    });
    Pathshala.showPack(textEl, current.text);
    Pathshala.fill(countEl, "Message {n} of {total}", { n: index + 1, total: messages.length });
    whyEl.textContent = "";
    delete whyEl.dataset.pack;
    delete whyEl.dataset.en;
    whyEl.className = "status";
    nextBtn.hidden = true;
    app.querySelectorAll("[data-choice]").forEach(function (button) {
      button.disabled = false;
      button.classList.remove("is-right", "is-wrong");
    });
  }

  function finish() {
    fetch("/api/detective/finish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: Pathshala.getName(), answers: answers })
    })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        app.hidden = true;
        resultEl.hidden = false;
        var extra = data.saved
          ? " Saved for {name}."
          : " Save your name on the home page to put this score on your certificate.";
        Pathshala.showPack(resultEl, {
          en: line("You spotted {score} out of {total} messages.", data, "en") + line(extra, { name: Pathshala.getName() }, "en"),
          hi: line("You spotted {score} out of {total} messages.", data, "hi") + line(extra, { name: Pathshala.getName() }, "hi"),
          mr: line("You spotted {score} out of {total} messages.", data, "mr") + line(extra, { name: Pathshala.getName() }, "mr")
        });
      })
      .catch(function () {
        resultEl.hidden = false;
        Pathshala.setText(resultEl, "The class server is off, so the score could not be saved.");
      });
  }

  app.addEventListener("click", function (event) {
    var button = event.target.closest("[data-choice]");
    if (!button || locked || !messages.length) {
      return;
    }

    locked = true;
    var choice = button.getAttribute("data-choice");
    answers[index] = { id: messages[index].id, choice: choice };

    fetch("/api/detective/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: messages[index].id, choice: choice })
    })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        app.querySelectorAll("[data-choice]").forEach(function (choiceButton) {
          choiceButton.disabled = true;
          if (choiceButton.getAttribute("data-choice") === data.answer) {
            choiceButton.classList.add("is-right");
          }
        });
        if (!data.correct) {
          button.classList.add("is-wrong");
        }
        var prefix = data.correct ? "Yes. " : "Not quite. ";
        lastWhy = {
          en: line(prefix, {}, "en") + (data.why.en || ""),
          hi: line(prefix, {}, "hi") + (data.why.hi || data.why.en || ""),
          mr: line(prefix, {}, "mr") + (data.why.mr || data.why.en || "")
        };
        Pathshala.showPack(whyEl, lastWhy);
        whyEl.className = "status " + (data.correct ? "ok" : "bad");
        nextBtn.hidden = false;
        Pathshala.setText(nextBtn, index === messages.length - 1 ? "See my score" : "Next message");
      })
      .catch(function () {
        locked = false;
        lastWhy = null;
        Pathshala.setText(whyEl, "The class server is off. Ask a teacher to run npm start.");
        whyEl.className = "status bad";
      });
  });

  nextBtn.addEventListener("click", function () {
    if (index >= messages.length - 1) {
      finish();
      return;
    }
    index += 1;
    showMessage();
  });

  fetch("/api/detective")
    .then(function (response) { return response.json(); })
    .then(function (data) {
      messages = data.messages || [];
      if (!messages.length) {
        throw new Error("empty");
      }
      showMessage();
    })
    .catch(function () {
      Pathshala.setText(textEl, "The practice messages load from the class server. Ask a teacher to run npm start.");
    });

  var scanForm = document.getElementById("scanForm");
  var scanResult = document.getElementById("scanResult");

  var samples = {
    en: "Congratulations! You won a free laptop. Send your OTP and click http://prize-now.example",
    hi: "बधाई हो! आपने मुफ्त लैपटॉप जीता है। अपना OTP भेजें और http://prize-now.example खोलें",
    mr: "अभिनंदन! तुम्ही मोफत लॅपटॉप जिंकला आहे. OTP पाठवा आणि http://prize-now.example उघडा"
  };

  document.getElementById("sampleMessage").addEventListener("click", function () {
    document.getElementById("scanText").value = samples[Pathshala.lang()] || samples.en;
  });

  scanForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var button = scanForm.querySelector("button[type='submit']");
    button.disabled = true;

    fetch("/api/detective/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: document.getElementById("scanText").value })
    })
      .then(function (response) {
        return response.json().then(function (data) {
          return { ok: response.ok, data: data };
        });
      })
      .then(function (result) {
        scanResult.innerHTML = "";
        if (!result.ok) {
          var problem = document.createElement("p");
          problem.className = "status bad";
          Pathshala.showPack(problem, result.data.message);
          scanResult.appendChild(problem);
          return;
        }

        var title = document.createElement("h3");
        Pathshala.showPack(title, result.data.title);
        scanResult.appendChild(title);
        scanResult.className = "scan-result is-" + result.data.verdict;

        if (!result.data.reasons.length) {
          var calm = document.createElement("p");
          Pathshala.setText(calm, "No common trick showed up in this message.");
          scanResult.appendChild(calm);
        } else {
          var list = document.createElement("ul");
          result.data.reasons.forEach(function (reason) {
            var item = document.createElement("li");
            Pathshala.showPack(item, reason);
            list.appendChild(item);
          });
          scanResult.appendChild(list);
        }

        var tip = document.createElement("p");
        Pathshala.showPack(tip, result.data.tip);
        var reminder = document.createElement("p");
        reminder.className = "hint";
        Pathshala.showPack(reminder, result.data.reminder);
        scanResult.appendChild(tip);
        scanResult.appendChild(reminder);
      })
      .catch(function () {
        Pathshala.setText(scanResult, "The class server is off. Ask a teacher to run npm start.");
        scanResult.className = "scan-result";
      })
      .then(function () {
        button.disabled = false;
      });
  });
}

function stars(score, total) {
  if (!total) {
    return "☆☆☆☆☆";
  }
  var filled = Math.round((score / total) * 5);
  return "★★★★★".slice(0, filled) + "☆☆☆☆☆".slice(filled);
}

function setupProgress() {
  var form = document.getElementById("progressForm");
  if (!form) {
    return;
  }

  var list = document.getElementById("certList");
  var certName = document.getElementById("certName");
  var certTitle = document.getElementById("certTitle");
  var certNote = document.getElementById("certNote");
  var certDate = document.getElementById("certDate");

  var labels = {
    quiz: "Computer quiz",
    detective: "Fake-message game",
    "file-lab": "File lab"
  };

  function draw(student) {
    var displayName = (student && student.name) || Pathshala.getName() || "Student";
    certName.textContent = displayName;
    list.innerHTML = "";

    var activities = student && student.activities ? student.activities : {};
    var keys = Object.keys(labels);
    var done = 0;

    keys.forEach(function (key) {
      var item = document.createElement("li");
      var activity = activities[key];
      var label = labels[key];
      var starText = activity ? stars(activity.score, activity.total) : "";
      if (activity) {
        done += 1;
        Pathshala.showPack(item, {
          en: line("{label} · {score}/{total} {stars}", { label: label, score: activity.score, total: activity.total, stars: starText }, "en"),
          hi: line("{label} · {score}/{total} {stars}", { label: line(label, {}, "hi"), score: activity.score, total: activity.total, stars: starText }, "hi"),
          mr: line("{label} · {score}/{total} {stars}", { label: line(label, {}, "mr"), score: activity.score, total: activity.total, stars: starText }, "mr")
        });
      } else {
        Pathshala.showPack(item, {
          en: line("{label} · not yet", { label: label }, "en"),
          hi: line("{label} · not yet", { label: line(label, {}, "hi") }, "hi"),
          mr: line("{label} · not yet", { label: line(label, {}, "mr") }, "mr")
        });
        item.className = "is-waiting";
      }
      list.appendChild(item);
    });

    if (done >= 3) {
      Pathshala.setText(certTitle, "Computer Explorer");
      Pathshala.setText(certNote, "You practised parts, files, and staying safe online.");
    } else if (done > 0) {
      Pathshala.setText(certTitle, "Computer Learner");
      Pathshala.setText(certNote, "You started the path. Finish the other activities to become a Computer Explorer.");
    } else {
      Pathshala.setText(certTitle, "Ready to Begin");
      Pathshala.setText(certNote, "Finish the quiz, the file lab, or the fake-message game. This certificate will fill in.");
    }

    var locales = { en: "en-IN", hi: "hi-IN", mr: "mr-IN" };
    certDate.textContent = new Date().toLocaleDateString(locales[Pathshala.lang()] || "en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }

  function load(name) {
    if (!Pathshala.setName(name) && !Pathshala.getName()) {
      setStatus(document.getElementById("progressStatus"), "Type your name with at least 2 letters.", "bad");
      return;
    }

    fetch("/api/progress?name=" + encodeURIComponent(Pathshala.getName()))
      .then(function (response) { return response.json(); })
      .then(function (data) {
        if (!data.ok) {
          setStatus(document.getElementById("progressStatus"), data.message, "bad");
          return;
        }
        var status = document.getElementById("progressStatus");
        if (data.student) {
          Pathshala.fill(status, "Certificate ready for {name}.", { name: data.student.name });
          status.className = "status ok";
        } else {
          setStatus(status, "No saved scores yet. Play an activity, then come back.", "ok");
        }
        draw(data.student);
      })
      .catch(function () {
        setStatus(document.getElementById("progressStatus"), "The class server is off. Your certificate needs npm start.", "bad");
        draw(null);
      });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    load(document.getElementById("studentName").value);
  });

  document.getElementById("printCert").addEventListener("click", function () {
    window.print();
  });

  draw(null);
  if (Pathshala.getName()) {
    load(Pathshala.getName());
  }
}
