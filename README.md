# NeighbourShelf — Neighbourhood Lending Library 📚🤝

[![MERN Stack](https://img.shields.io/badge/Stack-MongoDB%20%7C%20Express%20%7C%20React%20%7C%20Node.js-green.svg)](https://react.dev/)
[![IEEE Std 830-1998 Compliant](https://img.shields.io/badge/Specification-IEEE%20Std%20830--1998-blue.svg)](https://standards.ieee.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Course](https://img.shields.io/badge/Course-Full%20Stack%20Development%20using%20MERN-orange.svg)](https://ictkerala.org/)

**ICT ACADEMY OF KERALA (ICTAK)**  
*Full Stack Web Development Capstone Project*  
**Prepared by:** Athulkrishna KS  
**Institution:** Sahrdaya College of Engineering and Technology  
**Specification:** IEEE Std 830-1998 Compliant Software Requirements Specification (SRS Version 1.0)

---

## 📖 1. Project Overview & Motivation

Many households own items they use only a few times a year (drills, ladders, party pressure cookers, camping tents, lawn mowers, projectors), while neighbours either purchase duplicates or go without. Informal lending over WhatsApp groups lacks a searchable catalogue, provides no tracking of who holds what, and provides zero accountability when items are returned late or damaged.

**NeighbourShelf** solves this by giving each residential locality a single, searchable, trustworthy digital shelf:
- **Locality-Partitioned Discovery:** Residents only see and borrow items available within their verified residential neighbourhood.
- **Accountable Loan Lifecycle:** Requests require start and return dates constrained by the owner's maximum loan limit. Overlapping conflicting requests are automatically managed upon approval.
- **Phone Privacy by Default:** Contact numbers are revealed **only** between parties of an approved loan.
- **Community Trust Score:** Mutual 1-to-5 star ratings with feedback upon loan return build verifiable reputation.
- **Administrative Moderation:** Administrative dashboard for locality management, user suspension/reinstatement, and listing moderation.

---

## 🛠️ 2. Technology Stack

- **Frontend:** React 18, Vite 5, Lucide Icons, Pure CSS3 Design System (Mobile-first, Responsive $\ge 360\text{px}$, WCAG AA compliant).
- **Backend:** Node.js 20 LTS, Express.js 4 REST API.
- **Database:** MongoDB Atlas (Mongoose ODM 8) with automatic zero-config in-memory MongoDB fallback for instant local demonstration.
- **Security:** Bcrypt password hashing (10 salt rounds), Stateless JSON Web Tokens (24h validity, $\ge 32$-character secret), IP rate limiter (10 attempts/min).
- **Testing:** Automated test suite (`node --test tests/*.test.js`) verifying auth, locality isolation, and user suspension.

---

## 📋 3. Functional Requirements Traceability Matrix

| Requirement ID | Specification | Status | Implementation Details |
| :--- | :--- | :---: | :--- |
| **FR-1.1** | User registration (name, email, password $\ge 8$ chars, locality) | ✅ Complete | `POST /api/auth/register`, duplicate email rejection |
| **FR-1.2** | Bcrypt password hashing | ✅ Complete | Salt factor 10 before saving to DB |
| **FR-1.3** | Signed JWT valid for 24 hours | ✅ Complete | Stateless bearer token issued upon login |
| **FR-1.4** | Profile editing (name, phone, bio) | ✅ Complete | `GET, PUT /api/users/me` |
| **FR-1.5** | Trust score and completed loans display | ✅ Complete | Calculated average of 1-5 ratings & counter |
| **FR-2.1** | Item listing (title, category, condition, max 3 photos, max loan days) | ✅ Complete | `POST /api/items` with photo limit validation |
| **FR-2.2** | Owner edit & delete permissions | ✅ Complete | Ownership checks prevent tampering |
| **FR-2.3** | Mark listing temporarily unavailable (hidden) | ✅ Complete | `status: 'hidden'` toggle hides item from search |
| **FR-2.4** | Deletion safeguard for active loans | ✅ Complete | Rejects deletion with HTTP 409 if active loan exists |
| **FR-3.1** | Locality-fenced item browsing | ✅ Complete | Queries filtered strictly to `req.user.locality` |
| **FR-3.2** | Keyword search, category filter, "available now" filter | ✅ Complete | Full-text title/desc regex + category + status filters |
| **FR-3.3** | Pagination in blocks of 12 items | ✅ Complete | Standard 12-item block pagination with page controls |
| **FR-4.1** | Date-based borrow request within duration limit | ✅ Complete | `POST /api/loans` validating `dueDate > startDate` |
| **FR-4.2** | Prohibition on borrowing own or loaned items | ✅ Complete | Rejects borrowing own item or item `on_loan` |
| **FR-4.3** | Lender approval & overlap resolution | ✅ Complete | Approval sets item to `on_loan` & declines overlapping requests |
| **FR-4.4** | Borrower cancellation of pending requests | ✅ Complete | `PATCH /api/loans/:id/cancel` |
| **FR-4.5** | Return confirmation | ✅ Complete | Sets item back to `available` & increments completed loans |
| **FR-4.6** | Automatic overdue detection | ✅ Complete | Dynamic status flag if `now > dueDate` and unreturned |
| **FR-5.1** | Mutual ratings (1-5 stars + comment) | ✅ Complete | `POST /api/loans/:id/ratings` (strictly once per loan) |
| **FR-5.2** | Dynamic Trust Score recalculation | ✅ Complete | Recalculates average rating after each submission |
| **FR-5.3** | Phone number privacy protection | ✅ Complete | Phone number sanitized unless loan is approved/returned |
| **FR-6.1** | Locality creation & renaming | ✅ Complete | `POST, PUT /api/admin/localities` |
| **FR-6.2** | Admin listing removal | ✅ Complete | `DELETE /api/admin/items/:id` cancels pending requests |
| **FR-6.3** | User suspension & reinstatement | ✅ Complete | Suspended users cannot log in (HTTP 403) |
| **FR-6.4** | Moderation authorization guard | ✅ Complete | Returns HTTP 403 Forbidden to non-administrators |

---

## 🚀 4. Quick Start & Local Execution

### Prerequisites
- Node.js (v18, v20 LTS, or v22+)
- Git

### Installation
Clone the repository and install all dependencies:
```bash
git clone <repo-url>
cd capstone
```

### Running the Full Application
In separate terminal windows (or concurrently):

**Terminal 1 — Backend REST API:**
```bash
cd server
npm start
```
*Note: The server starts on `http://localhost:5000`. If no `MONGODB_URI` is provided, an in-memory MongoDB cluster starts automatically with zero external dependencies.*

**Terminal 2 — Frontend Client:**
```bash
cd client
npm run dev
```
*The client starts on `http://localhost:5173` and automatically proxies `/api` calls to the backend.*

---

## 🔑 5. Pre-Seeded Demonstration Accounts

For academic mentors and ICTAK evaluators, the application is pre-seeded with realistic Kerala localities and test accounts:

| Role | Email | Password | Locality | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | `admin@neighbourshelf.org` | `admin1234` | Sahrdaya Green Valley | System moderator with Admin Dashboard access |
| **Member (Athul)** | `athul@example.com` | `password123` | Sahrdaya Green Valley | Active lender & borrower (Drill, Projector, Air Fryer) |
| **Member (Meera)** | `meera@example.com` | `password123` | Sahrdaya Green Valley | Active borrower (Camping Tent, Cooker, Racquets) |
| **Member (Rahul)** | `rahul@example.com` | `password123` | Sahrdaya Green Valley | Community member (Ladder, Pressure Washer, Jigsaw) |
| **Suspended Demo** | `suspended@example.com` | `password123` | Palm Grove Association | Demonstrates FR-6.3 login suspension handling |

*(Quick one-click login buttons are also provided directly on the Login page for instant testing)*

---

## 🧪 6. Automated Testing

Run the automated test suite in the server directory:
```bash
cd server
npm test
```
The test suite verifies:
- API health check (`/api/health`)
- User login and JWT authentication token generation
- Account suspension enforcement (HTTP 403 for suspended users)
- Locality-partitioned catalogue query isolation

---

## 🌐 7. API Contract Summary (SRS Section 6.2)

### Authentication
- `POST /api/auth/register` — Register new resident (Public)
- `POST /api/auth/login` — Login & receive JWT (Public, Rate Limited 10/min)

### User Profile
- `GET /api/users/me` — Current user profile with Trust Score (Member)
- `PUT /api/users/me` — Update name, phone, bio (Member)
- `GET /api/users/:id` — Public profile of community member (Member)

### Items & Catalogue
- `GET /api/items` — Browse locality items (`q`, `category`, `available`, `page`) (Member)
- `POST /api/items` — List new item (Member)
- `GET /api/items/:id` — View single item details (Member)
- `PUT /api/items/:id` — Update listing or toggle hidden state (Owner)
- `DELETE /api/items/:id` — Delete listing (Safeguarded against active loans) (Owner)
- `GET /api/items/my/listings` — Member's own listed shelf (Member)

### Loans & Workflow
- `POST /api/loans` — Submit borrow request with date constraints (Member)
- `GET /api/loans?role=lender|borrower` — Retrieve active and historical loans (Member)
- `PATCH /api/loans/:id/approve` — Approve request (sets item to on-loan, declines overlaps) (Lender)
- `PATCH /api/loans/:id/decline` — Decline request (Lender)
- `PATCH /api/loans/:id/cancel` — Cancel pending request (Borrower)
- `PATCH /api/loans/:id/return` — Confirm return (item available again) (Lender)
- `POST /api/loans/:id/ratings` — Submit 1-5 star rating and comment (Lender or Borrower)

### Administration
- `GET /api/admin/stats` — Platform-wide statistics (Admin)
- `GET /api/admin/users` — List and inspect all users (Admin)
- `PATCH /api/admin/users/:id/status` — Suspend or reinstate user (Admin)
- `GET, POST, PUT /api/admin/localities` — Manage and rename localities (Admin)
- `DELETE /api/admin/items/:id` — Remove inappropriate listings (Admin)

---

## 🎓 8. Submission Information

- **Portal:** Paatshala (ICT Academy of Kerala)
- **Course:** Full Stack Development using MERN Stack
- **Student Name:** Athulkrishna KS
- **College:** Sahrdaya College of Engineering and Technology
- **Version:** 1.0 (October 2026)
