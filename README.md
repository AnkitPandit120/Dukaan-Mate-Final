# 🏪 DukaanMate

**DukaanMate** is a smart, AI-powered shop management platform designed specifically for small shopkeepers. It simplifies digital bookkeeping by tracking sales, inventory, payments, and expenses in one intuitive interface. With its unique voice-based "Rush Mode," it ensures that even the busiest shopkeepers can stay organized without touching a keyboard.

---

## ✨ Key Features

### 📈 Smart Dashboard
- Real-time visualization of sales trends and revenue.
- Quick stats on daily performance and low-stock alerts.
- Data-driven insights to help grow your business.

### 🎙️ Rush Mode (AI Voice Notepad)
- **Voice-to-Task:** Record sales or notes using your voice during peak hours.
- **AI Processing:** Powered by Google Gemini AI to intelligently parse voice notes into structured data.
- **Microphone Integration:** Simple one-tap recording for hands-free management.

### 📦 Inventory & Stock Management
- Track stock levels with real-time updates.
- Low-stock notifications and automated alerts.
- Categorized product management for easy searching.

### 💰 Payments & Sales
- Track daily sales transactions seamlessly.
- Manage credit (Udhaar) and pending payments from customers.
- Record shop expenses to calculate net profit accurately.

### 📄 Professional Reports
- Generate PDF reports for sales and inventory using `jsPDF`.
- Export data for tax or accounting purposes.
- Visual charts powered by `Recharts`.

### 🌍 Multi-Language & Theme Support
- Fully localized interface for local shopkeepers.
- Dark and Light mode support for comfortable usage in any lighting.

### 🤖 Built-in AI Chatbot
- Get instant help on how to use the app or business tips.
- Powered by Google Gemini for natural conversation.

---

## 🚀 Tech Stack

- **Frontend:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **AI Engine:** [Google Gemini API](https://ai.google.dev/)
- **Data Visualization:** [Recharts](https://recharts.org/)
- **PDF Generation:** [jsPDF](https://github.com/parallax/jsPDF) + [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-autotable)
- **Routing:** [React Router 7](https://reactrouter.com/)

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- A Google Gemini API Key

### Steps
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd dukaanmate
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your API key:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure

```text
├── components/          # Reusable UI components (Sidebar, Navbar, etc.)
├── context/             # Global states (Auth, Language, Theme, Data)
├── data/                # Mock data and localization strings
├── pages/               # Main route components (Dashboard, Sales, Stock)
├── utils/               # AI logic and helper functions
├── types.ts             # Global TypeScript interfaces
└── App.tsx              # Main application routing and providers
```

---

## 🔒 Security & Roles
- **Admin Panel:** Specialized view for store owners to manage overall settings.
- **Protected Routes:** Secure login flow to protect sensitive business data.

---

## 📝 License
This project is licensed under the MIT License.

---

*Built with ❤️ for small businesses*
