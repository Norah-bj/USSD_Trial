# MotherLink – USSD-Based Maternal & Child Health Support System

MotherLink is a digital health platform designed to support **pregnant women and mothers with children under five** in Rwanda.  
It works on **basic phones through USSD**, allowing access to life-saving information, CHW assistance, and emergency help — even without internet.

MotherLink includes:
- A **USSD application** for mothers
- A **CHW dashboard**
- A **Hospital dashboard**
- A **future ambulance GPS tracking system** (planned)

---

## 🚀 Features

### 📱 USSD Application (Mother Interface)
Accessible on any phone using a simple dial code (e.g. *123*4#).

- **Registration & Profile Update**
- **Maternal Health Information**
  - Pregnancy tips  
  - Child growth information  
  - Danger-sign education  
- **Emergency Distress Button**
  - Alerts nearest CHW  
  - CHW escalates to ambulance/hospital  
- **Ask a Health Question**
  - Questions routed to CHW dashboard
- **AI Support**
  - Simple Q&A for health information (non-emergency)
- **Appointment Tracking**
  - Mothers can view upcoming ANC/postnatal appointments

---

## 👩‍⚕️ CHW Dashboard (Community Health Workers)

Powered by a web app:

- View registered mothers in their village  
- Receive distress alerts instantly  
- Respond and record actions taken  
- View and reply to questions from mothers  
- Monitor appointment schedules  
- Track health progress and danger signs  

---

## 🏥 Hospital Dashboard

For health centers and district hospitals:

- Receive CHW-forwarded emergencies  
- Assign ambulances or alternative transport  
- View patient profiles and medical info  
- Track service usage  
- Generate reports for monitoring and evaluation  

---

## 🧭 Future Feature: Ambulance GPS Tracking

In the next version, MotherLink will introduce:

- **Real-time ambulance location**
- **Estimated arrival time for CHWs & hospitals**
- **Faster routing based on nearest available ambulance**
- **History of ambulance trips and response time data**

---

## 🌍 Impact Areas (SDGs)

MotherLink contributes to:

- **SDG 1 – No Poverty**  
- **SDG 3 – Good Health & Well-Being**  
- **SDG 5 – Gender Equality**  
- **SDG 9 – Industry, Innovation & Infrastructure**  
- **SDG 10 – Reduced Inequalities**

---

## 🏗️ System Architecture

USSD Phone
↓
Africa's Talking API
↓
Node.js (Express Server)
↓ ↓
Postgres DB CHW Dashboard (React)
↓
Hospital Dashboard

yaml
Copy code


---

## 🛠️ Tech Stack

### Backend
- Node.js (Express.js)
- Africa’s Talking API (USSD)
- Neon PostgreSQL

### Frontend
- React.js  
- Tailwind CSS  

### Other Integrations
- SMS alerts (via AT)  
- Future GPS tracking  
- AI for assistance and answering question about health tips

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourname/motherlink
cd motherlink
2. Install dependencies
bash
Copy code

npm install
3. Environment Variables
Create .env:

env
Copy code

PORT=8080
AT_API_KEY=your_key
AT_USERNAME=your_username
DATABASE_URL=postgresql://your_neon_connection_string
4. Start the server
bash
Copy code

npm run dev
🧩 USSD Menu Structure (Example)
markdown
Copy code

1. Registration
2. Update Information
3. Ask a Question
4. Emergency Distress
5. AI Assistance
6. Settings
7. Appointment Service
🧪 Testing USSD
Use Africa’s Talking simulator:

https://simulator.africastalking.com/

Or expose your server:

bash
Copy code

npm run ngrok
🧵 Folder Structure
pgsql
Copy code

src/
 ├── config/
 │     └── ussdMenus.js
 ├── controllers/
 │     └── ussdController.js
 ├── locales/
 ├── middlewares/
 ├── routers/
 ├── services/
 ├── utils/
#  ├── dashboards/
#  │     ├── chw-dashboard/
#  │     └── hospital-dashboard/
 └── server.js
🗺️ Future Roadmap
Real-time ambulance GPS

Offline CHW support

Voice-based system for mothers who can't read

Machine-learning danger sign predictions

National coverage rollout

🤝 Partnerships 
MotherLink plans to partner with:

Ministry of Health (MoH)

Rwanda Biomedical Center (RBC)

UNICEF

WHO

UNFPA

Imbuto Foundation

NGOs supporting maternal & child health

We for Health

👥 Team
CEO – Strategy & Partnerships

COO and CTO – Operations & Field Coordination and Chief Technology Officer

CMO – Market Outreach & Data Insights

Finance Lead – Budgeting, sustainability & investment model
