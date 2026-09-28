🚚 FleetFlow — Real-Time Logistics & Fleet Management Platform
![Image](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Image](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Image](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Image](https://img.shields.io/badge/Prisma_ORM_v6-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Image](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Image](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
FleetFlow is an enterprise-grade, full-stack logistics and fleet management platform engineered to automate modern delivery operations from manifest intake to final customer doorstep delivery.
📋 Table of Contents
Overview
System Architecture
Key Features
User Roles & Portals
Tech Stack
Getting Started
Prerequisites
Installation & Setup
Database Configuration & Migrations
Running the Application
Database Schema (Prisma)
API Documentation
Project Structure
License
🌟 Overview
Logistics companies often juggle disconnected spreadsheets, manual phone dispatches, and paper delivery receipts. FleetFlow unifies the entire supply-chain lifecycle into a single reactive operational hub:
Centralized Dispatching: Stage multi-stop routes with vehicle payload validation and live driver assignment.
Real-Time Fleet Telemetry: Live interactive vector map tracking vehicle coordinates, road bearings, and velocity.
Driver Mobile Experience: Responsive touch interface for drivers with sequential stop navigations and electronic Proof of Delivery (e-POD).
Public Customer Tracking: Recipient self-service portal to track package milestones and estimated delivery windows.
Fleet Reliability: Preventative vehicle maintenance schedules, service logs, and driver compliance monitoring.
Enterprise Persistence: Dual-layer architecture with persistent client state synchronization and a PostgreSQL schema managed by Prisma ORM.
🏗️ System Architecture
code
Text
┌────────────────────────────────────────────────────────┐
 │              CLIENT LAYER (React 19 + Vite)            │
 │  Admin Hub | Dispatcher | Driver PWA | Tracking Portal │
 └───────────────────────────▲────────────────────────────┘
                             │ REST APIs & WebSockets
 ┌───────────────────────────▼────────────────────────────┐
 │             APPLICATION SERVER (Node.js/Express)       │
 │   Role-Based Auth (JWT) | Route Engine | Telemetry API │
 └─────────────┬───────────────────────────┬──────────────┘
               │ Prisma ORM v6             │ Pub/Sub & Telemetry Cache
 ┌─────────────▼─────────────┐   ┌─────────▼──────────────┐
 │    PostgreSQL Database    │   │      Redis Cache       │
 │ Users, Shipments, Routes, │   │ Real-time coordinates, │
 │ Vehicles, Proof-of-Delivery│  │ speed, active sessions │
 └───────────────────────────┘   └────────────────────────┘
🚀 Key Features
1. Operations Overview & Real-Time KPIs
Metric counters: Total Active Shipments, Units in Transit, Fleet Utilization Rate, and SLA Success Rate.
Activity feed detailing real-time dispatch events, warehouse scans, and exceptions.
2. Live Vector Fleet Map
High-contrast interactive telemetry map with arterial road corridors.
Real-time animated simulation for on-duty couriers tracking speed (
), heading degrees, and fuel/battery SoC.
Visual vehicle state badges: On Delivery, Idling / At Hub, Maintenance.
3. End-to-End Shipment Lifecycle
Complete state machine progression:
Handling for delivery exceptions: DELIVERY_FAILED and RESCHEDULED.
Automatic generation of unique tracking identifiers (e.g., FF202609240001).
Thermal printable shipping labels complete with vector-generated barcodes and QR tags.
4. Multi-Stop Route Optimization & Dispatch
Route builder grouping orders into logical geographical stops.
Dynamic vehicle payload calculations to prevent vehicle overloading.
One-click route optimization saving distance (
) and driving duration (
).
5. Driver Mobile Interface & Electronic Proof of Delivery (e-POD)
Mobile-first layout for drivers on the road.
Sequential stop manifest with turn-by-turn navigation targets.
Two-factor delivery verification:
Customer One-Time Password (OTP) verification.
Digital touch signature and delivery note capture.
GPS geostamping recorded at the moment of delivery.
6. Public Customer Tracking Portal
Self-service tracking portal accessible without login using tracking numbers.
Visual stepper timeline indicating origin warehouse, hub processing, driver handoff, and delivery status.
7. Warehouse Intake & Integrated Package Scanner
Barcode and QR code scanner simulation to record incoming inventory into specific warehouse bays.
Live capacity gauges monitoring storage tons and active docking bay utilization.
8. Fleet Health & Preventative Maintenance
Asset inventory recording vehicle specifications, odometer logs, and legal documentation (insurance, PUC, fitness certificates).
Service scheduling with invoice cost tracking and maintenance status flags.
9. Driver Performance & Compliance
Driver roster monitoring license expirations, duty states, safety ratings, and lifetime on-time percentage.
10. Audit Logging & Compliance
Immutable system audit trails tracking actor identity, IP address, changed resource, and before/after values.
👥 User Roles & Portals
FleetFlow includes a built-in role simulator in the top navigation bar to switch between user personas:
Role	Interface	Primary Capabilities
Super Admin / Ops Manager	Executive Hub	System-wide visibility, fleet analytics, compliance audit logs, and settings.
Dispatcher	Dispatcher Hub	Multi-stop delivery route planning, driver assignments, vehicle capacity balancing.
Warehouse Manager	Warehouse Console	Inbound package scanning, dock bay management, and storage capacity tracking.
Driver	Mobile Driver Portal	Mobile-first delivery runner, sequential stop management, e-POD & signature capture.
Customer	Tracking View	Public package lookup, milestone timeline, and estimated time of arrival (ETA).
🛠️ Tech Stack
Frontend
Framework: React 19 (SPA Architecture)
Tooling: Vite 8, TypeScript 7
Styling: Tailwind CSS v4
Icons & Animation: Lucide React, Motion
State Management & Persistence: React Context API with LocalStorage caching
Backend & Database
Runtime: Node.js (v20+ / v22+)
Server Framework: Express.js
Database: PostgreSQL
ORM: Prisma ORM v6 (@prisma/client, prisma)
Real-Time: WebSockets & Redis (Pub/Sub pattern for telemetry)
⚡ Getting Started
Prerequisites
Make sure you have the following installed on your machine:
Node.js: v20.0.0 or higher
npm: v10.0.0 or higher
PostgreSQL: Local installation or cloud service (Neon, Supabase)
Installation & Setup
Clone the repository:
code
Bash
git clone https://github.com/YOUR_USERNAME/fleetflow.git
cd fleetflow
Install project dependencies:
code
Bash
npm install
Install Prisma ORM (v6):
code
Bash
npm install --save-dev prisma@6
npm install @prisma/client@6
Database Configuration & Migrations
Configure Environment Variables:
Copy the example environment file and create .env:
code
Bash
cp .env.example .env
Open .env and configure your PostgreSQL connection string:
code
Env
# PostgreSQL Connection String
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/fleetflow_db?schema=public"

# Server Port
PORT=3000
Generate the Prisma Client:
code
Bash
npm run prisma:generate
Run Database Migrations:
This applies the schema to PostgreSQL and creates all relational tables:
code
Bash
npm run prisma:migrate
(Optional) Open Prisma Studio:
To inspect and manipulate database tables in a visual GUI:
code
Bash
npm run prisma:studio
Prisma Studio runs at http://localhost:5555.
Running the Application
Launch the local development server:
code
Bash
npm run dev
Open your browser and navigate to:
code
Text
http://localhost:3000
🗄️ Database Schema (Prisma)
The PostgreSQL data model is defined in prisma/schema.prisma and includes the following relations:
code
Text
┌──────────┐       ┌───────────┐       ┌─────────────────┐
 │   User   │───────│  Driver   │───────│     Vehicle     │
 └──────────┘       └─────┬─────┘       └────────┬────────┘
                          │                      │
                          │                      │
 ┌──────────────┐   ┌─────▼─────────┐   ┌────────▼────────┐
 │   Customer   │   │ DeliveryRoute │   │   Maintenance   │
 └──────┬───────┘   └─────┬─────────┘   └─────────────────┘
        │                 │
 ┌──────▼───────┐   ┌─────▼─────────┐   ┌─────────────────┐
 │   Shipment   │───│   RouteStop   │   │    AuditLog     │
 └──────┬───────┘   └───────────────┘   └─────────────────┘
        │
 ┌──────▼────────────┐
 │  ProofOfDelivery  │
 └───────────────────┘
User: Administrators, dispatchers, warehouse managers, and couriers.
Customer: Sender and consignee entities.
Driver: Driver profiles, license data, safety metrics, and GPS telemetry.
Vehicle: Commercial vehicles, capacity specs, odometer, fuel/battery state.
Warehouse: Distribution centers, storage capacity, and bay allocations.
Shipment: Packages, priority SLA, status lifecycle history, and assignments.
DeliveryRoute & RouteStop: Multi-stop planned delivery journeys.
ProofOfDelivery: OTP confirmations, customer signatures, delivery photo URLs, and GPS coordinates.
VehicleMaintenance: Service tasks, invoices, and scheduling.
AuditLog: Immutably records every operational transition.
🌐 API Documentation
FleetFlow features an interactive Swagger-style API Explorer accessible directly within the application navigation bar ("API Explorer").
Core endpoint namespaces:
POST /api/v1/auth/login — Authentication & JWT generation.
GET /api/v1/shipments — List and filter shipments by status/priority.
POST /api/v1/shipments — Create shipment manifest.
PATCH /api/v1/shipments/:id/status — Lifecycle stage transitions.
GET /api/v1/drivers — Retrieve fleet drivers and real-time locations.
POST /api/v1/routes/optimize — Multi-stop route optimization.
POST /api/v1/deliveries/:id/pod — Record electronic Proof of Delivery.
GET /api/v1/vehicles — Vehicle roster and maintenance status.
📁 Project Structure
code
Text
fleetflow/
├── prisma/
│   ├── schema.prisma           # Relational PostgreSQL database models
│   ├── migrations/             # Timestamped SQL migration history
│   └── seed.ts                 # Database seeding configuration
├── public/                     # Static assets and icons
├── src/
│   ├── components/
│   │   ├── analytics/          # Fleet analytics charts and KPI reports
│   │   ├── audit/              # Enterprise audit log viewer
│   │   ├── customer/           # Public tracking interface
│   │   ├── dashboard/          # Operations center overview
│   │   ├── docs/               # In-app setup guide and API explorer
│   │   ├── driver/             # Mobile-first driver portal & e-POD modal
│   │   ├── drivers/            # Driver roster and performance manager
│   │   ├── layout/             # Top bar navigation and role switcher
│   │   ├── map/                # Live interactive vector fleet telemetry map
│   │   ├── routes/             # Multi-stop routing & dispatch optimization
│   │   ├── scanner/            # Barcode/QR package intake scanner
│   │   ├── shipments/          # Shipment manifest and printable labels
│   │   └── vehicles/           # Fleet inventory and maintenance tracking
│   ├── store/
│   │   └── fleetStore.tsx      # Central reactive store & persistence engine
│   ├── types/
│   │   └── index.ts            # TypeScript domain models and enums
│   ├── utils/
│   │   └── qrBarcode.ts        # Pure SVG vector QR & barcode rendering
│   ├── App.tsx                 # Root component with view routing
│   ├── index.css               # Tailwind CSS imports & global styles
│   └── main.tsx                # React DOM entry point
├── .env.example                # Example environment configuration
├── package.json                # Dependencies and npm scripts
├── tsconfig.json               # TypeScript compiler configuration
└── vite.config.ts              # Vite build configuration
📜 License
This project is licensed under the MIT License — you are free to use, modify, and distribute this software for personal or commercial projects.