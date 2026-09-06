# Osprey Fasteners

A full-stack Fasteners Product & Quote Management System built with **React, FastAPI, PostgreSQL, SQLAlchemy, JWT Authentication, and Resend Email Service**.

## 🚀 Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* HTML5
* CSS3
* React Context API
* Fetch API

### Backend

* FastAPI
* Python
* SQLAlchemy
* Pydantic
* JWT Authentication
* Uvicorn

### Database

* PostgreSQL
* SQLAlchemy ORM
* psycopg2

### Email Service

* Resend API

### Infrastructure

* Docker
* Docker Compose
* GitHub

---

## 📁 Project Structure

```text
osprey-fasteners/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── auth.py
│   │   ├── email.py
│   │   └── ...
│   │
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   │   └── images/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── Dockerfile
│   ├── index.html
│   ├── package.json
│   └── package-lock.json
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

# ✨ Features

## Product Management

* Display products from PostgreSQL database
* Product search
* Category filtering
* Product details
* Product quantity/inventory information

## Quote Management

Users can:

* Add products to Quote
* Update product quantity
* Remove products from Quote
* View Quote items
* Submit Request Quote

## Request Quote

Submitted quote requests are stored separately from normal quote/cart items.

A normal quote item contains:

```text
request_id = NULL
```

A submitted Request Quote record contains:

```text
request_id = UUID
```

This distinction allows the frontend to prevent already submitted request records from appearing as normal cart/quote items.

## Contact Us

Users can submit contact forms through the frontend.

The backend receives the request and processes the email using the configured Resend email service.

---

# 🔐 JWT Authentication

The backend uses JWT-based authentication.

Access tokens are generated after successful authentication and are required for protected API endpoints.

## JWT Configuration

```env
SECRET_KEY=YOUR_LONG_RANDOM_SECRET_KEY
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10
```

Access tokens expire after **10 minutes**.

## Authorization Header

Protected API requests should send:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## JWT Authentication Flow

```text
User Login
    ↓
Backend validates credentials
    ↓
JWT Access Token generated
    ↓
Frontend stores token
    ↓
Frontend sends Bearer Token
    ↓
Backend validates JWT
    ↓
Protected API accessed
```

## Security

Never commit these values to GitHub:

```text
SECRET_KEY
DATABASE_URL
RESEND_API_KEY
Database passwords
API keys
```

Use environment variables instead.

---

# 📧 Resend Email Service

The project uses **Resend** for sending transactional emails.

It can be used for:

* Contact Us emails
* Quote request notifications
* Application notifications
* Other transactional emails

## Resend Configuration

Add the Resend API key to your backend `.env` file:

```env
RESEND_API_KEY=YOUR_RESEND_API_KEY
```

## Email Flow

```text
Frontend
   ↓
FastAPI API
   ↓
Email Service
   ↓
Resend API
   ↓
Recipient Email
```

Never commit the real Resend API key to GitHub.

---

# ⚙️ Environment Variables

Create a `.env` file inside the backend directory.

Example:

```env
DATABASE_URL=postgresql+psycopg2://postgres:YOUR_PASSWORD@localhost:5432/osprey_fasteners

SECRET_KEY=YOUR_LONG_RANDOM_SECRET_KEY
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10

RESEND_API_KEY=YOUR_RESEND_API_KEY
```

Replace the placeholder values with your actual configuration.

---

# 🐘 PostgreSQL Database

The application uses PostgreSQL as its database.

Example configuration:

```text
Database: osprey_fasteners
Host: localhost
Port: 5432
User: postgres
```

The backend connects to PostgreSQL through SQLAlchemy.

---

# 🐳 Docker Setup

The project includes Docker support.

Start the services:

```bash
docker compose up --build
```

Run in detached mode:

```bash
docker compose up -d --build
```

Stop the services:

```bash
docker compose down
```

Check running containers:

```bash
docker ps
```

---

# 🖥️ Local Development

## Backend

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run FastAPI:

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

---

# 📚 FastAPI Swagger Documentation

FastAPI provides automatic Swagger documentation.

Open:

```text
http://127.0.0.1:8000/docs
```

Alternative ReDoc:

```text
http://127.0.0.1:8000/redoc
```

Swagger can be used to test API endpoints directly.

---

# ⚛️ Frontend Setup

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔌 API Endpoints

## Products

### Get Products

```http
GET /products/
```

Returns available products.

---

# 🛒 Quote APIs

### Add Product to Quote

```http
POST /quotes/
```

Adds a product to the quote/cart.

### Get Quote Items

```http
GET /quotes/
```

Returns quote items.

### Update Quote Quantity

```http
PUT /quotes/{quote_id}?quantity=5
```

Example:

```http
PUT /quotes/1?quantity=5
```

Updates the quantity of a quote item.

### Delete Quote Item

```http
DELETE /quotes/{quote_id}
```

Removes an item from the quote.

### Request Quote

```http
POST /quotes/request
```

Submits the quote request.

Submitted records are associated with a `request_id`.

---

# 📩 Contact API

### Contact Us

```http
POST /api/contact/
```

Receives contact form submissions and processes the email through Resend.

---

# 🩺 Health Check

The backend provides a health endpoint:

```http
GET /health
```

Open:

```text
http://127.0.0.1:8000/health
```

This can be used to verify that the backend is running.

---

# 🔄 Application Flow

```text
                 ┌──────────────┐
                 │   React UI   │
                 └──────┬───────┘
                        │
                        │ HTTP Requests
                        ▼
                 ┌──────────────┐
                 │   FastAPI    │
                 └──────┬───────┘
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
      ┌──────────────┐      ┌──────────────┐
      │  PostgreSQL  │      │ Resend Email │
      └──────────────┘      └──────────────┘
```

---

# 🗃️ Database Flow

```text
React
  ↓
FastAPI
  ↓
SQLAlchemy
  ↓
PostgreSQL
```

SQLAlchemy acts as the ORM layer between FastAPI and PostgreSQL.

---

# 🧩 Frontend Context

The React application uses Context API for shared application state.

Important application state includes:

* Authentication state
* Quote/cart state
* User state

The Quote Context handles operations such as:

* Adding products
* Removing products
* Updating quantity
* Fetching quote items
* Submitting request quotes

---

# 🧪 API Testing

You can test the backend APIs using:

* FastAPI Swagger
* Postman
* Browser for GET APIs
* Frontend application

Swagger:

```text
http://127.0.0.1:8000/docs
```

---

# 🔒 Security Best Practices

* Use a strong `SECRET_KEY`
* Keep JWT expiration short
* Never commit `.env`
* Never commit database passwords
* Never expose Resend API keys
* Use HTTPS in production
* Validate user input
* Protect authenticated endpoints
* Store sensitive configuration in environment variables
* Configure CORS correctly

---

# 🚨 Troubleshooting

## Backend is not starting

Install dependencies:

```bash
pip install -r requirements.txt
```

Then run:

```bash
uvicorn app.main:app --reload
```

---

## PostgreSQL Connection Error

Check:

* PostgreSQL is running
* Database exists
* Username is correct
* Password is correct
* Port is correct
* `DATABASE_URL` is correct

---

## JWT Authentication Error

Check:

```env
SECRET_KEY=YOUR_LONG_RANDOM_SECRET_KEY
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10
```

Also verify that the request contains:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## Resend Email Not Working

Check:

```env
RESEND_API_KEY=YOUR_RESEND_API_KEY
```

Also verify:

* API key is valid
* Sender email/domain is configured correctly
* Recipient email is correct
* Backend can access the Resend service

---

# 📦 Git Commands

Clone repository:

```bash
git clone https://github.com/nayabkan/osprey-fasteners1.git
```

Enter project:

```bash
cd osprey-fasteners1
```

Check status:

```bash
git status
```

Pull latest changes:

```bash
git pull origin main
```

Add changes:

```bash
git add .
```

Commit:

```bash
git commit -m "Update project"
```

Push:

```bash
git push origin main
```

---

# 🚀 Production Checklist

Before deploying to production:

* [ ] Set a strong JWT `SECRET_KEY`
* [ ] Set JWT expiry appropriately
* [ ] Configure production PostgreSQL
* [ ] Configure Resend API key
* [ ] Configure verified email/domain
* [ ] Enable HTTPS
* [ ] Configure CORS correctly
* [ ] Remove development secrets
* [ ] Do not commit `.env`
* [ ] Test authentication
* [ ] Test quote submission
* [ ] Test email delivery
* [ ] Test database connection

---

# 👨‍💻 Project Purpose

Osprey Fasteners is a full-stack fastener/product management and quote-request platform.

The project demonstrates integration between:

```text
React
  +
FastAPI
  +
PostgreSQL
  +
SQLAlchemy
  +
JWT Authentication
  +
Resend Email Service
  +
Docker
```

---

# 📄 License

This project is intended for the Osprey Fasteners application.
