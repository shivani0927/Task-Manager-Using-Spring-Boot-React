# 📝 Task Manager App (Spring Boot + React)

## Overview
This is a full-stack web application for managing user tasks securely. It features user authentication, JWT-based protection for API endpoints, and complete CRUD (Create, Read, Update, Delete) functionality for tasks.

The project is divided into two separate, communicating services:
1.  **Backend:** Secure REST API built with **Spring Boot** and **Spring Security**.
2.  **Frontend:** Single-Page Application (SPA) built with **React** and **Vite**.

---

## ⚙️ Key Technologies Used
| Backend | Frontend | Security & DB |
| :--- | :--- | :--- |
| **Spring Boot** | **React** | **JWT** (JSON Web Tokens) |
| **Spring Security** | **Vite** | **PostgreSQL** |
| **Maven** | **Axios** | **CORS Configuration** |
---

## 🚀 Setup Instructions

### Prerequisites

You must have **Java 17+**, **Node.js/npm**, and a running **PostgreSQL** instance configured with the credentials in the backend's `application.properties`.

### Step 1: Start the Backend (API)

1.  Navigate to the `taskmanager` directory.
2.  Run the application:
    ```bash
    mvn spring-boot:run
    ```
    (The API will run on `http://localhost:8080/api/v1`)

### Step 2: Start the Frontend (React App)

1.  Navigate to the `task-manager-frontend` directory.
2.  Install dependencies (if you haven't recently):
    ```bash
    npm install
    ```
3.  Run the application:
    ```bash
    npm run dev
    ```
    (The app will open in your browser, typically at `http://localhost:5173`)



### 1. Clone Repo
```bash
git clone https://github.com/shivani0927/Task-Manager-Using-Spring-Boot-React.git
```


