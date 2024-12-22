# **Issue Tracking System API**

## **Overview**
The **Issue Tracking System API** is a backend service designed to facilitate the management of projects and issues. The API supports user authentication, project management, issue tracking, and comment handling, with role-based access control for secure operations.

## **Features**
- User Authentication (Sign-up, Sign-in, Refresh Token)
- Role-based access control (Admin, Project Manager, Developer)
- Project Management (Create, Update, List, Delete)
- Issue Tracking (Create, Assign, Update, List with Pagination)
- Comment Handling (Add and View Comments)
- Secure Authentication using JWT
- Input Validation and Error Handling

---

## **Tech Stack**
- **Node.js**
- **Express.js**
- **Database**: MongoDB (or replace with MySQL/SQLite if applicable)
- **Authentication**: JWT
- **Other Tools**: Mongoose, dotenv, bcrypt, and more.

---

## **Installation and Setup**

### **Prerequisites**
Ensure you have the following installed:
- Node.js (v16+)
- MongoDB (or appropriate database)
- npm or yarn

### **Steps**
1. Clone the repository:
   ```bash
   git clone <repository-url>
