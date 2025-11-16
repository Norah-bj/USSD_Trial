MotherLink – USSD-Powered Maternal & Child Health Support System

MotherLink is a USSD-first digital health platform designed to support pregnant mothers and caregivers of children under five in Rwanda. It connects communities, CHWs (Community Health Workers), and hospitals through a simple, reliable, and accessible system that works on any phone — even without internet.

MotherLink improves access to health information, emergency response, and care coordination, especially in rural or underserved areas.

🌍 Core Features
1. USSD Platform (Primary Interface)

Accessible via a short code, the USSD menu offers:

Maternal health education

Child under-5 health guidance

Emergency request system

Health reminders & follow-ups

CHW communication channel

Multi-language support (Kinyarwanda, English, French, Kiswahili)

2. CHW Dashboard

A lightweight web dashboard for community health workers:

View and manage emergency alerts from mothers

Track pregnant mothers & under-5 children in their village

Update follow-up records

Coordinate transport or call an ambulance

Monitor risk cases and escalate serious emergencies

3. Hospital Dashboard

Built for health centers and district hospitals:

Receive emergency notifications from CHWs

View maternal/child profiles

Track ambulance requests

Coordinate care with CHWs

Update appointment and referral data

4. Emergency Workflow

MotherLink fixes the biggest gap: ambulance hotline inefficiency.

When a mother sends an emergency alert:

USSD triggers the CHW instantly

CHW checks the case and responds

CHW can call ambulance crew or alternative transport

Hospital receives a log of the emergency

This removes:

Delays from busy hotline numbers

Confusion in locating the caller

Mothers being unable to explain the situation

5. Future Upgrade: GPS Ambulance Tracking

We will integrate:

GPS-based ambulance tracking

Real-time location sharing with CHWs + hospitals

ETA estimation for emergencies

Map dashboard for hospitals

This directly solves the “ambulance hotline sometimes doesn’t work” issue.

🧩 Technology Stack
Backend

Node.js (Express)

Neon Postgres (Serverless & scalable)

Africa’s Talking USSD API

Frontend

React.js

Tailwind CSS

Other

Session management for USSD

Roles: Mother, CHW, Hospital Admin

Secure data handling

🚀 Installation (Developer Guide)
1. Clone
git clone https://github.com/your-org/motherlink
cd motherlink

2. Install dependencies
npm install

3. Environment Variables

Create .env:

PORT=8080
DATABASE_URL=your_neon_postgres_connection_string
AT_API_KEY=your_africas_talking_api_key
AT_USERNAME=your_at_username

4. Start Server
npm run dev

🔄 USSD Flow Structure
{
  "sessionId": "uuid",
  "phoneNumber": "+25078XXXXXXX",
  "serviceCode": "*123#",
  "text": "1*2"
}


Routes:

POST /ussd – main USSD handler

GET / – health check

🏥 Use Cases
For Mothers

Easy-to-understand instructions for pregnancy & child health

Fast emergency support

No smartphone or internet needed

For CHWs

Faster response to emergencies

Simplified follow-up tracking

Real-time communication

For Hospitals

Organized patient flow

Better ambulance coordination

Digital records of emergencies

📊 SDG Alignment
SDG	Why MotherLink fits
SDG 3 – Good Health & Well-Being	Reduces maternal & child mortality.
SDG 1 – No Poverty	Prevents financial shocks by offering timely care and reducing emergency costs.
SDG 5 – Gender Equality	Supports women’s health access.
SDG 9 – Industry, Innovation & Infrastructure	USSD + GPS health infrastructure.
SDG 10 – Reduced Inequalities	Reaches rural populations with no smartphones.
🆚 Competitors (Rwanda)

RBC 114 Ambulance Hotline

Weakness: delay, sometimes unreachable, no tracking.

Babyl Rwanda

Focuses on consultation, not emergencies or CHWs.

Winnie's App / MOMConnect-like tools

Smartphone-based → excludes rural moms.

General CHW manual system

Slow, no digital coordination.

MotherLink is unique because it connects mothers → CHWs → hospitals → ambulance in one pipeline.

💡 Why NGOs Should Care

Direct impact on maternal & under-5 mortality

Solves emergency delays in rural areas

Works on the cheapest phones; inclusive by design

Scalable statewide

Clear data for public health planning

Supports CHWs — the backbone of Rwanda’s health system

📞 Contact

If you'd like to collaborate, contribute, or deploy MotherLink in your district:

Team MotherLink
📧 inezanorah12@gmail.com
 (example)
🌍 Rwanda
