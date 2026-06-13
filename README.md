# 🌿 CarbonSense — Carbon Footprint Tracker

**CarbonSense** is a modern, high-fidelity Carbon Footprint Awareness and Tracking Platform designed to help individuals monitor, analyze, and systematically reduce their daily greenhouse gas emissions.

---

## 🎯 Project Overview

*   **Vertical**: Individual Carbon Awareness
*   **Approach**: Hybrid Dashboard + AI Chatbot Coach + Gamified Challenges

### ⚙️ How It Works

1.  **Dashboard**: Offers a high-level summary of emissions metrics (daily, weekly, monthly, and vs. global averages) alongside an interactive, visual weekly emissions chart (Recharts) and a real-time list of logged activities.
2.  **Log Activity**: A dynamic calculator form where users can log daily habits (Transport, Food, Energy, Shopping, and Other). Emissions are calculated in real-time as users type, using standard emission coefficients.
3.  **AI Insights**: A direct chat gateway ("🤖 AI Carbon Coach") that queries Google Gemini API (gemini-3.5-flash) to analyze a user's day, estimate daily carbon impact, identify emission culprits, and recommend actionable reduction tips.
4.  **Eco Challenges**: A gamified track where users participate in 6 custom carbon-saving challenges (Easy, Medium, Hard). Completing challenges triggers streak increments, updates progress bars, and computes overall carbon-reduction stats and tree equivalencies.

---

## 💻 Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React (Vite)** | Frontend client architecture and dev execution |
| **Tailwind CSS v4** | Modern theme styling, layouts, animations, and transitions |
| **React Router DOM** | SPA page routing (`/`, `/log`, `/insights`, `/challenges`) |
| **Recharts** | Data visualization for weekly emissions history |
| **Lucide React** | High-quality responsive SVG icons |
| **Google Gemini API (gemini-3.5-flash)** | AI Carbon Coach: free, browser-compatible REST API |

---

## 🆓 Free Services Used

| Service | Purpose | Cost |
| :--- | :--- | :--- |
| **Google Gemini API (gemini-3.5-flash)** | AI insights (free tier) | Free |
| **localStorage** | Data persistence | Free (browser) |
| **Recharts** | Data visualization | Free (open source) |
| **Lucide React** | Icons | Free (open source) |
| **Vercel** | Hosting & deployment | Free tier |
| **Google Fonts** | Typography | Free |
| **GitHub** | Version control | Free |

---

## 🚀 Setup Instructions

1. **Clone the repo**
   ```bash
   git clone <your-repo-url>
   cd CarbonSense
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Get a free Gemini API key** from [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

4. **Create `.env` file in root** and add:
   ```env
   GEMINI_API_KEY=your_actual_key_here
   ```
   *(Note: No `VITE_` prefix — the API key is used server-side only in `/api/gemini.js`)*

5. **Run the development server**
   ```bash
   npm run dev
   ```

Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

---

## 🧠 Key Assumptions

1.  **Server-Side API Proxy**: The Gemini API key is stored in `.env` and used only in the Vercel serverless function (`/api/gemini.js`). The client never has access to the API key — it calls the proxy instead. This ensures the key is never exposed to browsers or bundled into the client-side code (`.env` is gitignored).
2.  **Emission Coefficients (Sourced from IPCC & Our World in Data)**:
    *   *Gasoline Car*: `0.21 kg CO₂ per km`
    *   *Bus / Coach*: `0.089 kg CO₂ per km`
    *   *Train / Rail*: `0.041 kg CO₂ per km`
    *   *Flight / Air travel*: `0.255 kg CO₂ per km`
    *   *Vegetarian meal*: `1.5 kg CO₂`
    *   *Non-Vegetarian meal*: `3.3 kg CO₂`
    *   *Beef-heavy meal*: `6.8 kg CO₂`
    *   *Dairy-heavy meal*: `2.5 kg CO₂`
    *   *Electricity consumption*: `0.82 kg CO₂ per kWh`
    *   *Electronics expenditure*: `0.003 kg CO₂ per ₹`
    *   *Clothing expenditure*: `0.002 kg CO₂ per ₹`
    *   *Groceries expenditure*: `0.001 kg CO₂ per ₹`
3.  **Environmental Equivalency Metric**: We assume that a single mature tree absorbs roughly `21 kg CO₂` per year. Completed challenges calculate equivalence by dividing the total saved CO₂ (kg) by `21` to estimate "tree equivalents" saved.

---

## 📸 Screenshots

*(Visual interface screenshots will be attached here upon final deployment)*

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
