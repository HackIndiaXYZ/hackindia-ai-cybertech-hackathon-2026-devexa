const S = {
  dontPay: {
    en: ["Don't pay or reply yet", "Do not send money, fees or personal details. Genuine scholarships, internships and banks do not need you to pay first to receive an offer."],
    hinglish: ["Abhi payment ya reply mat karo", "Paisa, fees ya personal details mat bhejo. Asli scholarship, internship ya bank offer dene ke liye pehle paisa nahi maangte."],
  },
  verify: {
    en: ["Verify through an official channel", "Type the organisation's website address yourself, or call the number on its official site. Don't use links or phone numbers from this message."],
    hinglish: ["Official channel se verify karo", "Organisation ki website ka address khud type karo ya official site par diya number use karo. Is message ke link ya number use mat karo."],
  },
  reportBlock: {
    en: ["Block and report the sender", "Use your app's Report spam/phishing option, then block the sender. You can also tell the organisation being impersonated."],
    hinglish: ["Sender ko block aur report karo", "App mein Report spam/phishing option use karo aur sender ko block karo. Jis organisation ka naam use hua hai, use bhi bata sakte ho."],
  },
  neverShare: {
    en: ["Never share OTPs, PINs or passwords", "No genuine bank, company or official will ask for them. NOVA will never ask for them either."],
    hinglish: ["OTP, PIN ya password kabhi share mat karo", "Koi asli bank, company ya officer ye nahi maangta. NOVA bhi kabhi ye nahi maangega."],
  },
  changePassword: {
    en: ["Change the exposed password now", "Use a device you trust. Change that password everywhere you reuse it, starting with your email account. Turn on two-step verification and sign out of other sessions."],
    hinglish: ["Share kiya hua password abhi badlo", "Kisi trusted device se password badlo. Jahan-jahan same password use kiya hai wahan bhi badlo, pehle email account se shuru karo. Two-step verification on karo aur baaki sessions se sign out karo."],
  },
  malware: {
    en: ["Don't open the file; clean your device", "Delete the file without opening it. If you already opened or installed it, disconnect from the internet, run a full scan with a reputable security tool, and remove apps you don't recognise. On Android, check Settings for apps with Accessibility or Device admin access."],
    hinglish: ["File mat kholo, device saaf karo", "File ko bina kholay delete karo. Agar khol li ya install kar li hai, to internet band karo, accha security tool se full scan chalao aur anjaan apps hatao. Android par Settings mein Accessibility ya Device admin access wale apps check karo."],
  },
  removeRemote: {
    en: ["Remove remote-access apps", "If you installed a screen-sharing or remote-access app (such as AnyDesk or TeamViewer) at someone's request, disconnect and uninstall it. Treat banking apps and passwords used on that device as exposed."],
    hinglish: ["Remote-access app hatao", "Agar kisi ke kehne par AnyDesk ya TeamViewer jaisa app install kiya hai, to use disconnect karke uninstall karo. Us device par use hue banking apps aur passwords ko exposed maano."],
  },
  clicked: {
    en: ["Close the page and enter nothing", "If you only opened the link and typed nothing, risk is usually lower. Close the tab, don't allow notifications or downloads, and clear that site's browser data. If you did enter details, tick what you shared and run the analysis again."],
    hinglish: ["Page band karo, kuch enter mat karo", "Agar sirf link khola aur kuch type nahi kiya, to risk aam taur par kam hota hai. Tab band karo, notifications ya downloads allow mat karo aur us site ka browser data clear karo. Agar details daali thi, to kya share kiya wo tick karke dobara analysis chalao."],
  },
  personal: {
    en: ["Watch for misuse of your details", "Expect follow-up scam attempts. If you shared ID documents (for example Aadhaar or PAN), note what you sent and when, and monitor your accounts. Official services such as UIDAI let you lock Aadhaar biometrics."],
    hinglish: ["Apni details ke misuse par nazar rakho", "Aage aur scam attempts aa sakte hain. Agar ID documents (jaise Aadhaar ya PAN) bheje hain, to note karo kya aur kab bheja, aur accounts monitor karo. UIDAI jaisi official services Aadhaar biometrics lock karne deti hain."],
  },
  callBank: {
    en: ["Call your bank or payment provider now", "Use the number on your card, passbook or official app, not one from the message. Ask them to block the card or freeze the transaction or account, and note the complaint reference. Speed matters."],
    hinglish: ["Abhi apne bank ya payment provider ko call karo", "Card, passbook ya official app par diya number use karo, message wala nahi. Card block ya transaction/account freeze karne ko kaho aur complaint reference note karo. Jaldi karna zaroori hai."],
  },
  report1930: {
    en: ["Report the fraud: call 1930", "In India, call the National Cyber Crime Helpline 1930 and file a complaint at cybercrime.gov.in as soon as possible. Quick reporting can help, but recovery is not guaranteed."],
    hinglish: ["Fraud report karo: 1930 par call karo", "India mein National Cyber Crime Helpline 1930 par call karo aur jaldi se jaldi cybercrime.gov.in par complaint darj karo. Jaldi report karna madad kar sakta hai, lekin paisa wapas milne ki guarantee nahi hoti."],
  },
  secureAccounts: {
    en: ["Secure your accounts", "From a trusted device, change passwords for affected accounts (email first), sign out of all sessions, switch on two-step verification, and review recent logins and linked devices."],
    hinglish: ["Apne accounts secure karo", "Trusted device se affected accounts ke passwords badlo (pehle email), sabhi sessions se sign out karo, two-step verification on karo aur recent logins aur linked devices check karo."],
  },
  evidence: {
    en: ["Preserve evidence", "Screenshot the messages, sender number or email, links, payment receipts and transaction IDs (UTR). Don't delete chats. You will need these for your bank and any police report."],
    hinglish: ["Saboot surakshit rakho", "Messages, sender ka number ya email, links, payment receipts aur transaction ID (UTR) ke screenshot lo. Chats delete mat karo. Bank aur police report ke liye inki zaroorat padegi."],
  },
  reportPortal: {
    en: ["Consider reporting it", "In India you can report cyber fraud attempts at cybercrime.gov.in. Reporting helps protect others even if you lost nothing."],
    hinglish: ["Report karne par vichar karo", "India mein cyber fraud ki koshish cybercrime.gov.in par report kar sakte ho. Kuch nuksan na hua ho tab bhi report karne se dusron ki suraksha hoti hai."],
  },
  stayAlert: {
    en: ["Stay alert for follow-ups", "Scammers often return posing as recovery agents or support staff. Don't pay anyone who offers to get your money back."],
    hinglish: ["Aage ke scams se savdhaan raho", "Scammers aksar recovery agent ya support staff banke wapas aate hain. Paisa wapas dilane ka vaada karne wale kisi ko payment mat karo."],
  },
};

const HEAD = {
  en: {
    prevention: 'You have not acted yet. Verify before you do anything.',
    preventionLow: 'No strong scam signals found. Still verify before you act.',
    exposure: 'You took an action. Limit the exposure now.',
    incident: 'Treat this as urgent. Protect your money and accounts first.',
  },
  hinglish: {
    prevention: 'Aapne abhi kuch kiya nahi hai. Kuch bhi karne se pehle verify karo.',
    preventionLow: 'Koi strong scam signal nahi mila. Phir bhi action se pehle verify karo.',
    exposure: 'Aapne kuch action liya hai. Ab exposure kam karo.',
    incident: 'Ise urgent maano. Pehle apna paisa aur accounts bachao.',
  },
};

const REGION = {
  en: "These contacts are for India. Elsewhere, contact your bank and your country's cyber-crime reporting authority.",
  hinglish: "Ye contacts India ke liye hain. India ke bahar apne bank aur apne desh ki cyber-crime authority se sampark karo.",
};

export function determineMode(a = {}) {
  if (a.lostMoney || a.sharedOtp || a.sharedCardBank) return 'incident';
  if (a.clicked || a.downloaded || a.sharedPassword || a.sharedPersonal) return 'exposure';
  return 'prevention';
}

export function buildGuidance({ mode, severity, actions = {}, language = 'en', flags = {} }) {
  const lang = language === 'hinglish' ? 'hinglish' : 'en';
  const picked = [];
  const add = (k, p) => { if (!picked.some((x) => x[0] === k)) picked.push([k, p]); };
  const a = actions;

  if (mode === 'incident') {
    add('callBank', 'now');
    if (a.lostMoney) add('report1930', 'now');
    if (a.sharedPassword) add('changePassword', 'now');
    if (flags.remoteAccess) add('removeRemote', 'now');
    add('secureAccounts', 'next');
    if (a.downloaded) add('malware', 'next');
    if (a.clicked) add('clicked', 'next');
    add('evidence', 'next');
    if (!a.lostMoney) add('reportPortal', 'later');
    add('stayAlert', 'later');
  } else if (mode === 'exposure') {
    if (a.sharedPassword) add('changePassword', 'now');
    if (a.downloaded) add('malware', 'now');
    if (flags.remoteAccess) add('removeRemote', 'now');
    if (a.clicked) add('clicked', 'now');
    if (a.sharedPersonal) add('personal', 'next');
    add('dontPay', 'next');
    add('evidence', 'later');
    add('reportBlock', 'later');
  } else if (severity === 'low') {
    add('verify', 'now');
    add('neverShare', 'next');
  } else {
    add('dontPay', 'now');
    add('verify', 'now');
    add('reportBlock', 'next');
    add('neverShare', 'later');
  }

  const contacts = [];
  if (mode === 'incident') contacts.push({ label: 'National Cyber Crime Helpline (India)', value: '1930' });
  if (mode !== 'prevention') contacts.push({ label: 'Cyber Crime Reporting Portal (India)', value: 'cybercrime.gov.in' });

  const headline = mode === 'prevention' && severity === 'low' ? HEAD[lang].preventionLow : HEAD[lang][mode];
  return {
    headline,
    steps: picked.map(([k, priority]) => ({ priority, title: S[k][lang][0], detail: S[k][lang][1] })),
    contacts,
    regionNote: contacts.length ? REGION[lang] : null,
  };
}
