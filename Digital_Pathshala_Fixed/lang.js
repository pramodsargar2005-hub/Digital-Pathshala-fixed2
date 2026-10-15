var Pathshala = window.Pathshala || {};
window.Pathshala = Pathshala;

Pathshala.langKey = "pathshalaLang";

Pathshala.lang = function () {
  var saved = localStorage.getItem(Pathshala.langKey);
  if (saved === "hi" || saved === "mr" || saved === "en") {
    return saved;
  }
  return "en";
};

Pathshala.setLang = function (lang) {
  if (lang !== "hi" && lang !== "mr" && lang !== "en") {
    lang = "en";
  }
  localStorage.setItem(Pathshala.langKey, lang);
  Pathshala.apply();
  window.dispatchEvent(new Event("pathshala-lang"));
};

Pathshala.tr = function (english) {
  var lang = Pathshala.lang();
  if (!english || lang === "en") {
    return english;
  }
  var table = Pathshala.strings[lang] || {};
  return table[english] || english;
};

Pathshala.fillText = function (template, vars) {
  var text = Pathshala.tr(template);
  Object.keys(vars || {}).forEach(function (key) {
    text = text.split("{" + key + "}").join(String(vars[key]));
  });
  return text;
};

Pathshala.setText = function (el, english) {
  if (!el) {
    return;
  }
  el.dataset.en = english;
  delete el.dataset.pack;
  delete el.dataset.tpl;
  el.textContent = Pathshala.tr(english);
};

Pathshala.fill = function (el, template, vars) {
  if (!el) {
    return;
  }
  el.dataset.tpl = template;
  el.dataset.vars = JSON.stringify(vars || {});
  delete el.dataset.en;
  delete el.dataset.pack;
  el.textContent = Pathshala.fillText(template, vars || {});
};

Pathshala.showPack = function (el, pack) {
  if (!el || !pack) {
    return;
  }
  el.dataset.pack = JSON.stringify(pack);
  delete el.dataset.en;
  delete el.dataset.tpl;
  var lang = Pathshala.lang();
  el.textContent = pack[lang] || pack.en || "";
};

Pathshala.packText = function (pack) {
  if (!pack) {
    return "";
  }
  if (typeof pack === "string") {
    return Pathshala.tr(pack);
  }
  var lang = Pathshala.lang();
  return pack[lang] || pack.en || "";
};

Pathshala.strings = { hi: {}, mr: {} };

function addStrings(pairs) {
  pairs.forEach(function (row) {
    Pathshala.strings.hi[row[0]] = row[1];
    Pathshala.strings.mr[row[0]] = row[2];
  });
}

addStrings([
  ["Skip to lessons", "पाठों पर जाएँ", "धड्यांकडे जा"],
  ["Toggle navigation", "मेनू खोलें", "मेनू उघडा"],
  ["Home", "होम", "मुख्यपृष्ठ"],
  ["Lessons", "पाठ", "धडे"],
  ["Videos", "वीडियो", "व्हिडिओ"],
  ["File Lab", "फाइल लैब", "फाइल प्रयोगशाळा"],
  ["Spot Fakes", "नकली संदेश", "खोटे संदेश"],
  ["Quiz", "क्विज़", "प्रश्नमंजुषा"],
  ["Contact", "संपर्क", "संपर्क"],
  ["Certificate", "प्रमाणपत्र", "प्रमाणपत्र"],
  ["All Lessons →", "सभी पाठ →", "सर्व धडे →"],
  ["A CLASSROOM FOR FIRST COMPUTERS", "पहली बार कंप्यूटर सीखने की कक्षा", "पहिल्यांदा संगणक शिकण्याची वर्ग"],
  ["Learn computer skills", "कंप्यूटर कौशल सीखें", "संगणक कौशल्ये शिका"],
  ["the joyful way", "आसान और खुशी से", "सोप्या आणि आनंदी पद्धतीने"],
  ["Digital Pathshala is for rural school students. Tap the computer, watch short videos, make a folder, send a file, and learn which messages are fake.", "डिजिटल पाठशाला गाँव के स्कूली बच्चों के लिए है। कंप्यूटर पर टैप करें, छोटे वीडियो देखें, फोल्डर बनाएँ, फाइल भेजें, और सीखें कि कौन सा संदेश नकली है।", "डिजिटल पाठशाळा ग्रामीण शाळेतील मुलांसाठी आहे. संगणकावर टॅप करा, छोटे व्हिडिओ पाहा, फोल्डर तयार करा, फाइल पाठवा आणि कोणता संदेश खोटा आहे ते शिका."],
  ["Start learning", "सीखना शुरू करें", "शिकायला सुरुवात करा"],
  ["Watch videos", "वीडियो देखें", "व्हिडिओ पाहा"],
  ["Your name / आपका नाम", "आपका नाम", "तुमचे नाव"],
  ["Your name", "आपका नाम", "तुमचे नाव"],
  ["Save", "सहेजें", "जतन करा"],
  ["Monitor", "मॉनिटर", "मॉनिटर"],
  ["Keyboard", "कीबोर्ड", "कीबोर्ड"],
  ["Mouse", "माउस", "माउस"],
  ["CPU", "सीपीयू", "सीपीयू"],
  ["TODAY'S COMPUTER WORD", "आज का कंप्यूटर शब्द", "आजचा संगणक शब्द"],
  ["Folder", "फोल्डर", "फोल्डर"],
  ["File", "फाइल", "फाइल"],
  ["Browser", "ब्राउज़र", "ब्राउझर"],
  ["Password", "पासवर्ड", "पासवर्ड"],
  ["Link", "लिंक", "लिंक"],
  ["Email", "ईमेल", "ईमेल"],
  ["A named place that keeps files together.", "एक नाम वाली जगह जहाँ फाइलें साथ रहती हैं।", "फाइल्स एकत्र ठेवण्याची नाव असलेली जागा."],
  ["A named place that keeps files together, like a school bag for papers.", "एक नाम वाली जगह जहाँ फाइलें रहती हैं, जैसे कागज़ों का स्कूल बैग।", "फाइल्स ठेवण्याची जागा, जशी कागदांसाठी शाळेची पिशवी."],
  ["One piece of work on the computer, such as a drawing, photo, or homework page.", "कंप्यूटर पर काम का एक हिस्सा, जैसे चित्र, फोटो या होमवर्क।", "संगणकावरील कामाचा एक भाग, जसे चित्र, फोटो किंवा गृहपाठ."],
  ["The screen that shows words, pictures, and videos.", "वह स्क्रीन जिस पर शब्द, चित्र और वीडियो दिखते हैं।", "शब्द, चित्रे आणि व्हिडिओ दाखवणारी स्क्रीन."],
  ["The board with keys we press to type letters and numbers.", "वह पटरी जिसके बटन दबाकर हम अक्षर और संख्या लिखते हैं।", "अक्षरे आणि अंक लिहिण्यासाठी ज्याच्या कळा आपण दाबतो."],
  ["A small tool that moves the pointer and clicks things on the screen.", "एक छोटा औज़ार जो तीर हिलाता है और स्क्रीन पर चीज़ें चुनता है।", "बाण हलवणारे आणि स्क्रीनवरील गोष्टी निवडणारे छोटे साधन."],
  ["The part that thinks through the computer's instructions. People call it the brain.", "वह भाग जो कंप्यूटर के निर्देशों पर काम करता है। लोग इसे दिमाग कहते हैं।", "संगणकाच्या सूचनांवर काम करणारा भाग. याला मेंदू म्हणतात."],
  ["The app that opens websites, such as Chrome or Edge.", "वह ऐप जो वेबसाइट खोलता है, जैसे क्रोम या एज।", "वेबसाइट उघडणारे अॅप, जसे क्रोम किंवा एज."],
  ["A secret word that opens your account. Never send it in a message.", "वह गुप्त शब्द जो खाता खोलता है। इसे संदेश में कभी न भेजें।", "खाते उघडणारा गुप्त शब्द. तो संदेशात कधीही पाठवू नका."],
  ["Words or a button that open another page. Do not open links from strangers.", "शब्द या बटन जो दूसरा पेज खोलते हैं। अनजान लोगों की लिंक न खोलें।", "दुसरे पान उघडणारे शब्द किंवा बटन. अनोळखी लोकांच्या लिंक उघडू नका."],
  ["An electronic letter sent through the internet.", "इंटरनेट से भेजा गया इलेक्ट्रॉनिक पत्र।", "इंटरनेटवरून पाठवलेले इलेक्ट्रॉनिक पत्र."],
  ["Your learning path", "आपका सीखने का रास्ता", "तुमचा शिकण्याचा मार्ग"],
  ["Follow the steps, or jump to the one you want to try.", "क्रम से चलें, या जो चाहें उसे खोलें।", "क्रमाने चला किंवा हवे ते उघडा."],
  ["Step 1", "कदम 1", "पायरी 1"],
  ["Step 2", "कदम 2", "पायरी 2"],
  ["Step 3", "कदम 3", "पायरी 3"],
  ["Step 4", "कदम 4", "पायरी 4"],
  ["Step 5", "कदम 5", "पायरी 5"],
  ["Step 6", "कदम 6", "पायरी 6"],
  ["Step 7", "कदम 7", "पायरी 7"],
  ["Parts", "भाग", "भाग"],
  ["Keys", "कुंजियाँ", "कळा"],
  ["Internet", "इंटरनेट", "इंटरनेट"],
  ["Files", "फाइलें", "फाइल्स"],
  ["Stay safe", "सुरक्षित रहें", "सुरक्षित राहा"],
  ["Computer Basics", "कंप्यूटर की बुनियाद", "संगणकाची ओळख"],
  ["Learn what a computer is, its parts, hardware, and software.", "जानें कि कंप्यूटर क्या है, उसके भाग, हार्डवेयर और सॉफ्टवेयर।", "संगणक काय आहे, त्याचे भाग, हार्डवेअर आणि सॉफ्टवेअर जाणून घ्या."],
  ["Learn more", "और जानें", "अधिक जाणून घ्या"],
  ["Keyboard & Mouse", "कीबोर्ड और माउस", "कीबोर्ड आणि माउस"],
  ["Press keys, click, and practise typing short words.", "कुंजियाँ दबाएँ, क्लिक करें, और छोटे शब्द टाइप करने का अभ्यास करें।", "कळा दाबा, क्लिक करा आणि छोटे शब्द टाइप करण्याचा सराव करा."],
  ["Internet Basics", "इंटरनेट की बुनियाद", "इंटरनेटची ओळख"],
  ["Open a browser, search, and stay careful online.", "ब्राउज़र खोलें, खोजें, और ऑनलाइन सावध रहें।", "ब्राउझर उघडा, शोधा आणि ऑनलाइन सावध राहा."],
  ["Video Class", "वीडियो कक्षा", "व्हिडिओ वर्ग"],
  ["New", "नया", "नवे"],
  ["Watch short YouTube lessons about computer parts and first steps.", "कंप्यूटर के भाग और पहले कदमों के छोटे यूट्यूब पाठ देखें।", "संगणकाचे भाग आणि पहिल्या पायऱ्यांचे छोटे यूट्यूब धडे पाहा."],
  ["Watch", "देखें", "पाहा"],
  ["Create a folder and send a homework file to the class computer.", "फोल्डर बनाएँ और होमवर्क की फाइल कक्षा के कंप्यूटर पर भेजें।", "फोल्डर तयार करा आणि गृहपाठाची फाइल वर्गाच्या संगणकावर पाठवा."],
  ["Try the lab", "लैब आज़माएँ", "प्रयोगशाळा वापरा"],
  ["Spot Fake Messages", "नकली संदेश पहचानें", "खोटे संदेश ओळखा"],
  ["Decide which messages are real school notes and which are tricks.", "पहचानें कौन सा संदेश असली स्कूल नोट है और कौन सा धोखा।", "कोणता संदेश खरा शाळेचा निरोप आहे आणि कोणता फसवणूक आहे ते ओळखा."],
  ["Play", "खेलें", "खेळा"],
  ["Fun Quiz", "मज़ेदार क्विज़", "मजेदार प्रश्नमंजुषा"],
  ["Answer questions and save your score for the certificate.", "प्रश्नों के उत्तर दें और प्रमाणपत्र के लिए अंक सहेजें।", "प्रश्नांची उत्तरे द्या आणि प्रमाणपत्रासाठी गुण जतन करा."],
  ["Start quiz", "क्विज़ शुरू करें", "प्रश्नमंजुषा सुरू करा"],
  ["My Certificate", "मेरा प्रमाणपत्र", "माझे प्रमाणपत्र"],
  ["See your stars and print a Computer Explorer certificate.", "अपने सितारे देखें और कंप्यूटर एक्सप्लोरर प्रमाणपत्र छापें।", "तुमचे तारे पाहा आणि संगणक एक्सप्लोरर प्रमाणपत्र छापा."],
  ["Open", "खोलें", "उघडा"],
  ["About this pathshala", "इस पाठशाला के बारे में", "या पाठशाळेबद्दल"],
  ["Basic Computer Skills helps students who are meeting a computer for the first time. The words stay short. The practice happens on this class computer: folders, files, videos, and a game about fake messages. A teacher can sit beside the student and press the buttons together.", "बेसिक कंप्यूटर स्किल्स उन बच्चों के लिए है जो पहली बार कंप्यूटर देख रहे हैं। शब्द छोटे हैं। अभ्यास इसी कक्षा के कंप्यूटर पर होता है: फोल्डर, फाइल, वीडियो और नकली संदेशों का खेल। शिक्षक बच्चे के पास बैठकर बटन दबा सकते हैं।", "बेसिक संगणक कौशल्ये त्या मुलांसाठी आहेत जी पहिल्यांदा संगणक पाहत आहेत. शब्द छोटे आहेत. सराव या वर्गाच्या संगणकावर होतो: फोल्डर, फाइल, व्हिडिओ आणि खोट्या संदेशांचा खेळ. शिक्षक मुलाशेजारी बसून बटणे दाबू शकतात."],
  ["Class notebook", "कक्षा की नोटबुक", "वर्गाची वही"],
  ["Tell your teacher what you want to learn next. The note stays on this computer.", "शिक्षक को बताएँ कि आगे आप क्या सीखना चाहते हैं। नोट इसी कंप्यूटर पर रहता है।", "पुढे काय शिकायचे आहे ते शिक्षकाला सांगा. नोंद या संगणकावर राहते."],
  ["Class", "कक्षा", "इयत्ता"],
  ["Your message", "आपका संदेश", "तुमचा संदेश"],
  ["Send note", "नोट भेजें", "नोंद पाठवा"],
  ["© 2026 Digital Pathshala. Basic computer skills for rural school students.", "© 2026 डिजिटल पाठशाला। गाँव के स्कूली बच्चों के लिए कंप्यूटर कौशल।", "© 2026 डिजिटल पाठशाळा. ग्रामीण शाळेतील मुलांसाठी संगणक कौशल्ये."],
  ["© 2026 Digital Pathshala. Learning Computer Skills for Everyone.", "© 2026 डिजिटल पाठशाला। सबके लिए कंप्यूटर सीखना।", "© 2026 डिजिटल पाठशाळा. सर्वांसाठी संगणक शिक्षण."],
  ["Digital Pathshala | Basic Computer Skills", "डिजिटल पाठशाला | कंप्यूटर कौशल", "डिजिटल पाठशाळा | संगणक कौशल्ये"],
  ["Computer Basics | Digital Pathshala", "कंप्यूटर की बुनियाद | डिजिटल पाठशाला", "संगणकाची ओळख | डिजिटल पाठशाळा"],
  ["Keyboard & Mouse | Digital Pathshala", "कीबोर्ड और माउस | डिजिटल पाठशाला", "कीबोर्ड आणि माउस | डिजिटल पाठशाळा"],
  ["Internet Basics | Digital Pathshala", "इंटरनेट की बुनियाद | डिजिटल पाठशाला", "इंटरनेटची ओळख | डिजिटल पाठशाळा"],
  ["Computer Knowledge Quiz | Digital Pathshala", "कंप्यूटर क्विज़ | डिजिटल पाठशाला", "संगणक प्रश्नमंजुषा | डिजिटल पाठशाळा"],
  ["Video Class | Digital Pathshala", "वीडियो कक्षा | डिजिटल पाठशाला", "व्हिडिओ वर्ग | डिजिटल पाठशाळा"],
  ["File Lab | Digital Pathshala", "फाइल लैब | डिजिटल पाठशाला", "फाइल प्रयोगशाळा | डिजिटल पाठशाळा"],
  ["Spot Fake Messages | Digital Pathshala", "नकली संदेश | डिजिटल पाठशाला", "खोटे संदेश | डिजिटल पाठशाळा"],
  ["My Certificate | Digital Pathshala", "मेरा प्रमाणपत्र | डिजिटल पाठशाला", "माझे प्रमाणपत्र | डिजिटल पाठशाळा"],
  ["/ Computer Basics", "/ कंप्यूटर की बुनियाद", "/ संगणकाची ओळख"],
  ["Basics", "बुनियाद", "ओळख"],
  ["Welcome to your first computer lesson! Let's understand what a computer is, how it works and what its main parts do.", "आपके पहले कंप्यूटर पाठ में स्वागत है! जानें कि कंप्यूटर क्या है, वह कैसे काम करता है और उसके मुख्य भाग क्या करते हैं।", "तुमच्या पहिल्या संगणक धड्यात स्वागत आहे! संगणक काय आहे, तो कसा काम करतो आणि त्याचे मुख्य भाग काय करतात ते समजून घ्या."],
  ["What is a Computer?", "कंप्यूटर क्या है?", "संगणक म्हणजे काय?"],
  ["A computer is an electronic machine that accepts data, processes it and gives us useful information.", "कंप्यूटर एक इलेक्ट्रॉनिक मशीन है जो आँकड़े लेती है, उन पर काम करती है और हमें उपयोगी जानकारी देती है।", "संगणक हे इलेक्ट्रॉनिक यंत्र आहे जे माहिती घेते, तिच्यावर काम करते आणि उपयुक्त माहिती देते."],
  ["We can use computers to study, write, draw pictures, calculate numbers, watch videos and communicate with others.", "हम कंप्यूटर से पढ़ सकते हैं, लिख सकते हैं, चित्र बना सकते हैं, हिसाब कर सकते हैं, वीडियो देख सकते हैं और दूसरों से बात कर सकते हैं।", "संगणकावर आपण अभ्यास, लेखन, चित्र काढणे, हिशोब, व्हिडिओ आणि इतरांशी बोलणे करू शकतो."],
  ["Example:", "उदाहरण:", "उदाहरण:"],
  ["When you type 5 + 5 into a calculator on a computer, it processes the numbers and displays the answer 10.", "जब आप कंप्यूटर के कैलकुलेटर में 5 + 5 लिखते हैं, वह संख्याओं पर काम करके उत्तर 10 दिखाता है।", "जेव्हा तुम्ही संगणकाच्या कॅल्क्युलेटरमध्ये 5 + 5 टाकता, तो हिशोब करून उत्तर 10 दाखवतो."],
  ["🖥️ Main Parts of a Computer", "🖥️ कंप्यूटर के मुख्य भाग", "🖥️ संगणकाचे मुख्य भाग"],
  ["A desktop computer has several important parts that work together.", "डेस्कटॉप कंप्यूटर के कई ज़रूरी भाग मिलकर काम करते हैं।", "डेस्कटॉप संगणकाचे अनेक महत्त्वाचे भाग एकत्र काम करतात."],
  ["Displays text, pictures, videos and other information.", "लेख, चित्र, वीडियो और दूसरी जानकारी दिखाता है।", "मजकूर, चित्रे, व्हिडिओ आणि इतर माहिती दाखवतो."],
  ["Used to type letters, numbers and symbols.", "अक्षर, संख्या और चिह्न लिखने के लिए।", "अक्षरे, अंक आणि चिन्हे लिहिण्यासाठी."],
  ["Helps us point, click, select and move items.", "चीज़ों को दिखाने, क्लिक करने, चुनने और हिलाने में मदद करता है।", "गोष्टी दाखवणे, क्लिक करणे, निवडणे आणि हलवणे यात मदत करतो."],
  ["The processor executes instructions and processes data.", "प्रोसेसर निर्देशों को चलाता है और आँकड़ों पर काम करता है।", "प्रोसेसर सूचना चालवतो आणि माहितीवर काम करतो."],
  ["Speakers", "स्पीकर", "स्पीकर"],
  ["Produce sound, music and other audio.", "आवाज़, संगीत और दूसरी ध्वनियाँ निकालते हैं।", "आवाज, संगीत आणि इतर ध्वनी काढतात."],
  ["Printer", "प्रिंटर", "प्रिंटर"],
  ["Prints documents and pictures on paper.", "कागज़ पर दस्तावेज़ और चित्र छापता है।", "कागदावर कागदपत्रे आणि चित्रे छापतो."],
  ["⚙️ Hardware and Software", "⚙️ हार्डवेयर और सॉफ्टवेयर", "⚙️ हार्डवेअर आणि सॉफ्टवेअर"],
  ["Computer Hardware", "कंप्यूटर हार्डवेयर", "संगणक हार्डवेअर"],
  ["Hardware means the physical parts of a computer that we can see and touch.", "हार्डवेयर कंप्यूटर के वे असली भाग हैं जिन्हें हम देख और छू सकते हैं।", "हार्डवेअर म्हणजे संगणकाचे ते भाग जे आपण पाहू आणि स्पर्श करू शकतो."],
  ["Examples:", "उदाहरण:", "उदाहरणे:"],
  ["Monitor, keyboard, mouse, CPU, printer and speakers.", "मॉनिटर, कीबोर्ड, माउस, सीपीयू, प्रिंटर और स्पीकर।", "मॉनिटर, कीबोर्ड, माउस, सीपीयू, प्रिंटर आणि स्पीकर."],
  ["Computer Software", "कंप्यूटर सॉफ्टवेयर", "संगणक सॉफ्टवेअर"],
  ["Software is a set of programs or instructions that tells a computer what to do.", "सॉफ्टवेयर प्रोग्राम या निर्देश हैं जो कंप्यूटर को बताते हैं कि क्या करना है।", "सॉफ्टवेअर म्हणजे प्रोग्राम किंवा सूचना ज्या संगणकाला काय करायचे ते सांगतात."],
  ["Windows, Paint, MS Word and web browsers.", "विंडोज़, पेंट, एमएस वर्ड और वेब ब्राउज़र।", "विंडोज, पेंट, एमएस वर्ड आणि वेब ब्राउझर."],
  ["🧑‍💻 Types of Computers", "🧑‍💻 कंप्यूटर के प्रकार", "🧑‍💻 संगणकाचे प्रकार"],
  ["Desktop", "डेस्कटॉप", "डेस्कटॉप"],
  ["A computer designed to be used at a desk.", "मेज़ पर इस्तेमाल होने वाला कंप्यूटर।", "मेजावर वापरण्यासाठी बनवलेला संगणक."],
  ["Laptop", "लैपटॉप", "लॅपटॉप"],
  ["A portable computer that we can carry.", "एक छोटा कंप्यूटर जिसे हम साथ ले जा सकते हैं।", "सोबत नेता येणारा संगणक."],
  ["Tablet", "टैबलेट", "टॅबलेट"],
  ["A portable touchscreen computing device.", "छूकर चलाया जाने वाला छोटा कंप्यूटर।", "स्पर्शाने चालणारे छोटे संगणक साधन."],
  ["🌟 Learning Tip", "🌟 सीखने की सलाह", "🌟 शिकण्याचा सल्ला"],
  ["Try to identify a monitor, keyboard, mouse and CPU in your school computer lab. Learning by practicing makes it easier to remember computer parts.", "स्कूल की कंप्यूटर लैब में मॉनिटर, कीबोर्ड, माउस और सीपीयू पहचानने की कोशिश करें। अभ्यास से भाग याद रह जाते हैं।", "शाळेच्या संगणक प्रयोगशाळेत मॉनिटर, कीबोर्ड, माउस आणि सीपीयू ओळखण्याचा प्रयत्न करा. सरावाने भाग लक्षात राहतात."],
  ["Watch and learn", "देखें और सीखें", "पाहा आणि शिका"],
  ["Watch this short video about the parts of a computer.", "कंप्यूटर के भागों का यह छोटा वीडियो देखें।", "संगणकाच्या भागांचा हा छोटा व्हिडिओ पाहा."],
  ["More video lessons", "और वीडियो पाठ", "अधिक व्हिडिओ धडे"],
  ["🎯 Test Your Knowledge", "🎯 अपनी जानकारी जाँचें", "🎯 तुमचे ज्ञान तपासा"],
  ["Have you understood the basic parts of a computer? Try a short quiz to check your knowledge.", "क्या आप कंप्यूटर के बुनियादी भाग समझ गए? छोटा क्विज़ आज़माएँ।", "संगणकाचे मूलभूत भाग समजले का? छोटी प्रश्नमंजुषा सोडवा."],
  ["Start Computer Quiz →", "कंप्यूटर क्विज़ शुरू करें →", "संगणक प्रश्नमंजुषा सुरू करा →"],
  ["← All Lessons", "← सभी पाठ", "← सर्व धडे"],
  ["Next Lesson: Keyboard & Mouse →", "अगला पाठ: कीबोर्ड और माउस →", "पुढील धडा: कीबोर्ड आणि माउस →"],
  ["/ Keyboard & Mouse", "/ कीबोर्ड और माउस", "/ कीबोर्ड आणि माउस"],
  ["& Mouse", "और माउस", "आणि माउस"],
  ["Learn how to use a keyboard and mouse. Practice typing, understand important keys and discover how to control a computer easily.", "कीबोर्ड और माउस इस्तेमाल करना सीखें। टाइप करने का अभ्यास करें, ज़रूरी कुंजियाँ समझें और कंप्यूटर आसानी से चलाना सीखें।", "कीबोर्ड आणि माउस वापरायला शिका. टाइप करण्याचा सराव करा, महत्त्वाच्या कळा समजून घ्या आणि संगणक सहज चालवा."],
  ["What is a Keyboard?", "कीबोर्ड क्या है?", "कीबोर्ड म्हणजे काय?"],
  ["A keyboard is an input device used to enter letters, numbers and symbols into a computer.", "कीबोर्ड एक इनपुट उपकरण है जिससे हम कंप्यूटर में अक्षर, संख्या और चिह्न डालते हैं।", "कीबोर्ड हे इनपुट साधन आहे ज्याने आपण संगणकात अक्षरे, अंक आणि चिन्हे टाकतो."],
  ["We use a keyboard to type our names, write documents, enter numbers and give instructions to a computer.", "हम कीबोर्ड से अपना नाम लिखते हैं, दस्तावेज़ बनाते हैं, संख्या डालते हैं और कंप्यूटर को निर्देश देते हैं।", "कीबोर्डने आपण नाव लिहितो, कागदपत्रे लिहितो, अंक टाकतो आणि संगणकाला सूचना देतो."],
  ["💡 Did You Know?", "💡 क्या आप जानते हैं?", "💡 तुम्हाला माहीत आहे का?"],
  ["The keyboard is one of the most commonly used input devices in a computer.", "कीबोर्ड कंप्यूटर के सबसे ज़्यादा इस्तेमाल होने वाले इनपुट उपकरणों में से एक है।", "कीबोर्ड हे संगणकातील सर्वाधिक वापरले जाणारे इनपुट साधन आहे."],
  ["🔤 Different Types of Keyboard Keys", "🔤 कीबोर्ड की अलग-अलग कुंजियाँ", "🔤 कीबोर्डच्या वेगवेगळ्या कळा"],
  ["A keyboard has different types of keys. Each key has a specific purpose.", "कीबोर्ड में अलग-अलग तरह की कुंजियाँ होती हैं। हर कुंजी का अपना काम है।", "कीबोर्डवर वेगवेगळ्या कळा असतात. प्रत्येक कळीचे काम वेगळे असते."],
  ["Alphabet Keys", "अक्षर कुंजियाँ", "अक्षर कळा"],
  ["These keys are used to type letters from A to Z.", "इनसे A से Z तक अक्षर लिखते हैं।", "यांच्यावर A ते Z अक्षरे लिहितात."],
  ["Number Keys", "संख्या कुंजियाँ", "अंक कळा"],
  ["These keys are used to type numbers from 0 to 9.", "इनसे 0 से 9 तक संख्या लिखते हैं।", "यांच्यावर 0 ते 9 अंक लिहितात."],
  ["Enter Key", "एंटर कुंजी", "एंटर कळ"],
  ["Used to start a new line or confirm an action.", "नई पंक्ति शुरू करने या काम पक्का करने के लिए।", "नवीन ओळ सुरू करण्यासाठी किंवा काम निश्चित करण्यासाठी."],
  ["Backspace Key", "बैकस्पेस कुंजी", "बॅकस्पेस कळ"],
  ["Deletes the character to the left of the cursor.", "कर्सर के बाईं ओर का अक्षर मिटाती है।", "कर्सरच्या डावीकडील अक्षर पुसते."],
  ["Shift Key", "शिफ्ट कुंजी", "शिफ्ट कळ"],
  ["Helps type capital letters and upper symbols.", "बड़े अक्षर और ऊपर वाले चिह्न लिखने में मदद करती है।", "मोठी अक्षरे आणि वरची चिन्हे लिहिण्यास मदत करते."],
  ["Spacebar", "स्पेसबार", "स्पेसबार"],
  ["Adds a blank space between words while typing.", "लिखते समय शब्दों के बीच खाली जगह डालती है।", "लिहिताना शब्दांमध्ये मोकळी जागा टाकते."],
  ["🎮 Interactive Keyboard", "🎮 छूकर सीखने वाला कीबोर्ड", "🎮 स्पर्श करून शिकणारा कीबोर्ड"],
  ["Click any key below to learn what it does. This is a visual keyboard demonstration.", "नीचे कोई भी कुंजी दबाकर जानें कि वह क्या करती है। यह दिखाने वाला कीबोर्ड है।", "खालील कोणतीही कळ दाबून ती काय करते ते जाणून घ्या. हा दाखवण्यासाठी कीबोर्ड आहे."],
  ["Selected key", "चुनी हुई कुंजी", "निवडलेली कळ"],
  ["Click any key!", "कोई कुंजी दबाएँ!", "कोणतीही कळ दाबा!"],
  ["The key's function will appear here.", "कुंजी का काम यहाँ दिखेगा।", "कळीचे काम येथे दिसेल."],
  ["🖱️ What is a Mouse?", "🖱️ माउस क्या है?", "🖱️ माउस म्हणजे काय?"],
  ["A mouse is an input device used to move the pointer on a computer screen.", "माउस एक इनपुट उपकरण है जो स्क्रीन पर तीर हिलाता है।", "माउस हे इनपुट साधन आहे जे स्क्रीनवरील बाण हलवते."],
  ["It helps us select files, open applications, click buttons and drag objects.", "यह फाइल चुनने, ऐप खोलने, बटन दबाने और चीज़ें खींचने में मदद करता है।", "फाइल निवडणे, अॅप उघडणे, बटणे दाबणे आणि गोष्टी ओढणे यात मदत करतो."],
  ["Left Click", "बायाँ क्लिक", "डावे क्लिक"],
  ["Used to select files, buttons and objects. Double-clicking can open files and applications.", "फाइल, बटन और चीज़ें चुनने के लिए। दो बार क्लिक करने से फाइल और ऐप खुल सकते हैं।", "फाइल, बटणे आणि गोष्टी निवडण्यासाठी. दोनदा क्लिक केल्याने फाइल आणि अॅप उघडू शकतात."],
  ["Right Click", "दायाँ क्लिक", "उजवे क्लिक"],
  ["Opens a menu with additional options for a selected item.", "चुनी हुई चीज़ का और विकल्पों वाला मेनू खोलता है।", "निवडलेल्या गोष्टीचा अधिक पर्यायांचा मेनू उघडतो."],
  ["Scroll Wheel", "स्क्रॉल पहिया", "स्क्रोल चाक"],
  ["Used to move up and down through a document or webpage.", "दस्तावेज़ या वेबपेज को ऊपर-नीचे करने के लिए।", "कागदपत्र किंवा वेबपेज वर-खाली नेण्यासाठी."],
  ["⌨️ Let's Practice Typing!", "⌨️ टाइप करने का अभ्यास!", "⌨️ टाइप करण्याचा सराव!"],
  ["Type the word shown below into the text box. This activity will help you improve your typing skills.", "नीचे दिखाया शब्द बॉक्स में लिखें। इससे टाइप करने का अभ्यास होगा।", "खाली दिसणारा शब्द चौकटीत लिहा. यामुळे टाइप करण्याचा सराव होईल."],
  ["Check Answer", "उत्तर जाँचें", "उत्तर तपासा"],
  ["Next Word →", "अगला शब्द →", "पुढील शब्द →"],
  ["🌟 Tips for Beginners", "🌟 शुरुआत के सुझाव", "🌟 सुरुवातीचे सल्ले"],
  ["✔ Sit comfortably while using a computer.", "✔ कंप्यूटर इस्तेमाल करते समय आराम से बैठें।", "✔ संगणक वापरताना आरामात बसा."],
  ["✔ Keep your fingers relaxed while typing.", "✔ टाइप करते समय उंगलियाँ ढीली रखें।", "✔ टाइप करताना बोटे सैल ठेवा."],
  ["✔ Practice typing every day.", "✔ हर दिन टाइप करने का अभ्यास करें।", "✔ दररोज टाइप करण्याचा सराव करा."],
  ["✔ Use the mouse gently.", "✔ माउस धीरे से इस्तेमाल करें।", "✔ माउस हळूवार वापरा."],
  ["✔ Take short breaks while learning.", "✔ सीखते समय छोटे विराम लें।", "✔ शिकताना छोटे विश्रांती घ्या."],
  ["← Previous: Computer Basics", "← पिछला: कंप्यूटर की बुनियाद", "← मागील: संगणकाची ओळख"],
  ["Next: Internet Basics →", "अगला: इंटरनेट की बुनियाद →", "पुढील: इंटरनेटची ओळख →"],
  ["/ Internet Basics", "/ इंटरनेट की बुनियाद", "/ इंटरनेटची ओळख"],
  ["Discover the world of the internet! Learn about websites, browsers, search engines, email and how to stay safe online.", "इंटरनेट की दुनिया देखें! वेबसाइट, ब्राउज़र, सर्च इंजन, ईमेल और ऑनलाइन सुरक्षा सीखें।", "इंटरनेटचे जग पाहा! वेबसाइट, ब्राउझर, शोधयंत्र, ईमेल आणि ऑनलाइन सुरक्षितता शिका."],
  ["🌍 What is the Internet?", "🌍 इंटरनेट क्या है?", "🌍 इंटरनेट म्हणजे काय?"],
  ["The internet is a worldwide network that connects computers, mobile phones and other devices so they can share information.", "इंटरनेट एक विश्वव्यापी जाल है जो कंप्यूटर, मोबाइल और दूसरे उपकरणों को जोड़ता है ताकि वे जानकारी बाँट सकें।", "इंटरनेट हे जागतिक जाळे आहे जे संगणक, मोबाइल आणि इतर साधने जोडते म्हणजे ती माहिती वाटू शकतात."],
  ["We use the internet to learn new things, watch educational videos, communicate with people and find information.", "हम इंटरनेट से नई बातें सीखते हैं, पढ़ाई के वीडियो देखते हैं, लोगों से बात करते हैं और जानकारी ढूँढते हैं।", "इंटरनेटवर आपण नवीन गोष्टी शिकतो, अभ्यासाचे व्हिडिओ पाहतो, लोकांशी बोलतो आणि माहिती शोधतो."],
  ["Students can use the internet to search for information about science, mathematics, history and other subjects.", "विद्यार्थी विज्ञान, गणित, इतिहास और दूसरे विषयों की जानकारी खोज सकते हैं।", "विद्यार्थी विज्ञान, गणित, इतिहास आणि इतर विषयांची माहिती शोधू शकतात."],
  ["💡 Uses of the Internet", "💡 इंटरनेट के उपयोग", "💡 इंटरनेटचे उपयोग"],
  ["The internet helps us in many different areas of our daily lives.", "इंटरनेट रोज़मर्रा की ज़िंदगी के कई कामों में मदद करता है।", "इंटरनेट दैनंदिन आयुष्यातील अनेक कामांत मदत करते."],
  ["Online Education", "ऑनलाइन पढ़ाई", "ऑनलाइन शिक्षण"],
  ["Learn new topics, read e-books and watch educational videos.", "नए विषय सीखें, ई-पुस्तकें पढ़ें और पढ़ाई के वीडियो देखें।", "नवे विषय शिका, ई-पुस्तके वाचा आणि अभ्यासाचे व्हिडिओ पाहा."],
  ["Communication", "बातचीत", "संवाद"],
  ["Send emails, messages and communicate with others online.", "ईमेल और संदेश भेजें और ऑनलाइन दूसरों से बात करें।", "ईमेल आणि संदेश पाठवा आणि ऑनलाइन इतरांशी बोला."],
  ["Finding Information", "जानकारी ढूँढना", "माहिती शोधणे"],
  ["Search for information about different topics and subjects.", "अलग-अलग विषयों की जानकारी खोजें।", "वेगवेगळ्या विषयांची माहिती शोधा."],
  ["Watching Videos", "वीडियो देखना", "व्हिडिओ पाहणे"],
  ["Watch educational videos, tutorials and documentaries.", "पढ़ाई के वीडियो, ट्यूटोरियल और डॉक्यूमेंट्री देखें।", "अभ्यासाचे व्हिडिओ, शिकवणारे व्हिडिओ आणि माहितीपट पाहा."],
  ["Online Services", "ऑनलाइन सेवाएँ", "ऑनलाइन सेवा"],
  ["Access useful public services, forms and other online resources.", "उपयोगी सरकारी सेवाएँ, फॉर्म और ऑनलाइन सामग्री खोलें।", "उपयुक्त सार्वजनिक सेवा, फॉर्म आणि ऑनलाइन साहित्य उघडा."],
  ["Maps & Directions", "नक्शे और रास्ते", "नकाशे आणि दिशा"],
  ["Find places, explore maps and understand directions.", "जगहें ढूँढें, नक्शे देखें और रास्ता समझें।", "ठिकाणे शोधा, नकाशे पाहा आणि दिशा समजून घ्या."],
  ["🌐 What is a Web Browser?", "🌐 वेब ब्राउज़र क्या है?", "🌐 वेब ब्राउझर म्हणजे काय?"],
  ["A web browser is a software application that helps us open and view websites on the internet.", "वेब ब्राउज़र वह सॉफ्टवेयर है जिससे हम इंटरनेट पर वेबसाइट खोलते और देखते हैं।", "वेब ब्राउझर हे सॉफ्टवेअर आहे ज्याने आपण इंटरनेटवरील वेबसाइट उघडतो आणि पाहतो."],
  ["Google Chrome", "गूगल क्रोम", "गुगल क्रोम"],
  ["A popular browser used to visit websites.", "वेबसाइट खोलने वाला एक जाना-पहचाना ब्राउज़र।", "वेबसाइट उघडण्यासाठी वापरला जाणारा ओळखीचा ब्राउझर."],
  ["Mozilla Firefox", "मोज़िला फ़ायरफ़ॉक्स", "मोझिला फायरफॉक्स"],
  ["A web browser for accessing websites.", "वेबसाइट खोलने वाला एक ब्राउज़र।", "वेबसाइट उघडणारा ब्राउझर."],
  ["Microsoft Edge", "माइक्रोसॉफ्ट एज", "मायक्रोसॉफ्ट एज"],
  ["A browser developed by Microsoft.", "माइक्रोसॉफ्ट का बनाया ब्राउज़र।", "मायक्रोसॉफ्टने बनवलेला ब्राउझर."],
  ["Safari", "सफ़ारी", "सफारी"],
  ["A web browser commonly used on Apple devices.", "ऐपल उपकरणों पर अक्सर इस्तेमाल होने वाला ब्राउज़र।", "ॲपल साधनांवर नेहमी वापरला जाणारा ब्राउझर."],
  ["Remember:", "याद रखें:", "लक्षात ठेवा:"],
  ["A web browser is an application used to visit websites. A search engine is a service used to find information online.", "वेब ब्राउज़र वेबसाइट खोलने का ऐप है। सर्च इंजन ऑनलाइन जानकारी ढूँढने की सेवा है।", "वेब ब्राउझर वेबसाइट उघडणारे अॅप आहे. शोधयंत्र ऑनलाइन माहिती शोधणारी सेवा आहे."],
  ["🔎 What is a Search Engine?", "🔎 सर्च इंजन क्या है?", "🔎 शोधयंत्र म्हणजे काय?"],
  ["A search engine helps us find information on the internet by entering words or questions into a search box.", "सर्च इंजन खोज बॉक्स में शब्द या सवाल लिखकर इंटरनेट पर जानकारी ढूँढने में मदद करता है।", "शोधयंत्र शोध चौकटीत शब्द किंवा प्रश्न लिहून इंटरनेटवर माहिती शोधायला मदत करते."],
  ["Google", "गूगल", "गुगल"],
  ["Helps people find websites, images, videos and information.", "लोगों को वेबसाइट, चित्र, वीडियो और जानकारी ढूँढने में मदद करता है।", "लोकांना वेबसाइट, चित्रे, व्हिडिओ आणि माहिती शोधायला मदत करते."],
  ["Bing", "बिंग", "बिंग"],
  ["A search engine that helps users discover information.", "एक सर्च इंजन जो जानकारी खोजने में मदद करता है।", "माहिती शोधायला मदत करणारे शोधयंत्र."],
  ["DuckDuckGo", "डकडकगो", "डकडकगो"],
  ["A search engine with a focus on user privacy.", "एक सर्च इंजन जो उपयोगकर्ता की निजता का ध्यान रखता है।", "वापरकर्त्याच्या गोपनीयतेकडे लक्ष देणारे शोधयंत्र."],
  ["🧑‍💻 How to Search on the Internet", "🧑‍💻 इंटरनेट पर कैसे खोजें", "🧑‍💻 इंटरनेटवर कसे शोधावे"],
  ["Follow these simple steps to search for information online.", "ऑनलाइन जानकारी खोजने के ये आसान कदम अपनाएँ।", "ऑनलाइन माहिती शोधण्यासाठी या सोप्या पायऱ्या करा."],
  ["Open a web browser on your device.", "अपने उपकरण पर वेब ब्राउज़र खोलें।", "तुमच्या साधनावर वेब ब्राउझर उघडा."],
  ["Open a search engine or use its search bar.", "सर्च इंजन खोलें या उसकी खोज पट्टी इस्तेमाल करें।", "शोधयंत्र उघडा किंवा त्याची शोध पट्टी वापरा."],
  ["Type the topic you want to learn.", "जो विषय सीखना है उसे लिखें।", "जो विषय शिकायचा आहे तो लिहा."],
  ["Review the results and open a useful website.", "नतीजे देखें और एक उपयोगी वेबसाइट खोलें।", "निकाल पाहा आणि उपयुक्त वेबसाइट उघडा."],
  ["📧 What is Email?", "📧 ईमेल क्या है?", "📧 ईमेल म्हणजे काय?"],
  ["Email stands for Electronic Mail. It is a way to send and receive digital messages over the internet.", "ईमेल का मतलब इलेक्ट्रॉनिक मेल है। इससे इंटरनेट पर डिजिटल संदेश भेजते और पाते हैं।", "ईमेल म्हणजे इलेक्ट्रॉनिक मेल. त्यातून इंटरनेटवर डिजिटल संदेश पाठवतात आणि मिळवतात."],
  ["Students can use email to communicate with teachers, receive school announcements and share documents.", "विद्यार्थी ईमेल से शिक्षकों से बात कर सकते हैं, स्कूल की सूचनाएँ पा सकते हैं और दस्तावेज़ बाँट सकते हैं।", "विद्यार्थी ईमेलने शिक्षकांशी बोलू शकतात, शाळेच्या सूचना मिळवू शकतात आणि कागदपत्रे वाटू शकतात."],
  ["A student can send an email to a teacher to ask a question about a school assignment.", "विद्यार्थी शिक्षक को स्कूल के काम के बारे में सवाल पूछने के लिए ईमेल भेज सकता है।", "विद्यार्थी शाळेच्या कामाबद्दल प्रश्न विचारण्यासाठी शिक्षकाला ईमेल पाठवू शकतो."],
  ["🛡️ Stay Safe on the Internet", "🛡️ इंटरनेट पर सुरक्षित रहें", "🛡️ इंटरनेटवर सुरक्षित राहा"],
  ["The internet is useful for learning, but it is important to protect your personal information.", "इंटरनेट पढ़ाई के लिए उपयोगी है, पर अपनी निजी जानकारी बचाना ज़रूरी है।", "इंटरनेट अभ्यासासाठी उपयुक्त आहे, पण वैयक्तिक माहिती जपणे महत्त्वाचे आहे."],
  ["Keep Passwords Private", "पासवर्ड गुप्त रखें", "पासवर्ड गुप्त ठेवा"],
  ["Never share your password with strangers. Ask a trusted adult for help when needed.", "अपना पासवर्ड अनजान लोगों को कभी न बताएँ। ज़रूरत हो तो भरोसेमंद बड़े से मदद माँगें।", "पासवर्ड अनोळखी लोकांना कधी सांगू नका. गरज पडल्यास विश्वासू मोठ्यांची मदत घ्या."],
  ["Avoid Unknown Links", "अनजान लिंक से बचें", "अनोळखी लिंक टाळा"],
  ["Do not click suspicious links or download unknown files.", "संदिग्ध लिंक पर क्लिक न करें और अनजान फाइल डाउनलोड न करें।", "संशयास्पद लिंकवर क्लिक करू नका आणि अनोळखी फाइल डाउनलोड करू नका."],
  ["Protect Personal Details", "निजी जानकारी बचाएँ", "वैयक्तिक माहिती जपा"],
  ["Do not share your address, phone number or school details publicly.", "अपना पता, फोन नंबर या स्कूल की जानकारी सार्वजनिक रूप से न बताएँ।", "पत्ता, फोन नंबर किंवा शाळेची माहिती सर्वांसमोर सांगू नका."],
  ["Ask a Trusted Adult", "भरोसेमंद बड़े से पूछें", "विश्वासू मोठ्यांना विचारा"],
  ["Tell a parent or teacher if you see something confusing or uncomfortable.", "अगर कुछ उलझा हुआ या असहज लगे तो माता-पिता या शिक्षक को बताएँ।", "काही गोंधळात टाकणारे किंवा अस्वस्थ वाटले तर पालकांना किंवा शिक्षकाला सांगा."],
  ["Play: spot fake messages", "खेलें: नकली संदेश पहचानें", "खेळा: खोटे संदेश ओळखा"],
  ["🎯 Test Your Internet Knowledge", "🎯 इंटरनेट की जानकारी जाँचें", "🎯 इंटरनेटचे ज्ञान तपासा"],
  ["Select the correct answer to test what you have learned.", "जो सीखा है उसे जाँचने के लिए सही उत्तर चुनें।", "जे शिकलात ते तपासण्यासाठी बरोबर उत्तर निवडा."],
  ["What is a web browser used for?", "वेब ब्राउज़र किस काम आता है?", "वेब ब्राउझर कशासाठी वापरतात?"],
  ["A. To cook food", "A. खाना बनाने के लिए", "A. जेवण शिजवण्यासाठी"],
  ["B. To open websites", "B. वेबसाइट खोलने के लिए", "B. वेबसाइट उघडण्यासाठी"],
  ["C. To wash clothes", "C. कपड़े धोने के लिए", "C. कपडे धुण्यासाठी"],
  ["D. To print money", "D. पैसे छापने के लिए", "D. पैसे छापण्यासाठी"],
  ["Next Question →", "अगला प्रश्न →", "पुढील प्रश्न →"],
  ["Try searching for educational information with your teacher or a trusted adult. Practice using the internet responsibly and always check if the information comes from a reliable source.", "शिक्षक या भरोसेमंद बड़े के साथ पढ़ाई की जानकारी खोजें। इंटरनेट ज़िम्मेदारी से इस्तेमाल करें और देखें कि जानकारी भरोसेमंद जगह से है।", "शिक्षक किंवा विश्वासू मोठ्यांसोबत अभ्यासाची माहिती शोधा. इंटरनेट जबाबदारीने वापरा आणि माहिती विश्वासू ठिकाणाहून आहे का ते पाहा."],
  ["← Previous: Keyboard & Mouse", "← पिछला: कीबोर्ड और माउस", "← मागील: कीबोर्ड आणि माउस"],
  ["Next: Computer Quiz →", "अगला: कंप्यूटर क्विज़ →", "पुढील: संगणक प्रश्नमंजुषा →"],
  ["Computer Knowledge Quiz", "कंप्यूटर ज्ञान क्विज़", "संगणक ज्ञान प्रश्नमंजुषा"],
  ["Test your knowledge of computers, keyboards, and the internet. Choose the correct answer for each question.", "कंप्यूटर, कीबोर्ड और इंटरनेट की जानकारी जाँचें। हर प्रश्न का सही उत्तर चुनें।", "संगणक, कीबोर्ड आणि इंटरनेटचे ज्ञान तपासा. प्रत्येक प्रश्नाचे बरोबर उत्तर निवडा."],
  ["Next Question", "अगला प्रश्न", "पुढील प्रश्न"],
  ["See Result", "नतीजा देखें", "निकाल पाहा"],
  ["Quiz Completed!", "क्विज़ पूरा हुआ!", "प्रश्नमंजुषा पूर्ण!"],
  ["Try Again", "फिर से कोशिश करें", "पुन्हा प्रयत्न करा"],
  ["See my certificate", "मेरा प्रमाणपत्र देखें", "माझे प्रमाणपत्र पाहा"],
  ["← Back to Home", "← होम पर वापस", "← मुख्यपृष्ठावर परत"],
  ["Correct answer! Well done.", "सही उत्तर! बहुत अच्छे।", "बरोबर उत्तर! शाब्बास."],
  ["Not quite! The correct answer is highlighted.", "पूरा सही नहीं! सही उत्तर चमक रहा है।", "अगदी बरोबर नाही! बरोबर उत्तर ठळक केले आहे."],
  ["Excellent! You answered every question correctly.", "शानदार! आपने हर प्रश्न सही किया।", "उत्तम! तुम्ही प्रत्येक प्रश्न बरोबर सोडवला."],
  ["Great work! Keep practising to learn even more.", "बहुत अच्छा! और सीखने के लिए अभ्यास जारी रखें।", "खूप छान! आणखी शिकण्यासाठी सराव सुरू ठेवा."],
  ["Good effort! Review the lessons and try again.", "अच्छी कोशिश! पाठ दोहराएँ और फिर कोशिश करें।", "चांगला प्रयत्न! धडे पुन्हा वाचा आणि परत प्रयत्न करा."],
  ["Keep learning! You can improve with practice.", "सीखते रहें! अभ्यास से सुधार होगा।", "शिकत राहा! सरावाने सुधारणा होईल."],
  ["Your Score: {score} / {total}", "आपके अंक: {score} / {total}", "तुमचे गुण: {score} / {total}"],
  ["Question {n} of {total}", "प्रश्न {n} / {total}", "प्रश्न {n} / {total}"],
  ["Your score is saved for {name}.", "{name} के अंक सहेज लिए गए हैं।", "{name} चे गुण जतन झाले."],
  ["Type your name on the home page to save this score on your certificate.", "यह अंक प्रमाणपत्र पर सहेजने के लिए होम पेज पर अपना नाम लिखें।", "हे गुण प्रमाणपत्रावर जतन करण्यासाठी मुख्यपृष्ठावर नाव लिहा."],
  ["The class server is off, so this score stayed on this page only.", "कक्षा का सर्वर बंद है, इसलिए यह अंक सिर्फ इस पेज पर रहा।", "वर्गाचा सर्व्हर बंद आहे, म्हणून हे गुण फक्त या पानावर राहिले."],
  ["What is the brain of a computer called?", "कंप्यूटर के दिमाग को क्या कहते हैं?", "संगणकाच्या मेंदूला काय म्हणतात?"],
  ["Which device is used to type letters?", "अक्षर लिखने के लिए कौन सा उपकरण है?", "अक्षरे लिहिण्यासाठी कोणते साधन वापरतात?"],
  ["Which device displays information on a computer?", "कंप्यूटर पर जानकारी कौन सा उपकरण दिखाता है?", "संगणकावर माहिती कोणते साधन दाखवते?"],
  ["Which of these is a web browser?", "इनमें से वेब ब्राउज़र कौन सा है?", "यापैकी वेब ब्राउझर कोणता आहे?"],
  ["What is the full form of CPU?", "सीपीयू का पूरा नाम क्या है?", "सीपीयूचे पूर्ण रूप काय आहे?"],
  ["Which key is used to create a space between words?", "शब्दों के बीच जगह बनाने के लिए कौन सी कुंजी है?", "शब्दांमध्ये जागा करण्यासाठी कोणती कळ वापरतात?"],
  ["What do we use to browse websites?", "वेबसाइट देखने के लिए हम क्या इस्तेमाल करते हैं?", "वेबसाइट पाहण्यासाठी आपण काय वापरतो?"],
  ["Which device is commonly used to move the pointer?", "तीर हिलाने के लिए आमतौर पर कौन सा उपकरण है?", "बाण हलवण्यासाठी सहसा कोणते साधन वापरतात?"],
  ["What should you do with your password?", "पासवर्ड के साथ आपको क्या करना चाहिए?", "पासवर्डचे तुम्ही काय करावे?"],
  ["Which of these is used to send electronic messages?", "इलेक्ट्रॉनिक संदेश भेजने के लिए इनमें से क्या है?", "इलेक्ट्रॉनिक संदेश पाठवण्यासाठी यापैकी काय वापरतात?"],
  ["What is a folder used for?", "फोल्डर किस काम आता है?", "फोल्डर कशासाठी वापरतात?"],
  ["A message says you won a prize and asks for your OTP. What should you do?", "एक संदेश कहता है कि आपने इनाम जीता और OTP माँगता है। आपको क्या करना चाहिए?", "एक संदेश म्हणतो तुम्ही बक्षीस जिंकले आणि OTP मागतो. तुम्ही काय करावे?"],
  ["Where can you send a homework file in this class lab?", "इस कक्षा की लैब में होमवर्क की फाइल कहाँ भेज सकते हैं?", "या वर्गाच्या प्रयोगशाळेत गृहपाठाची फाइल कुठे पाठवता येते?"],
  ["Which of these is hardware?", "इनमें से हार्डवेयर कौन सा है?", "यापैकी हार्डवेअर कोणते आहे?"],
  ["Printer", "प्रिंटर", "प्रिंटर"],
  ["Speaker", "स्पीकर", "स्पीकर"],
  ["Scanner", "स्कैनर", "स्कॅनर"],
  ["Microphone", "माइक्रोफोन", "मायक्रोफोन"],
  ["MS Paint", "एमएस पेंट", "एमएस पेंट"],
  ["Calculator", "कैलकुलेटर", "कॅल्क्युलेटर"],
  ["Notepad", "नोटपैड", "नोटपॅड"],
  ["Computer Personal Unit", "कंप्यूटर पर्सनल यूनिट", "कॉम्प्युटर पर्सनल युनिट"],
  ["Central Processing Unit", "सेंट्रल प्रोसेसिंग यूनिट", "सेंट्रल प्रोसेसिंग युनिट"],
  ["Central Program Utility", "सेंट्रल प्रोग्राम यूटिलिटी", "सेंट्रल प्रोग्राम युटिलिटी"],
  ["Computer Processing User", "कंप्यूटर प्रोसेसिंग यूज़र", "कॉम्प्युटर प्रोसेसिंग युजर"],
  ["Web browser", "वेब ब्राउज़र", "वेब ब्राउझर"],
  ["Paint", "पेंट", "पेंट"],
  ["Camera", "कैमरा", "कॅमेरा"],
  ["Share it with everyone", "इसे सबके साथ बाँटें", "ते सर्वांसोबत शेअर करा"],
  ["Write it on a public wall", "इसे सार्वजनिक दीवार पर लिखें", "ते सार्वजनिक भिंतीवर लिहा"],
  ["Keep it private", "इसे गुप्त रखें", "ते गुप्त ठेवा"],
  ["Use your name only", "सिर्फ अपना नाम इस्तेमाल करें", "फक्त तुमचे नाव वापरा"],
  ["To cook food", "खाना बनाने के लिए", "जेवण शिजवण्यासाठी"],
  ["To keep files together", "फाइलों को साथ रखने के लिए", "फाइल्स एकत्र ठेवण्यासाठी"],
  ["To charge the mouse", "माउस चार्ज करने के लिए", "माउस चार्ज करण्यासाठी"],
  ["To paint the screen", "स्क्रीन रंगने के लिए", "स्क्रीन रंगवण्यासाठी"],
  ["Send the OTP quickly", "OTP जल्दी भेज दें", "OTP लवकर पाठवा"],
  ["Share it with friends", "इसे दोस्तों के साथ बाँटें", "ते मित्रांसोबत शेअर करा"],
  ["Do not reply and tell a teacher", "जवाब न दें और शिक्षक को बताएँ", "उत्तर देऊ नका आणि शिक्षकाला सांगा"],
  ["Click every link", "हर लिंक पर क्लिक करें", "प्रत्येक लिंकवर क्लिक करा"],
  ["Into a class folder", "कक्षा के फोल्डर में", "वर्गाच्या फोल्डरमध्ये"],
  ["To a stranger", "किसी अनजान को", "अनोळखी व्यक्तीला"],
  ["On the classroom wall", "कक्षा की दीवार पर", "वर्गाच्या भिंतीवर"],
  ["Inside the keyboard", "कीबोर्ड के अंदर", "कीबोर्डच्या आत"],
  ["A keyboard", "एक कीबोर्ड", "एक कीबोर्ड"],
  ["A folder name", "एक फोल्डर का नाम", "फोल्डरचे नाव"],
  ["WATCH AND LEARN", "देखें और सीखें", "पाहा आणि शिका"],
  ["Video class", "वीडियो कक्षा", "व्हिडिओ वर्ग"],
  ["Short lessons from teachers on YouTube. Watch one, then try it on the school computer.", "यूट्यूब पर शिक्षकों के छोटे पाठ। एक देखें, फिर स्कूल के कंप्यूटर पर आज़माएँ।", "यूट्यूबवरील शिक्षकांचे छोटे धडे. एक पाहा, मग शाळेच्या संगणकावर करून पाहा."],
  ["What is a computer?", "कंप्यूटर क्या है?", "संगणक म्हणजे काय?"],
  ["A friendly story for children about hardware, software, and why we use computers.", "बच्चों के लिए हार्डवेयर, सॉफ्टवेयर और कंप्यूटर के इस्तेमाल की आसान कहानी।", "मुलांसाठी हार्डवेअर, सॉफ्टवेअर आणि संगणक का वापरतो याची सोपी गोष्ट."],
  ["Parts you can see", "जो भाग दिखते हैं", "दिसणारे भाग"],
  ["Monitor, keyboard, mouse, and how a laptop holds those parts together. From GCFGlobal.", "मॉनिटर, कीबोर्ड, माउस, और लैपटॉप इन भागों को कैसे समेटता है। GCFGlobal से।", "मॉनिटर, कीबोर्ड, माउस आणि लॅपटॉप हे भाग कसे एकत्र ठेवतो. GCFGlobal कडून."],
  ["Parts inside the box", "डिब्बे के अंदर के भाग", "पेटीतील भाग"],
  ["CPU, memory, and storage, explained slowly for beginners. From GCFGlobal.", "सीपीयू, मेमोरी और स्टोरेज, शुरुआत करने वालों के लिए धीरे-धीरे। GCFGlobal से।", "सीपीयू, मेमरी आणि साठवण, सुरुवात करणाऱ्यांसाठी हळूहळू. GCFGlobal कडून."],
  ["Computer parts for kids", "बच्चों के लिए कंप्यूटर के भाग", "मुलांसाठी संगणकाचे भाग"],
  ["Input and output devices: keyboard, mouse, monitor, printer, and speakers.", "इनपुट और आउटपुट उपकरण: कीबोर्ड, माउस, मॉनिटर, प्रिंटर और स्पीकर।", "इनपुट आणि आउटपुट साधने: कीबोर्ड, माउस, मॉनिटर, प्रिंटर आणि स्पीकर."],
  ["First day at the computer", "कंप्यूटर पर पहला दिन", "संगणकावरील पहिला दिवस"],
  ["Turn it on, use the keyboard and mouse, find files, and open a browser.", "इसे चालू करें, कीबोर्ड और माउस इस्तेमाल करें, फाइलें ढूँढें और ब्राउज़र खोलें।", "ते सुरू करा, कीबोर्ड आणि माउस वापरा, फाइल्स शोधा आणि ब्राउझर उघडा."],
  ["Plug in and switch on", "तार लगाएँ और चालू करें", "तार लावा आणि सुरू करा"],
  ["How a monitor, keyboard, mouse, and power cable connect for the first time.", "मॉनिटर, कीबोर्ड, माउस और बिजली की तार पहली बार कैसे जुड़ते हैं।", "मॉनिटर, कीबोर्ड, माउस आणि वीजतार पहिल्यांदा कसे जोडतात."],
  ["Videos play from YouTube. The school needs internet for this page. The file lab and fake-message game work on this computer after the class server is started.", "वीडियो यूट्यूब से चलते हैं। इस पेज के लिए स्कूल में इंटरनेट चाहिए। फाइल लैब और नकली संदेश का खेल कक्षा का सर्वर चालू होने पर इस कंप्यूटर पर चलते हैं।", "व्हिडिओ यूट्यूबवरून चालतात. या पानासाठी शाळेत इंटरनेट हवे. फाइल प्रयोगशाळा आणि खोट्या संदेशांचा खेळ वर्गाचा सर्व्हर सुरू झाल्यावर या संगणकावर चालतात."],
  ["Next: make a folder", "अगला: फोल्डर बनाएँ", "पुढील: फोल्डर तयार करा"],
  ["PRACTICE ON THIS COMPUTER", "इस कंप्यूटर पर अभ्यास", "या संगणकावर सराव"],
  ["File lab", "फाइल लैब", "फाइल प्रयोगशाळा"],
  ["A folder is a bag for your work. A file is one piece of work inside that bag.", "फोल्डर आपके काम का बैग है। फाइल उस बैग के अंदर काम का एक हिस्सा है।", "फोल्डर म्हणजे कामाची पिशवी. फाइल म्हणजे त्या पिशवीतील कामाचा एक भाग."],
  ["Checking the class server…", "कक्षा का सर्वर जाँचा जा रहा है…", "वर्गाचा सर्व्हर तपासला जात आहे…"],
  ["1. Folder", "1. फोल्डर", "1. फोल्डर"],
  ["Give it a clear name, such as My Homework or Class 6 Drawings.", "इसे साफ़ नाम दें, जैसे मेरा होमवर्क या कक्षा 6 के चित्र।", "त्याला स्पष्ट नाव द्या, जसे माझा गृहपाठ किंवा इयत्ता 6 चित्रे."],
  ["2. File", "2. फाइल", "2. फाइल"],
  ["A file can be a text page, a picture, or a PDF. Send school work only.", "फाइल एक लेख, चित्र या पीडीएफ हो सकती है। सिर्फ स्कूल का काम भेजें।", "फाइल मजकूर, चित्र किंवा पीडीएफ असू शकते. फक्त शाळेचे काम पाठवा."],
  ["3. Send", "3. भेजें", "3. पाठवा"],
  ["Sending here means the file is copied into the class folder on this computer.", "यहाँ भेजने का मतलब है कि फाइल इस कंप्यूटर के कक्षा फोल्डर में कॉपी होती है।", "येथे पाठवणे म्हणजे फाइल या संगणकाच्या वर्ग फोल्डरमध्ये कॉपी होते."],
  ["Create a folder", "फोल्डर बनाएँ", "फोल्डर तयार करा"],
  ["Think of a short name.", "एक छोटा नाम सोचें।", "एक छोटे नाव विचार करा."],
  ["Type it in the box.", "उसे बॉक्स में लिखें।", "ते चौकटीत लिहा."],
  ["Press Create folder.", "फोल्डर बनाएँ दबाएँ।", "फोल्डर तयार करा दाबा."],
  ["Folder name", "फोल्डर का नाम", "फोल्डरचे नाव"],
  ["Create folder", "फोल्डर बनाएँ", "फोल्डर तयार करा"],
  ["Send a file", "फाइल भेजें", "फाइल पाठवा"],
  ["Choose a folder", "फोल्डर चुनें", "फोल्डर निवडा"],
  ["Choose a file", "फाइल चुनें", "फाइल निवडा"],
  ["Note to the teacher", "शिक्षक के लिए नोट", "शिक्षकांसाठी नोंद"],
  ["Send file", "फाइल भेजें", "फाइल पाठवा"],
  ["Allowed files: txt, pdf, png, jpg, doc, ppt. Biggest size: 5 MB. Files stay on this class computer.", "मंज़ूर फाइलें: txt, pdf, png, jpg, doc, ppt. सबसे बड़ा आकार: 5 एमबी। फाइलें इसी कक्षा के कंप्यूटर पर रहती हैं।", "परवानगी असलेल्या फाइल्स: txt, pdf, png, jpg, doc, ppt. सर्वात मोठा आकार: 5 एमबी. फाइल्स या वर्गाच्या संगणकावर राहतात."],
  ["Next: spot fake messages", "अगला: नकली संदेश पहचानें", "पुढील: खोटे संदेश ओळखा"],
  ["Remove", "हटाएँ", "काढा"],
  ["No folders yet. Create your first one.", "अभी कोई फोल्डर नहीं। अपना पहला फोल्डर बनाएँ।", "अजून फोल्डर नाही. तुमचा पहिला फोल्डर तयार करा."],
  ["This folder is empty. Send a homework file into it.", "यह फोल्डर खाली है। इसमें होमवर्क की फाइल भेजें।", "हा फोल्डर रिकामा आहे. त्यात गृहपाठाची फाइल पाठवा."],
  ["Sent by {name}", "{name} ने भेजी", "{name} यांनी पाठवली"],
  ["Remove the folder {name} and the files inside it?", "फोल्डर {name} और उसके अंदर की फाइलें हटाएँ?", "फोल्डर {name} आणि आतील फाइल्स काढायच्या?"],
  ["Remove {name} from this folder?", "इस फोल्डर से {name} हटाएँ?", "या फोल्डरमधून {name} काढायची?"],
  ["Create a folder first, then send the file into it.", "पहले फोल्डर बनाएँ, फिर उसमें फाइल भेजें।", "आधी फोल्डर तयार करा, मग त्यात फाइल पाठवा."],
  ["Choose a file from this computer.", "इस कंप्यूटर से एक फाइल चुनें।", "या संगणकावरून एक फाइल निवडा."],
  ["The class server is off. Ask a teacher to run npm start.", "कक्षा का सर्वर बंद है। शिक्षक से npm start चलवाने को कहें।", "वर्गाचा सर्व्हर बंद आहे. शिक्षकाला npm start चालवायला सांगा."],
  ["STAY SAFE", "सुरक्षित रहें", "सुरक्षित राहा"],
  ["Spot the fake message", "नकली संदेश पहचानें", "खोटा संदेश ओळखा"],
  ["Some messages want your OTP, money, or a quick click. A real school note does not.", "कुछ संदेश OTP, पैसे या जल्दी क्लिक माँगते हैं। असली स्कूल नोट ऐसा नहीं करती।", "काही संदेश OTP, पैसे किंवा लगेच क्लिक मागतात. खरा शाळेचा निरोप तसे करत नाही."],
  ["Secret", "रहस्य", "गुपित"],
  ["OTP, password, PIN, or Aadhaar. Do not send these in a reply.", "OTP, पासवर्ड, पिन या आधार। जवाब में ये न भेजें।", "OTP, पासवर्ड, पिन किंवा आधार. उत्तरात हे पाठवू नका."],
  ["Prize", "इनाम", "बक्षीस"],
  ["Money or a free gift you did not enter is usually a trick.", "जिस पैसे या मुफ्त उपहार के लिए आपने नाम नहीं लिखा, वह अक्सर धोखा होता है।", "ज्या पैशांसाठी किंवा मोफत भेटवस्तूसाठी तुम्ही नाव दिले नव्हते, ती सहसा फसवणूक असते."],
  ["Hurry", "जल्दी", "घाई"],
  ["If it says “now” and pushes a strange link, stop and ask a teacher.", "अगर वह “अभी” कहे और अजीब लिंक दे, रुकें और शिक्षक से पूछें।", "जर तो “आत्ता” म्हणत असेल आणि विचित्र लिंक देत असेल, थांबा आणि शिक्षकाला विचारा."],
  ["Message", "संदेश", "संदेश"],
  ["From:", "भेजने वाला:", "पाठवणारा:"],
  ["From: {from}", "भेजने वाला: {from}", "पाठवणारा: {from}"],
  ["Loading a practice message…", "अभ्यास संदेश आ रहा है…", "सराव संदेश येत आहे…"],
  ["This is real", "यह असली है", "हा खरा आहे"],
  ["This is fake", "यह नकली है", "हा खोटा आहे"],
  ["Next message", "अगला संदेश", "पुढील संदेश"],
  ["See my score", "मेरे अंक देखें", "माझे गुण पाहा"],
  ["Message {n} of {total}", "संदेश {n} / {total}", "संदेश {n} / {total}"],
  ["Yes. ", "हाँ। ", "होय. "],
  ["Not quite. ", "पूरा सही नहीं। ", "अगदी बरोबर नाही. "],
  ["You spotted {score} out of {total} messages.", "आपने {total} में से {score} संदेश पहचाने।", "तुम्ही {total} पैकी {score} संदेश ओळखले."],
  [" Saved for {name}.", " {name} के लिए सहेजा गया।", " {name} यांच्यासाठी जतन केले."],
  [" Save your name on the home page to put this score on your certificate.", " यह अंक प्रमाणपत्र पर रखने के लिए होम पेज पर नाम सहेजें।", " हे गुण प्रमाणपत्रावर ठेवण्यासाठी मुख्यपृष्ठावर नाव जतन करा."],
  ["The class server is off, so the score could not be saved.", "कक्षा का सर्वर बंद है, इसलिए अंक सहेजे नहीं जा सके।", "वर्गाचा सर्व्हर बंद आहे, म्हणून गुण जतन झाले नाहीत."],
  ["The practice messages load from the class server. Ask a teacher to run npm start.", "अभ्यास संदेश कक्षा के सर्वर से आते हैं। शिक्षक से npm start चलवाने को कहें।", "सराव संदेश वर्गाच्या सर्व्हरवरून येतात. शिक्षकाला npm start चालवायला सांगा."],
  ["Check a message", "संदेश जाँचें", "संदेश तपासा"],
  ["Paste a message you are not sure about. This helper looks for common tricks. It can be wrong, so still ask a teacher.", "जिस संदेश पर शक हो उसे चिपकाएँ। यह सहायक आम धोखे देखता है। यह गलत भी हो सकता है, इसलिए शिक्षक से पूछें।", "ज्या संदेशाबद्दल शंका आहे तो चिकटवा. हा मदतनीस नेहमीच्या फसवणुकी पाहतो. तो चुकू शकतो, म्हणून शिक्षकाला विचारा."],
  ["Check message", "संदेश जाँचें", "संदेश तपासा"],
  ["Try a sample", "एक नमूना आज़माएँ", "एक नमुना पाहा"],
  ["Next: take the quiz", "अगला: क्विज़ दें", "पुढील: प्रश्नमंजुषा सोडवा"],
  ["No common trick showed up in this message.", "इस संदेश में कोई आम धोखा नहीं दिखा।", "या संदेशात नेहमीची फसवणूक दिसली नाही."],
  ["The class server is off. Ask a teacher to run npm start, then try again.", "कक्षा का सर्वर बंद है। शिक्षक से npm start चलवाएँ, फिर कोशिश करें।", "वर्गाचा सर्व्हर बंद आहे. शिक्षकाला npm start चालवायला सांगा, मग पुन्हा प्रयत्न करा."],
  ["YOUR PROGRESS", "आपकी प्रगति", "तुमची प्रगती"],
  ["Certificate", "प्रमाणपत्र", "प्रमाणपत्र"],
  ["Scores from the quiz, the file lab, and the fake-message game appear here.", "क्विज़, फाइल लैब और नकली संदेश खेल के अंक यहाँ दिखते हैं।", "प्रश्नमंजुषा, फाइल प्रयोगशाळा आणि खोट्या संदेशांच्या खेळाचे गुण येथे दिसतात."],
  ["Show certificate", "प्रमाणपत्र दिखाएँ", "प्रमाणपत्र दाखवा"],
  ["Ready to Begin", "शुरू करने के लिए तैयार", "सुरुवात करायला तयार"],
  ["This certifies that", "यह प्रमाणित करता है कि", "हे प्रमाणित करते की"],
  ["Student", "विद्यार्थी", "विद्यार्थी"],
  ["Finish an activity and your stars will appear here.", "एक गतिविधि पूरी करें और आपके सितारे यहाँ दिखेंगे।", "एक कृती पूर्ण करा आणि तुमचे तारे येथे दिसतील."],
  ["Print certificate", "प्रमाणपत्र छापें", "प्रमाणपत्र छापा"],
  ["Computer quiz", "कंप्यूटर क्विज़", "संगणक प्रश्नमंजुषा"],
  ["Fake-message game", "नकली संदेश खेल", "खोट्या संदेशांचा खेळ"],
  ["File lab", "फाइल लैब", "फाइल प्रयोगशाळा"],
  ["{label} · {score}/{total} {stars}", "{label} · {score}/{total} {stars}", "{label} · {score}/{total} {stars}"],
  ["{label} · not yet", "{label} · अभी नहीं", "{label} · अजून नाही"],
  ["Computer Explorer", "कंप्यूटर एक्सप्लोरर", "संगणक एक्सप्लोरर"],
  ["You practised parts, files, and staying safe online.", "आपने भाग, फाइलें और ऑनलाइन सुरक्षा का अभ्यास किया।", "तुम्ही भाग, फाइल्स आणि ऑनलाइन सुरक्षिततेचा सराव केला."],
  ["Computer Learner", "कंप्यूटर सीखने वाला", "संगणक शिकणारा"],
  ["You started the path. Finish the other activities to become a Computer Explorer.", "आपने रास्ता शुरू किया। कंप्यूटर एक्सप्लोरर बनने के लिए बाकी गतिविधियाँ पूरी करें।", "तुम्ही मार्ग सुरू केला. संगणक एक्सप्लोरर होण्यासाठी उरलेल्या कृती पूर्ण करा."],
  ["Finish the quiz, the file lab, or the fake-message game. This certificate will fill in.", "क्विज़, फाइल लैब या नकली संदेश खेल पूरा करें। यह प्रमाणपत्र भर जाएगा।", "प्रश्नमंजुषा, फाइल प्रयोगशाळा किंवा खोट्या संदेशांचा खेळ पूर्ण करा. हे प्रमाणपत्र भरेल."],
  ["Type your name with at least 2 letters.", "कम से कम 2 अक्षरों का नाम लिखें।", "किमान 2 अक्षरांचे नाव लिहा."],
  ["Please type your name with at least 2 letters.", "कृपया कम से कम 2 अक्षरों का नाम लिखें।", "कृपया किमान 2 अक्षरांचे नाव लिहा."],
  ["Hello, {name}. Your name will appear on the certificate.", "नमस्ते, {name}। आपका नाम प्रमाणपत्र पर दिखेगा।", "नमस्कार, {name}. तुमचे नाव प्रमाणपत्रावर दिसेल."],
  ["Class server is on. Files and scores stay on this computer.", "कक्षा का सर्वर चालू है। फाइलें और अंक इसी कंप्यूटर पर रहते हैं।", "वर्गाचा सर्व्हर सुरू आहे. फाइल्स आणि गुण या संगणकावर राहतात."],
  ["Class server is off. Ask a teacher to open this site with npm start.", "कक्षा का सर्वर बंद है। शिक्षक से यह साइट npm start से खुलवाएँ।", "वर्गाचा सर्व्हर बंद आहे. शिक्षकाला ही साइट npm start ने उघडायला सांगा."],
  ["Certificate ready for {name}.", "{name} का प्रमाणपत्र तैयार है।", "{name} यांचे प्रमाणपत्र तयार आहे."],
  ["No saved scores yet. Play an activity, then come back.", "अभी कोई अंक सहेजे नहीं हैं। एक गतिविधि करें, फिर वापस आएँ।", "अजून गुण जतन नाहीत. एक कृती करा, मग परत या."],
  ["The class server is off. Your certificate needs npm start.", "कक्षा का सर्वर बंद है। प्रमाणपत्र के लिए npm start चाहिए।", "वर्गाचा सर्व्हर बंद आहे. प्रमाणपत्रासाठी npm start हवा."],
  ["Saved.", "सहेज लिया।", "जतन झाले."],
  ["friend", "मित्र", "मित्र"],
  ["🎉 Excellent! Your answer is correct!", "🎉 बहुत अच्छे! आपका उत्तर सही है!", "🎉 शाब्बास! तुमचे उत्तर बरोबर आहे!"],
  ["❌ Try again! Check the spelling.", "❌ फिर कोशिश करें! वर्तनी जाँचें।", "❌ पुन्हा प्रयत्न करा! स्पेलिंग तपासा."],
  ["The Escape key is commonly used to cancel or exit certain actions.", "एस्केप कुंजी अक्सर किसी काम को रद्द करने या बाहर निकलने के लिए होती है।", "एस्केप कळ अनेकदा काम रद्द करण्यासाठी किंवा बाहेर पडण्यासाठी असते."],
  ["The Enter key confirms actions or starts a new line in text.", "एंटर कुंजी काम पक्का करती है या लेख में नई पंक्ति शुरू करती है।", "एंटर कळ काम निश्चित करते किंवा मजकुरात नवीन ओळ सुरू करते."],
  ["Deletes the character to the left of the cursor.", "कर्सर के बाईं ओर का अक्षर मिटाती है।", "कर्सरच्या डावीकडील अक्षर पुसते."],
  ["Deletes the selected item or the character to the right of the cursor.", "चुनी हुई चीज़ या कर्सर के दाईं ओर का अक्षर मिटाती है।", "निवडलेली गोष्ट किंवा कर्सरच्या उजवीकडील अक्षर पुसते."],
  ["Adds a blank space between words.", "शब्दों के बीच खाली जगह डालती है।", "शब्दांमध्ये मोकळी जागा टाकते."],
  ["Used with other keys to type capital letters and upper symbols.", "दूसरी कुंजियों के साथ बड़े अक्षर और ऊपर वाले चिह्न लिखने के लिए।", "इतर कळांसोबत मोठी अक्षरे आणि वरची चिन्हे लिहिण्यासाठी."],
  ["Moves to the next field or creates an indentation in some programs.", "अगले खाने में जाती है या कुछ प्रोग्राम में जगह छोड़ती है।", "पुढच्या चौकटीत जाते किंवा काही प्रोग्राममध्ये जागा सोडते."],
  ["Turns capital letter typing on or off.", "बड़े अक्षर लिखना चालू या बंद करती है।", "मोठी अक्षरे लिहिणे सुरू किंवा बंद करते."],
  ["Used with other keys for shortcuts.", "शॉर्टकट के लिए दूसरी कुंजियों के साथ इस्तेमाल होती है।", "शॉर्टकटसाठी इतर कळांसोबत वापरली जाते."],
  ["Used with other keys for additional commands.", "और आदेशों के लिए दूसरी कुंजियों के साथ इस्तेमाल होती है।", "अधिक आदेशांसाठी इतर कळांसोबत वापरली जाते."],
  ["This key is used to type {key} or perform a keyboard action.", "यह कुंजी {key} लिखने या कीबोर्ड का काम करने के लिए है।", "ही कळ {key} लिहिण्यासाठी किंवा कीबोर्डचे काम करण्यासाठी आहे."],
  ["Language", "भाषा", "भाषा"],
  ["Open navigation menu", "नेविगेशन मेनू खोलें", "नेव्हिगेशन मेनू उघडा"],
  ["💻 Computer", "💻 कंप्यूटर", "💻 संगणक"],
  ["🎉 Correct! Well done!", "🎉 सही! बहुत अच्छे!", "🎉 बरोबर! शाब्बास!"],
  ["🏆 Your Quiz Result", "🏆 आपका क्विज़ नतीजा", "🏆 तुमचा प्रश्नमंजुषा निकाल"],
  ["You scored {score} out of {total}!", "आपके {total} में से {score} अंक!", "तुमचे {total} पैकी {score} गुण!"],
  ["See My Result →", "मेरा नतीजा देखें →", "माझा निकाल पाहा →"],
  ["Try Again ↻", "फिर कोशिश करें ↻", "पुन्हा प्रयत्न करा ↻"],
  ["Not quite! The correct answer is {answer}", "पूरा सही नहीं! सही उत्तर है {answer}", "अगदी बरोबर नाही! बरोबर उत्तर आहे {answer}"],
  ["Which of these is a search engine?", "इनमें से सर्च इंजन कौन सा है?", "यापैकी शोधयंत्र कोणते आहे?"],
  ["A. Google", "A. गूगल", "A. गुगल"],
  ["B. Paint", "B. पेंट", "B. पेंट"],
  ["C. Calculator", "C. कैलकुलेटर", "C. कॅल्क्युलेटर"],
  ["D. Notepad", "D. नोटपैड", "D. नोटपॅड"],
  ["What does email stand for?", "ईमेल का पूरा अर्थ क्या है?", "ईमेलचे पूर्ण रूप काय आहे?"],
  ["A. Easy Mail", "A. ईज़ी मेल", "A. इझी मेल"],
  ["B. Electric Machine", "B. इलेक्ट्रिक मशीन", "B. इलेक्ट्रिक मशीन"],
  ["C. Electronic Mail", "C. इलेक्ट्रॉनिक मेल", "C. इलेक्ट्रॉनिक मेल"],
  ["D. Extra Message", "D. एक्स्ट्रा मैसेज", "D. एक्स्ट्रा मेसेज"],
  ["A. Share it publicly", "A. इसे सार्वजनिक करें", "A. ते सर्वांसमोर सांगा"],
  ["B. Post it online", "B. इसे ऑनलाइन डालें", "B. ते ऑनलाइन टाका"],
  ["C. Tell strangers", "C. अनजान लोगों को बताएँ", "C. अनोळखी लोकांना सांगा"],
  ["D. Keep it private", "D. इसे गुप्त रखें", "D. ते गुप्त ठेवा"],
  ["What is the internet?", "इंटरनेट क्या है?", "इंटरनेट म्हणजे काय?"],
  ["A. A type of keyboard", "A. एक तरह का कीबोर्ड", "A. एक प्रकारचा कीबोर्ड"],
  ["B. A worldwide network", "B. एक विश्वव्यापी जाल", "B. एक जागतिक जाळे"],
  ["C. A computer mouse", "C. एक कंप्यूटर माउस", "C. एक संगणक माउस"],
  ["D. A printer", "D. एक प्रिंटर", "D. एक प्रिंटर"],
  ["Question {n} of {total}: {question}", "प्रश्न {n} / {total}: {question}", "प्रश्न {n} / {total}: {question}"],
  ["The monitor is the screen. It shows words, pictures, and videos. We look at it. We do not type on it.", "मॉनिटर स्क्रीन है। उस पर शब्द, चित्र और वीडियो दिखते हैं। हम उसे देखते हैं। उस पर टाइप नहीं करते।", "मॉनिटर म्हणजे स्क्रीन. त्यावर शब्द, चित्रे आणि व्हिडिओ दिसतात. आपण तो पाहतो. त्यावर टाइप करत नाही."],
  ["The keyboard has many keys. We press them to write our name, numbers, and answers.", "कीबोर्ड पर कई कुंजियाँ होती हैं। हम उन्हें दबाकर अपना नाम, संख्या और उत्तर लिखते हैं।", "कीबोर्डवर अनेक कळा असतात. त्या दाबून आपण नाव, अंक आणि उत्तरे लिहितो."],
  ["The mouse moves the arrow on the screen. Left click chooses. Right click opens a small menu.", "माउस स्क्रीन पर तीर हिलाता है। बायाँ क्लिक चुनता है। दायाँ क्लिक छोटा मेनू खोलता है।", "माउस स्क्रीनवरील बाण हलवतो. डावे क्लिक निवडते. उजवे क्लिक छोटा मेनू उघडते."],
  ["The CPU is the computer's brain. It follows instructions and works with the other parts.", "सीपीयू कंप्यूटर का दिमाग है। वह निर्देश मानता है और बाकी भागों के साथ काम करता है।", "सीपीयू संगणकाचा मेंदू आहे. तो सूचना पाळतो आणि इतर भागांसोबत काम करतो."],
  ["Type your name", "अपना नाम लिखें", "तुमचे नाव लिहा"],
  ["Class 6", "कक्षा 6", "इयत्ता 6"],
  ["I want to practise typing.", "मैं टाइप करने का अभ्यास करना चाहता हूँ।", "मला टाइप करण्याचा सराव करायचा आहे."],
  ["My Homework", "मेरा होमवर्क", "माझा गृहपाठ"],
  ["This is my computer homework", "यह मेरा कंप्यूटर होमवर्क है", "हा माझा संगणक गृहपाठ आहे"],
  ["Paste the message here", "संदेश यहाँ चिपकाएँ", "संदेश येथे चिकटवा"],
  ["Type the word here...", "शब्द यहाँ लिखें...", "शब्द येथे लिहा..."],
  ["Log in", "लॉग इन", "लॉग इन"],
  ["Log out", "लॉग आउट", "लॉग आउट"],
  ["Register", "पंजीकरण", "नोंदणी"],
  ["Teacher", "शिक्षक", "शिक्षक"],
  ["SIGN IN", "साइन इन", "साइन इन"],
  ["NEW STUDENT", "नया विद्यार्थी", "नवीन विद्यार्थी"],
  ["TEACHER", "शिक्षक", "शिक्षक"],
  ["Log in to your class", "अपनी कक्षा में लॉग इन करें", "तुमच्या वर्गात लॉग इन करा"],
  ["Type the name and 4-number PIN you chose when you registered.", "पंजीकरण के समय चुना नाम और 4 अंकों का पिन लिखें।", "नोंदणीच्या वेळी निवडलेले नाव आणि 4 अंकांचा पिन लिहा."],
  ["4-number PIN", "4 अंकों का पिन", "4 अंकांचा पिन"],
  ["New here? Register", "नए हैं? पंजीकरण करें", "नवीन आहात? नोंदणी करा"],
  ["I am the teacher", "मैं शिक्षक हूँ", "मी शिक्षक आहे"],
  ["Create your class account", "अपना कक्षा खाता बनाएँ", "तुमचे वर्ग खाते तयार करा"],
  ["Pick a name and a 4-number PIN. Remember the PIN. The teacher can reset it if you forget.", "एक नाम और 4 अंकों का पिन चुनें। पिन याद रखें। भूल जाएँ तो शिक्षक उसे बदल सकता है।", "नाव आणि 4 अंकांचा पिन निवडा. पिन लक्षात ठेवा. विसरलात तर शिक्षक तो बदलू शकतो."],
  ["Your class", "आपकी कक्षा", "तुमची इयत्ता"],
  ["PIN again", "पिन फिर से", "पिन पुन्हा"],
  ["Create account", "खाता बनाएँ", "खाते तयार करा"],
  ["Already registered? Log in", "पहले से पंजीकृत हैं? लॉग इन करें", "आधीच नोंदणी केली आहे? लॉग इन करा"],
  ["Teacher sign-in", "शिक्षक साइन-इन", "शिक्षक साइन-इन"],
  ["Use the teacher PIN from this class computer. Students use their own PIN.", "इस कक्षा के कंप्यूटर वाला शिक्षक पिन इस्तेमाल करें। विद्यार्थी अपना पिन इस्तेमाल करते हैं।", "या वर्गाच्या संगणकावरील शिक्षक पिन वापरा. विद्यार्थी स्वतःचा पिन वापरतात."],
  ["Teacher PIN", "शिक्षक पिन", "शिक्षक पिन"],
  ["Open class list", "कक्षा सूची खोलें", "वर्ग यादी उघडा"],
  ["I am a student", "मैं विद्यार्थी हूँ", "मी विद्यार्थी आहे"],
  ["Class list", "कक्षा सूची", "वर्ग यादी"],
  ["Registered students and their stars. Reset a PIN only for the student who forgot it.", "पंजीकृत विद्यार्थी और उनके सितारे। पिन सिर्फ उसी का बदलें जो भूल गया हो।", "नोंदलेले विद्यार्थी आणि त्यांचे तारे. पिन फक्त विसरलेल्या विद्यार्थ्याचा बदला."],
  ["No students have registered yet.", "अभी किसी विद्यार्थी ने पंजीकरण नहीं किया।", "अजून कोणत्याही विद्यार्थ्याने नोंदणी केलेली नाही."],
  ["New PIN", "नया पिन", "नवीन पिन"],
  ["Save new PIN", "नया पिन सहेजें", "नवीन पिन जतन करा"],
  ["You are signed in as {name}.", "आप {name} के नाम से साइन इन हैं।", "तुम्ही {name} या नावाने साइन इन आहात."],
  ["Hello, {name}. You are signed in.", "नमस्ते, {name}। आप साइन इन हो गए।", "नमस्कार, {name}. तुम्ही साइन इन झाला आहात."],
  ["File Lab | Digital Pathshala", "फाइल लैब | डिजिटल पाठशाला", "फाइल प्रयोगशाळा | डिजिटल पाठशाळा"],
  ["Log in | Digital Pathshala", "लॉग इन | डिजिटल पाठशाला", "लॉग इन | डिजिटल पाठशाळा"],
  ["Register | Digital Pathshala", "पंजीकरण | डिजिटल पाठशाला", "नोंदणी | डिजिटल पाठशाळा"],
  ["Teacher | Digital Pathshala", "शिक्षक | डिजिटल पाठशाला", "शिक्षक | डिजिटल पाठशाळा"]
]);

var textOriginals = new WeakMap();

function skipElement(el) {
  if (!el) {
    return true;
  }
  if (el.closest && el.closest("script, style, .lang-switch, .logo, .hindi")) {
    return true;
  }
  return false;
}

Pathshala.apply = function () {
  var lang = Pathshala.lang();
  document.documentElement.lang = lang === "en" ? "en" : lang;

  document.querySelectorAll(".lang-switch button").forEach(function (button) {
    button.classList.toggle("is-on", button.getAttribute("data-lang") === lang);
  });

  document.querySelectorAll(".hindi").forEach(function (el) {
    el.hidden = lang !== "en";
  });

  if (!document.documentElement.dataset.enTitle) {
    document.documentElement.dataset.enTitle = document.title;
  }
  document.title = Pathshala.tr(document.documentElement.dataset.enTitle);

  document.querySelectorAll("[data-pack]").forEach(function (el) {
    var pack = JSON.parse(el.dataset.pack);
    el.textContent = pack[lang] || pack.en || "";
  });

  document.querySelectorAll("[data-tpl]").forEach(function (el) {
    var vars = {};
    try {
      vars = JSON.parse(el.dataset.vars || "{}");
    } catch (error) {
      vars = {};
    }
    el.textContent = Pathshala.fillText(el.dataset.tpl, vars);
  });

  document.querySelectorAll("[data-en]").forEach(function (el) {
    if (el.dataset.pack || el.dataset.tpl) {
      return;
    }
    el.textContent = Pathshala.tr(el.dataset.en);
  });

  var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
  var node = walker.nextNode();
  while (node) {
    var parent = node.parentElement;
    if (!skipElement(parent) && !(parent && (parent.dataset.en || parent.dataset.tpl || parent.dataset.pack || parent.closest("[data-en], [data-tpl], [data-pack]")))) {
      if (!textOriginals.has(node)) {
        var compact = node.nodeValue.replace(/\s+/g, " ").trim();
        if (compact) {
          textOriginals.set(node, { key: compact, raw: node.nodeValue });
        }
      }
      if (textOriginals.has(node)) {
        var saved = textOriginals.get(node);
        var translated = Pathshala.tr(saved.key);
        var lead = saved.raw.match(/^\s*/)[0];
        var tail = saved.raw.match(/\s*$/)[0];
        node.nodeValue = lead + translated + tail;
      }
    }
    node = walker.nextNode();
  }

  document.querySelectorAll("[placeholder]").forEach(function (el) {
    if (!el.dataset.enPlaceholder) {
      el.dataset.enPlaceholder = el.getAttribute("placeholder");
    }
    el.setAttribute("placeholder", Pathshala.tr(el.dataset.enPlaceholder));
  });

  document.querySelectorAll("[aria-label]").forEach(function (el) {
    if (el.classList.contains("lang-switch")) {
      return;
    }
    if (!el.dataset.enAria) {
      el.dataset.enAria = el.getAttribute("aria-label");
    }
    el.setAttribute("aria-label", Pathshala.tr(el.dataset.enAria));
  });

  document.querySelectorAll("iframe[data-src-en]").forEach(function (frame) {
    var id = frame.getAttribute("data-src-" + lang) || "";
    var card = frame.closest(".video-card, .parts-section");
    if (!id) {
      if (card && card.classList.contains("video-card")) {
        card.hidden = true;
      }
      return;
    }
    if (card && card.classList.contains("video-card")) {
      card.hidden = false;
    }
    var next = "https://www.youtube-nocookie.com/embed/" + id;
    if (frame.getAttribute("src") !== next) {
      frame.setAttribute("src", next);
    }
  });
};

function ensureFont() {
  if (document.getElementById("pathshala-font")) {
    return;
  }
  var link = document.createElement("link");
  link.id = "pathshala-font";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@500;700&family=Nunito:wght@400;600;700;800&display=swap";
  document.head.appendChild(link);
}

function injectSwitcher() {
  var nav = document.querySelector(".navbar");
  if (!nav || nav.querySelector(".lang-switch")) {
    return;
  }
  var box = document.createElement("div");
  box.className = "lang-switch";
  box.setAttribute("role", "group");
  box.setAttribute("aria-label", "Language");
  [
    ["en", "EN"],
    ["hi", "हिन्दी"],
    ["mr", "मराठी"]
  ].forEach(function (item) {
    var button = document.createElement("button");
    button.type = "button";
    button.setAttribute("data-lang", item[0]);
    button.textContent = item[1];
    button.addEventListener("click", function () {
      Pathshala.setLang(item[0]);
    });
    box.appendChild(button);
  });
  nav.appendChild(box);
}

document.addEventListener("DOMContentLoaded", function () {
  ensureFont();
  injectSwitcher();
  Pathshala.apply();
});
