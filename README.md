# Matri Shakti Solar Infrastructure Portal

Architecture divided into **3 distinct, fully isolated parts**:

```
d:/matri-shakti-solar-portal-main/
├── backend/          # [Port 5000] Standalone Node.js & Express API Server
├── frontend/         # [Port 8080] Public Solar Customer Website
├── admin/            # [Port 5174] Dedicated Isolated Admin & CRM Panel
├── scripts/
│   └── dev.js        # Multi-service dev runner
└── package.json      # Orchestration scripts
```

---

## 🚀 Quick Start Commands

### 1. Run Everything Together (Recommended)
Runs Backend, Frontend, and Admin simultaneously in one terminal:
```bash
npm run dev
# or
npm start
```

### 2. Run Services Individually

* **Backend API Server Only (Port 5000):**
  ```bash
  npm run dev:backend
  # or: cd backend && npm run dev
  ```

* **Frontend Customer Website Only (Port 8080):**
  ```bash
  npm run dev:frontend
  # or: cd frontend && npm run dev
  ```

* **Admin CRM Panel Only (Port 5174):**
  ```bash
  npm run dev:admin
  # or: cd admin && npm run dev
  ```

### 3. Build All Projects for Production
```bash
npm run build
```

---

## 🔗 Port & URL Mapping

| Service | Port | Local URL | Description |
| :--- | :--- | :--- | :--- |
| **Backend API** | `5000` | [http://localhost:5000](http://localhost:5000) | REST API, MongoDB Mongoose, JWT Auth, File Uploads |
| **Customer Website** | `8080` | [http://localhost:8080](http://localhost:8080) | Public customer pages, PM Surya Ghar, Solar Calculator |
| **Admin CRM Panel** | `5174` | [http://localhost:5174](http://localhost:5174) | Isolated CRM dashboard, Project Master File, Dealers |

---

## 🛡️ Admin Login Credentials

* **Login URL:** [http://localhost:5174/login](http://localhost:5174/login)
* **Email:** `admin@matrishakti.com`
* **Password:** `Admin@123456`

---

## 📁 Detailed Directory Structure

### 1. `backend/`
- **`src/server.ts`**: Express application with CORS, cookie parsing, health check, and routing.
- **`src/db.ts`**: MongoDB connection & automatic admin/catalog seeding.
- **`src/auth.ts`**: JWT session management & token verification.
- **`src/models/`**: Mongoose models (`Lead`, `Project`, `Dealer`, `Technician`, `Installation`, `Complaint`, `Admin`, `SolarCompany`, `SolarPackage`, `SolarProduct`, `Counter`).
- **`src/api.ts`**: Complete CRM API handlers with transaction calculations, document tracking, and commission management.

### 2. `frontend/`
- Pure customer-facing solar portal.
- Includes Home, About, Services, PM Surya Ghar Yojana, Solar Panels, Subsidy Calculator, Apply Now, Customer Complaint Support, EMI Calculator, Gallery, and Contact.
- Zero admin code, zero admin routes, zero admin overhead.
- Proxies `/api` to backend `http://localhost:5000`.

### 3. `admin/`
- Standalone Vite + React 19 application.
- Dedicated modern CRM UI layout with dark/light styling.
- Full integration of:
  - **Project Master File (`ProjectMasterFile.tsx`)**: Complete end-to-end solar lifecycle tracking, payments, timeline, issues.
  - **Dealer Manager (`DealerManager.tsx`)**: Commission calculations, dealers list, active installations.
  - **Installation Manager (`InstallationManager.tsx`)**: Survey, net metering, discom progress.
  - **Technician Manager (`TechnicianManager.tsx`)**: Field staff assignment & task statuses.
  - **Complaint Manager (`ComplaintManager.tsx`)**: Customer grievance resolution ticketing.
  - **Catalog Management**: Solar companies, packages, and products.
- Proxies `/api` to backend `http://localhost:5000`.
