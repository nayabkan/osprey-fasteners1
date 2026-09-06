<<<<<<< Updated upstream
# Osprey Fasteners

Full-stack web application for Osprey Fasteners built with React.js, FastAPI, PostgreSQL, SQLAlchemy, and Pydantic.

## Tech Stack

### Frontend
- React.js
- React Router
- Vite
- CSS

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn
- PostgreSQL
- psycopg2

---

## Main Features

- Home page with product categories
- Inventory/product listing
- Product search
- Category filtering
- Add to Quote
- Quote quantity update
- Remove quote items
- Request Quote form
- Contact Us form
- PostgreSQL database integration
- React ↔ FastAPI API communication

---

## Database Flow

### Add to Quote

```text
Inventory
    ↓
Add to Quote
    ↓
POST /quotes/
    ↓
quotes table
```

### Request Quote

```text
Request Quote → Submit
    ↓
POST /quotes/request
    ↓
quotes table
```

### Contact Us

```text
Contact Us → Submit
    ↓
POST /api/contact/
    ↓
contact_messages table
```

---

## Database Tables

### `products`
Stores inventory/product information.

### `quotes`
Stores:
- Quote products
- Quantity
- Company name
- Contact person
- Email
- Phone
- Address
- Message
- Request ID
- Created date

### `contact_messages`
Stores Contact Us submissions:
- Contact person/customer name
- Email
- Message
- Phone/company fields as nullable
- Items
- Status

---

# Backend Setup

Open a terminal in the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

If PowerShell blocks activation:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Then activate again:

```powershell
.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## PostgreSQL Configuration

Create a PostgreSQL database, for example:

```text
osprey_fasteners
```

Configure `backend/.env`:

```env
DATABASE_URL=postgresql+psycopg2://postgres:YOUR_PASSWORD@localhost:5432/osprey_fasteners
```

Replace `YOUR_PASSWORD` with the PostgreSQL password.

If OpenAI functionality is actually used by the project, configure:

```env
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
OPENAI_MODEL=gpt-5-mini
```

Do not upload `.env` to GitHub.

---

# Run Backend

From the `backend` directory:

```bash
uvicorn app.main:app --reload
```

If `uvicorn` is not recognized:

```bash
python -m uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger API documentation:

```text
http://127.0.0.1:8000/docs
```

Health check:

```text
http://127.0.0.1:8000/health
```

Expected health response:

```json
{
  "status": "healthy"
}
```

---

# Frontend Setup

Open a second terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the frontend:

```bash
npm run dev
```

The frontend normally runs at:

```text
http://localhost:5173
```

---

# Run Complete Project

Use two terminals.

### Terminal 1 — Backend

```bash
cd backend
.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

Open:

```text
http://localhost:5173
```

---

# API Endpoints

## Products

```text
GET /products/
```

## Add to Quote

```text
POST /quotes/
```

Example:

```json
{
  "product_id": 1,
  "part_number": "OS-NUT-999",
  "product_name": "Nut",
  "quantity": 5
}
```

## Get Quote Items

```text
GET /quotes/
```

## Update Quote Quantity

```text
PUT /quotes/{quote_id}?quantity=5
```

## Delete Quote Item

```text
DELETE /quotes/{quote_id}
```

## Submit Request Quote

```text
POST /quotes/request
```

Example:

```json
{
  "company_name": "Osprey Fasteners",
  "contact_person": "Nayab",
  "email": "test@example.com",
  "phone": "9876543210",
  "address": "California",
  "message": "I need these fasteners.",
  "items": [
    {
      "product_id": 1,
      "part_number": "OS-NUT-999",
      "product_name": "Nut",
      "quantity": 5
    }
  ]
}
```

## Contact Us

```text
POST /api/contact/
```

Example:

```json
{
  "customer_name": "Nayab",
  "email": "test@example.com",
  "phone": null,
  "company": null,
  "message": "I need fasteners.",
  "items": "[]"
}
```

---

# Frontend API Configuration

For local development the API is:

```text
http://127.0.0.1:8000
```

If using a Vite environment variable, frontend `.env` can contain:

```env
VITE_API_URL=http://127.0.0.1:8000
```

For production, replace it with the deployed backend URL.

---

# CORS

The backend currently supports local React development:

```text
http://localhost:5173
http://127.0.0.1:5173
```

For deployment, add the actual production frontend domain.

---

# Recommended `.gitignore`

```gitignore
# Python
.venv/
__pycache__/
*.pyc

# Environment
.env

# Node
node_modules/
dist/

# IDE
.vscode/
.idea/
```

Never commit PostgreSQL passwords or API keys.

---

# Troubleshooting

## `ModuleNotFoundError: No module named 'app'`

Make sure the terminal is inside `backend`:

```bash
cd backend
```

Then:

```bash
python -m uvicorn app.main:app --reload
```

## `uvicorn is not recognized`

Activate the virtual environment:

```powershell
.venv\Scripts\Activate.ps1
```

Then:

```bash
pip install -r requirements.txt
```

## PostgreSQL connection error

Check:

- PostgreSQL service is running
- Database exists
- Username is correct
- Password is correct
- Port is normally `5432`
- `DATABASE_URL` is correct

## Frontend cannot connect to backend

Check:

```text
http://127.0.0.1:8000/health
```

Then check the frontend API URL and backend CORS settings.

## 422 Validation Error

A `422` means the request body does not match the Pydantic schema expected by the endpoint.

Open:

```text
http://127.0.0.1:8000/docs
```

and verify the request body.

---

# Production Checklist

Before deployment:

- [ ] Use a production PostgreSQL database
- [ ] Update `DATABASE_URL`
- [ ] Update frontend API URL
- [ ] Update CORS with production frontend domain
- [ ] Keep `.env` private
- [ ] Do not expose API keys
- [ ] Build frontend:

```bash
npm run build
```

- [ ] Configure production FastAPI server
- [ ] Configure domain and HTTPS
- [ ] Test Inventory
- [ ] Test Search
- [ ] Test Add to Quote
- [ ] Test Request Quote
- [ ] Test Contact Us

---

# Final Functional Flow

```text
                    OSPREY FASTENERS
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
     Inventory           Quote            Contact Us
        │                  │                  │
   Add to Quote       Submit Quote       Submit Form
        │                  │                  │
        ↓                  ↓                  ↓
     /quotes/       /quotes/request     /api/contact/
        │                  │                  │
        ↓                  ↓                  ↓
     quotes             quotes        contact_messages
```

## Project Status

Current application functionality is complete for the implemented local workflow:

- Home page
- Inventory
- Product search
- Category filtering
- Add to Quote
- Quantity update
- Quote item removal
- Request Quote
- Contact Us
- PostgreSQL integration
- FastAPI REST API
- React/FastAPI communication

Production deployment only requires environment-specific configuration such as production database, API URL, CORS, domain, HTTPS, and hosting/server setup.
=======
# Osprey Fasteners

Full-stack web application for Osprey Fasteners built with React.js, FastAPI, PostgreSQL, SQLAlchemy, and Pydantic.

## Tech Stack

### Frontend
- React.js
- React Router
- Vite
- CSS

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn
- PostgreSQL
- psycopg2

---

## Main Features

- Home page with product categories
- Inventory/product listing
- Product search
- Category filtering
- Add to Quote
- Quote quantity update
- Remove quote items
- Request Quote form
- Contact Us form
- PostgreSQL database integration
- React ↔ FastAPI API communication

---

## Database Flow

### Add to Quote

```text
Inventory
    ↓
Add to Quote
    ↓
POST /quotes/
    ↓
quotes table
```

### Request Quote

```text
Request Quote → Submit
    ↓
POST /quotes/request
    ↓
quotes table
```

### Contact Us

```text
Contact Us → Submit
    ↓
POST /api/contact/
    ↓
contact_messages table
```

---

## Database Tables

### `products`
Stores inventory/product information.

### `quotes`
Stores:
- Quote products
- Quantity
- Company name
- Contact person
- Email
- Phone
- Address
- Message
- Request ID
- Created date

### `contact_messages`
Stores Contact Us submissions:
- Contact person/customer name
- Email
- Message
- Phone/company fields as nullable
- Items
- Status

---

# Backend Setup

Open a terminal in the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

If PowerShell blocks activation:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Then activate again:

```powershell
.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## PostgreSQL Configuration

Create a PostgreSQL database, for example:

```text
osprey_fasteners
```

Configure `backend/.env`:

```env
DATABASE_URL=postgresql+psycopg2://postgres:YOUR_PASSWORD@localhost:5432/osprey_fasteners
```

Replace `YOUR_PASSWORD` with the PostgreSQL password.

If OpenAI functionality is actually used by the project, configure:

```env
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
OPENAI_MODEL=gpt-5-mini
```

Do not upload `.env` to GitHub.

---

# Run Backend

From the `backend` directory:

```bash
uvicorn app.main:app --reload
```

If `uvicorn` is not recognized:

```bash
python -m uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger API documentation:

```text
http://127.0.0.1:8000/docs
```

Health check:

```text
http://127.0.0.1:8000/health
```

Expected health response:

```json
{
  "status": "healthy"
}
```

---

# Frontend Setup

Open a second terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the frontend:

```bash
npm run dev
```

The frontend normally runs at:

```text
http://localhost:5173
```

---

# Run Complete Project

Use two terminals.

### Terminal 1 — Backend

```bash
cd backend
.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

Open:

```text
http://localhost:5173
```

---

# API Endpoints

## Products

```text
GET /products/
```

## Add to Quote

```text
POST /quotes/
```

Example:

```json
{
  "product_id": 1,
  "part_number": "OS-NUT-999",
  "product_name": "Nut",
  "quantity": 5
}
```

## Get Quote Items

```text
GET /quotes/
```

## Update Quote Quantity

```text
PUT /quotes/{quote_id}?quantity=5
```

## Delete Quote Item

```text
DELETE /quotes/{quote_id}
```

## Submit Request Quote

```text
POST /quotes/request
```

Example:

```json
{
  "company_name": "Osprey Fasteners",
  "contact_person": "Nayab",
  "email": "test@example.com",
  "phone": "9876543210",
  "address": "California",
  "message": "I need these fasteners.",
  "items": [
    {
      "product_id": 1,
      "part_number": "OS-NUT-999",
      "product_name": "Nut",
      "quantity": 5
    }
  ]
}
```

## Contact Us

```text
POST /api/contact/
```

Example:

```json
{
  "customer_name": "Nayab",
  "email": "test@example.com",
  "phone": null,
  "company": null,
  "message": "I need fasteners.",
  "items": "[]"
}
```

---

# Frontend API Configuration

For local development the API is:

```text
http://127.0.0.1:8000
```

If using a Vite environment variable, frontend `.env` can contain:

```env
VITE_API_URL=http://127.0.0.1:8000
```

For production, replace it with the deployed backend URL.

---

# CORS

The backend currently supports local React development:

```text
http://localhost:5173
http://127.0.0.1:5173
```

For deployment, add the actual production frontend domain.

---

# Recommended `.gitignore`

```gitignore
# Python
.venv/
__pycache__/
*.pyc

# Environment
.env

# Node
node_modules/
dist/

# IDE
.vscode/
.idea/
```

Never commit PostgreSQL passwords or API keys.

---

# Troubleshooting

## `ModuleNotFoundError: No module named 'app'`

Make sure the terminal is inside `backend`:

```bash
cd backend
```

Then:

```bash
python -m uvicorn app.main:app --reload
```

## `uvicorn is not recognized`

Activate the virtual environment:

```powershell
.venv\Scripts\Activate.ps1
```

Then:

```bash
pip install -r requirements.txt
```

## PostgreSQL connection error

Check:

- PostgreSQL service is running
- Database exists
- Username is correct
- Password is correct
- Port is normally `5432`
- `DATABASE_URL` is correct

## Frontend cannot connect to backend

Check:

```text
http://127.0.0.1:8000/health
```

Then check the frontend API URL and backend CORS settings.

## 422 Validation Error

A `422` means the request body does not match the Pydantic schema expected by the endpoint.

Open:

```text
http://127.0.0.1:8000/docs
```

and verify the request body.

---

# Production Checklist

Before deployment:

- [ ] Use a production PostgreSQL database
- [ ] Update `DATABASE_URL`
- [ ] Update frontend API URL
- [ ] Update CORS with production frontend domain
- [ ] Keep `.env` private
- [ ] Do not expose API keys
- [ ] Build frontend:

```bash
npm run build
```

- [ ] Configure production FastAPI server
- [ ] Configure domain and HTTPS
- [ ] Test Inventory
- [ ] Test Search
- [ ] Test Add to Quote
- [ ] Test Request Quote
- [ ] Test Contact Us

---

# Final Functional Flow

```text
                    OSPREY FASTENERS
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
     Inventory           Quote            Contact Us
        │                  │                  │
   Add to Quote       Submit Quote       Submit Form
        │                  │                  │
        ↓                  ↓                  ↓
     /quotes/       /quotes/request     /api/contact/
        │                  │                  │
        ↓                  ↓                  ↓
     quotes             quotes        contact_messages
```

## Project Status

Current application functionality is complete for the implemented local workflow:

- Home page
- Inventory
- Product search
- Category filtering
- Add to Quote
- Quantity update
- Quote item removal
- Request Quote
- Contact Us
- PostgreSQL integration
- FastAPI REST API
- React/FastAPI communication

Production deployment only requires environment-specific configuration such as production database, API URL, CORS, domain, HTTPS, and hosting/server setup.
>>>>>>> Stashed changes
