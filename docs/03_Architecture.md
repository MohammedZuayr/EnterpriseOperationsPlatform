# Enterprise Operations Platform
## Software Architecture

### Purpose

The Enterprise Operations Platform (EOP) is a modular web application designed to simplify enterprise management for small and medium-sized organizations. Instead of providing a large, all-in-one ERP solution, the platform focuses on lightweight, intuitive modules that can operate independently or together.

The first implemented module is the **IT Asset Management (ITAM)** system, which allows organizations to manage IT assets, monitor assignments, and maintain an inventory of company equipment.

---

# Architecture Style

The system follows a three-tier architecture:

1. Presentation Layer (Frontend)
2. Application Layer (Backend API)
3. Data Layer (Database)

This architecture separates responsibilities, making the application easier to maintain, test, and extend.

---

# System Components

### Frontend

- React
- TypeScript
- Responsive user interface
- Communicates with the backend using REST APIs

---

### Backend

- ASP.NET Core Web API
- Business logic
- Authentication
- Authorization
- Validation
- Database access

---

### Database

- PostgreSQL

Stores:

- Users
- Assets
- Categories
- Departments
- Asset Assignments
- Audit Logs (future)

---

# Communication Flow

1. User opens the web application.
2. React sends HTTP requests to the ASP.NET Core API.
3. The API validates the request.
4. Business logic executes.
5. Data is read from or written to PostgreSQL.
6. The API returns a JSON response.
7. React updates the interface.

---

# Design Principles

- Modular architecture
- Separation of concerns
- Scalable design
- RESTful API
- Clean and simple user interface
- Easy future integration with ERP systems

---

# Future Modules

After the IT Asset Management module, future modules may include:

- HR Management
- Inventory Management
- Help Desk
- Procurement
- Project Management
- Customer Management (CRM)

# Technology Stack

| Layer | Technology |
|--------|------------|
| Frontend | React + TypeScript |
| Backend | ASP.NET Core Web API (.NET 8) |
| Database | PostgreSQL |
| Version Control | Git + GitHub |
| IDE | Visual Studio Code |
| API Testing | Swagger (built into ASP.NET Core) |
| Database Tool | pgAdmin 4 |
| Documentation | Markdown |
| Diagrams | diagrams.net |