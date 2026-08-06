# Database Design

## Purpose

The Enterprise Operations Platform (EOP) uses a relational PostgreSQL database to store and manage business information. The first implemented module is the IT Asset Management (ITAM) system.

The database is designed using normalization principles to reduce redundancy while maintaining flexibility for future expansion.

Although the initial implementation focuses on IT assets, the database structure is intended to support additional enterprise modules such as Human Resources, Inventory Management, Help Desk, and Procurement.

---

## Database Objectives

The database should:

- Store organizational information securely.
- Track IT assets throughout their lifecycle.
- Record asset assignments.
- Support authentication and authorization.
- Maintain data integrity through relationships.
- Be scalable for future enterprise modules.

---

## Core Entities

### Users

Represents employees or administrators who use the platform.

Attributes:

- UserID (PK)
- FirstName
- LastName
- Email
- PasswordHash
- Role
- DepartmentID (FK)

---

### Departments

Represents company departments.

Attributes:

- DepartmentID (PK)
- Name
- Description

---

### Categories

Represents asset categories.

Examples:

- Laptop
- Desktop
- Printer
- Router
- Monitor

Attributes:

- CategoryID (PK)
- Name
- Description

---

### Locations

Represents physical asset locations.

Attributes:

- LocationID (PK)
- Name
- Building
- Floor

---

### Assets

Represents company-owned IT equipment.

Attributes:

- AssetID (PK)
- AssetTag
- SerialNumber
- Name
- PurchaseDate
- WarrantyExpiry
- Status
- CategoryID (FK)
- LocationID (FK)

---

### AssetAssignments

Tracks which employee is assigned an asset.

Attributes:

- AssignmentID (PK)
- AssetID (FK)
- UserID (FK)
- AssignedDate
- ReturnedDate
- Notes

---

## Relationships

Department
    │
    └──< Users

Category
    │
    └──< Assets

Location
    │
    └──< Assets

Users
    │
    └──< AssetAssignments >── Assets