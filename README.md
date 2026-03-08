# 🚀 Arunachala Digi World — Deployment Guide

## 📁 File Structure
```
arunachala-digi-world/
├── index.html           → Home Page
├── services.html        → Services Page
├── contact.html         → Contact Page
├── style.css            → Premium Stylesheet
├── main.js              → Animations + Form Logic
├── google-apps-script.js → Backend (Google Sheets)
└── README.md            → This file
```

---

## 🌐 STEP 1 — Deploy on GitHub Pages

1. **Create GitHub Account** at https://github.com (if you don't have one)

2. **Create New Repository**
   - Click "New Repository"
   - Name it: `arunachala-digi-world`
   - Set to: **Public**
   - Click "Create Repository"

3. **Upload Files**
   - Click "uploading an existing file"
   - Drag and drop ALL files from this folder:
     - `index.html`
     - `services.html`
     - `contact.html`
     - `style.css`
     - `main.js`
   - *(Do NOT upload google-apps-script.js — that's for Google)*
   - Click "Commit changes"

4. **Enable GitHub Pages**
   - Go to Repository → **Settings**
   - Click **Pages** in the left sidebar
   - Under "Source" select: **Deploy from a branch**
   - Branch: `main` → Folder: `/ (root)`
   - Click **Save**

5. **Your website will be live at:**
   ```
   https://YOUR-GITHUB-USERNAME.github.io/arunachala-digi-world/
   ```
   *(Wait 2-3 minutes for it to go live)*

---

## 📊 STEP 2 — Connect Google Sheets Form Backend

### Create Google Sheet:
1. Go to https://sheets.google.com
2. Create a new spreadsheet
3. Name it: **"Arunachala Digi World — Inquiries"**
4. Keep it open

### Deploy Google Apps Script:
1. Open: https://script.google.com
2. Click **"New Project"**
3. Delete the default code
4. **Copy the entire contents** of `google-apps-script.js`
5. Paste it into the editor
6. Click the **Save** button (Ctrl+S)
7. Name the project: **"ADW Form Backend"**

### Deploy as Web App:
1. Click **"Deploy"** → **"New Deployment"**
2. Click the gear icon next to "Type" → Select **"Web App"**
3. Fill in:
   - Description: `ADW Form Handler`
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **"Deploy"**
5. **Authorize permissions** when prompted (click Allow)
6. **COPY the Web App URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```

### Connect to Website:
1. Open `main.js`
2. Find line 8:
   ```javascript
   const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```
3. Replace `YOUR_SCRIPT_ID` with your actual deployment URL
4. **Re-upload** `main.js` to GitHub

---

## ✅ STEP 3 — Test Form Submission

1. Visit your live website
2. Fill out the contact form
3. Click "Submit Inquiry"
4. Check:
   - ✅ Google Sheet gets a new row
   - ✅ Email arrives at `shivshakti.2004.29.15@gmail.com`
   - ✅ Success message shows on website

---

## 🎨 Customization

### Change Colors:
Edit `style.css` → `:root` section:
```css
:root {
  --cyan: #00D4FF;    ← Primary accent color
  --gold: #FFB800;    ← Secondary accent
}
```

### Update Apps Script URL:
Edit `main.js` line 8 → `APPS_SCRIPT_URL`

### Add More Services:
Edit service cards in `index.html` and `services.html`

---

## 📱 Features Included

- ✅ 3 Pages (Home, Services, Contact)
- ✅ Premium dark UI (Stripe/Linear inspired)
- ✅ GSAP scroll animations
- ✅ Custom cursor effects
- ✅ 3D card hover tilt
- ✅ Floating background orbs
- ✅ Glassmorphism cards
- ✅ Mobile responsive + hamburger menu
- ✅ Sticky navbar with scroll effect
- ✅ Contact form with Google Sheets integration
- ✅ Email notifications on form submit
- ✅ Instagram link integration
- ✅ Client showcase (Sangeetha Holidays)
- ✅ Gradient text animations
- ✅ Scroll reveal animations

---

## 🆘 Support

Instagram: https://instagram.com/arunachaladigitial
Email: shivshakti.2004.29.15@gmail.com
