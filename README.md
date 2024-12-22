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
   git clone https://github.com/DrFemzy/mently-issue-tracking-system.git
2. Navigate to the project directory:
  ```bash
  cd issue-tracking-system
3. Install dependencies:
  ```bash
  npm install
4. Create a .env file in the root directory and configure the environment variables:
  ```env
  PORT=5000
  MONGO_DB_CONNECTION_STRING=mongodb+srv://DrFemzy:Femzy1..,@cluster0.zwwjb.mongodb.net/IssueTrackingSystem?retryWrites=true&w=majority
  REFRESH_TOKEN_SECRET=ref2998490338849jkdkdie9e9dud9eueuj
  ACCESS_TOKEN_SECRET=acc39iak9do093ikd983jueie9dkdke9eue9
5. Start the development server
  ```bash
  npm run start:dev