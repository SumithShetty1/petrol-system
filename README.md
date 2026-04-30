# Petrol Pump Management System

## Project Overview

**Petrol Pump Management System** is a full-stack web application designed to streamline operations for petrol pump owners, managers, and attendants. The system provides a centralized platform to manage fuel sales, transactions, employees, and analytics in real time.

It enables efficient monitoring of pump performance, transaction tracking, and credit management while ensuring role-based access control for different users.



## Key Features

- **Role-Based Access Control** — Supports Admin, Owner, Manager, and Attendant roles with secure access.
- **Pump Management** — Create and manage multiple petrol pumps with detailed information.
- **Transaction Tracking** — Record and monitor fuel transactions (petrol/diesel) with quantity and sales.
- **Dashboard Analytics** — Real-time insights including sales, fuel distribution, and credit usage.
- **Credit System** — Track credits earned and redeemed by customers.
- **Date-Based Filtering** — View data by today, week, month, year, or custom date range.
- **Employee Management** — Manage staff across pumps with role assignments.
- **Responsive UI** — Optimized for desktop and mobile usage.



## Technologies Used

| Layer | Technology |
|---|---|
| Frontend | React (TypeScript), Tailwind CSS |
| Backend | Django, Django REST Framework |
| Authentication | JWT (JSON Web Tokens) |
| Database | PostgreSQL (Production), SQLite (Development) |
| API | RESTful APIs using DRF |


## How to Run This Project Locally
 
### 1. Clone the Repository
 
```bash
git clone https://github.com/SumithShetty1/petrol-pump-management-system.git

cd petrol-pump-management-system
```

 
## Backend Setup (Django)
 
### 2. Navigate to Backend
 
```bash
cd backend
```
 
### 3. Create Virtual Environment
 
```bash
python -m venv venv
```
 
### 4. Activate Virtual Environment
 
**Windows:**
 
```bash
.\venv\Scripts\activate
```

 
### 5. Install Dependencies
 
```bash
pip install -r requirements.txt
```
 
### 6. Configure Environment Variables
 
Create a `.env` file inside `backend/`:
 
```bash
copy .env.example .env
```
 
Then update the values:
 
```env
SECRET_KEY=your_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
CSRF_TRUSTED_ORIGINS=http://localhost:5173
DATABASE_URL=your_database_url
```
 
### 7. Apply Migrations
 
```bash
python manage.py migrate
```
 
### 8. Create Superuser (Required for Admin Access)
 
```bash
python manage.py createsuperuser
```
 
Follow the prompts:
 
- **Username** → Enter your phone number (used as login identifier)
- **Email** → Optional
- **Password** → Set your password

#### Access Django Admin
 
After running the server, open:
 
```
http://127.0.0.1:8000/admin/
```
 
### 9. Run Backend Server
 
```bash
python manage.py runserver
```
 
> Backend runs at: **http://127.0.0.1:8000**
 

 
## Frontend Setup (React + Vite)
 
Open a **new terminal**:
 
### 10. Navigate to Frontend
 
```bash
cd frontend
```
 
### 11. Install Dependencies
 
```bash
npm install
```
 
### 12. Configure Environment
 
Create a `.env` file inside `frontend/`:

```bash
copy .env.example .env
```
 
Then update the value:

```env
VITE_API_URL=http://127.0.0.1:8000
```
 
### 13. Run Frontend
 
```bash
npm run dev
```
 
> Frontend runs at: **http://localhost:5173**
 


## Admin Access (Development Only)
 
> If a pre-configured SQLite database (`db.sqlite3`) is included in the repository, you can use:
 
| Field | Value |
|---|---|
| Username | `admin` |
| Password | `admin1*` |
 
If not, create a superuser using:
 
```bash
python manage.py createsuperuser
```
