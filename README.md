# NOVA - Neural Operations for Vigilance & Assistance
*From Cyber Threat Detection to Guided Action.* HackIndia 2026, KIT Kanpur.

NOVA analyzes suspicious messages, emails, URLs and screenshots: **Detect > Explain > Assess > Guide**, in three response modes (Prevention, Exposure, Incident). It is a proposed integrated approach, not a guaranteed fraud detector.

## 1. Prerequisites
- Node.js 20 LTS or newer (18.18+ works): https://nodejs.org
- MongoDB: local Community Server **or** a free MongoDB Atlas connection string
- A Gemini API key: https://aistudio.google.com/apikey

## 2. Configure (Windows PowerShell)
```powershell
cd NOVA
Copy-Item backend\.env.example backend\.env
notepad backend\.env
```
Set `GEMINI_API_KEY` and `MONGODB_URI` (local default: `mongodb://127.0.0.1:27017/nova`). Never commit `.env`.

## 3. Install and run
```powershell
npm run install:all     # installs root, backend and frontend dependencies
npm run dev             # backend on :4000 + frontend on :5173
```
Open **http://localhost:5173**. API health: http://localhost:4000/api/health

Separate terminals instead: `cd backend; npm run dev` and `cd frontend; npm run dev`.

## 4. Behaviour when something is missing
| Missing | What NOVA does |
|---|---|
| `GEMINI_API_KEY` | Rule-based analysis still runs. UI shows a clear "AI analysis did not run" notice. No fake AI output. |
| MongoDB | Analysis works but is not saved. Dashboard/History show a clear 503 message. Backend retries every 10 s. |
| Internet for OCR | First OCR run downloads Tesseract language data. Failure shows a clear message; paste text instead. |

## 5. Tests
Automated (rules engine, guidance, validation): `npm test`

Manual checklist (run with the app up):
1. Scholarship scam text (fee + OTP + deadline + `.xyz` link) > High/Critical, Prevention mode.
2. "The university has published the exam timetable on the official portal." > Low.
3. Internship "pay Rs 1,999 deposit, contact HR on WhatsApp, gmail address" > High.
4. URL `https://sbi-kyc-update.top` > look-alike + uncommon-TLD flags; `https://bit.ly/x` > informational only.
5. "Are we meeting at 1pm?" > Low, no indicators.
6. Upload a screenshot of text > Extract > edit > analyze.
7. Tick "I clicked a link" > Exposure. Tick "I shared an OTP" or "I lost money" > Incident (bank first, 1930).
8. Submit 1 character, a bad URL, a 6 MB or non-image file > clear validation errors.
9. Remove `GEMINI_API_KEY` > notice. Use a wrong key > "provider rejected" notice.
10. Stop MongoDB > "not saved" warning, Dashboard/History error states. Start fresh DB > Dashboard empty state.

## 6. Build and deploy
```powershell
npm run build      # creates frontend/dist
$env:NODE_ENV="production"; npm start
```
In production the backend also serves `frontend/dist`, so one Node service on one URL is enough (Render, Railway, a VPS). Set `MONGODB_URI` (Atlas), `GEMINI_API_KEY`, and `CLIENT_ORIGIN` to your site URL as environment variables on the host. Behind a proxy, add `app.set('trust proxy', 1)` in `backend/src/app.js` so rate limiting sees real client IPs. Note: tesseract.js needs outbound internet for language data.

## 7. Troubleshooting
- **Port in use**: change `PORT` in `backend/.env` and the proxy target in `frontend/vite.config.js`.
- **`Cannot reach the NOVA server`**: backend not running or crashed; read its terminal.
- **MongoDB connection failed**: start the MongoDB service, or whitelist your IP in Atlas.
- **"provider rejected the request"**: wrong/expired key or model name (`GEMINI_MODEL`).
- **Rate limit / quota from Gemini**: wait, or use another key.
- **PowerShell blocks npm scripts**: run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

## 8. Design notes and limits
- **Demo mode**: no authentication; all scans are shared on one installation. Add auth before multi-user use.
- **Privacy**: only the first 600 characters of text and hostnames are stored. Screenshots are processed in memory and discarded. Links are parsed, never fetched.
- **Scores** are heuristic, not calibrated probabilities. The brand-lookalike list is small and illustrative. No URL-reputation service is queried.
- Rule-based indicator text is English; AI summary and guidance steps follow the selected language.
- India-specific contacts (1930, cybercrime.gov.in) are labelled as such.
