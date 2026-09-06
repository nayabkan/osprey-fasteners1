Osprey Fasteners

A full-stack web application for Osprey Fasteners built with React.js, FastAPI, PostgreSQL, SQLAlchemy, and Pydantic.

The application provides product/inventory browsing, product search and filtering, quote management, Request Quote submission, and Contact Us functionality. The frontend communicates with a REST API powered by FastAPI, while PostgreSQL stores products, quote records, and contact submissions.

Features

Responsive Osprey Fasteners website

Product and inventory listing

Product search

Category filtering

Add products to Quote

Update quote item quantities

Remove quote items

Request Quote form

Contact Us form

PostgreSQL database integration

React + FastAPI REST API communication

Swagger/OpenAPI API documentation

Docker support for the application/database environment

Environment-based configuration

Technology Stack

Frontend

React.js

React Router

Vite

JavaScript / JSX

CSS

Backend

Python

FastAPI

SQLAlchemy

Pydantic

Uvicorn

psycopg2

Database

PostgreSQL

DevOps

Docker

Docker Compose

Project Structure

osprey-fasteners1/
│
├── backend/
│   ├── app/
│   │   ├── ...
│   │   └── main.py
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   │   └── images/
│   ├── src/
│   │   ├── ...
│   │   └── ...
│   ├── Dockerfile
│   ├── index.html
│   ├── package.json
│   └── package-lock.json
│
├── docker-compose.yml
├── .gitignore
└── README.md

Application Flow

Product / Inventory Flow

Frontend
   ↓
Product / Inventory Page
   ↓
FastAPI REST API
   ↓
PostgreSQL
   ↓
Products returned to React

Add to Quote Flow

Inventory
   ↓
Add to Quote
   ↓
POST /quotes/
   ↓
quotes table

Request Quote Flow

Quote Items
   ↓
Request Quote Form
   ↓
POST /quotes/request
   ↓
quotes table

Contact Us Flow

Contact Us Form
   ↓
POST /api/contact/
   ↓
contact_messages table

Database

The application uses PostgreSQL.

Main Tables

products

Stores product and inventory information.

Typical product information includes:

Product ID

Part number

Product name

Category

Inventory/product details

quotes

Stores quote/cart items and submitted quote information.

The implemented workflow includes information such as:

Product

Quantity

Company name

Contact person

Email

Phone

Address

Message

Request ID

Created date

contact_messages

Stores Contact Us submissions, including:

Customer/contact name

Email

Phone

Company

Message

Items

Status

API Endpoints

Products

GET /products/

Returns available products/inventory.

Add to Quote

POST /quotes/

Example request:

{
  "product_id": 1,
  "part_number": "OS-NUT-999",
  "product_name": "Nut",
  "quantity": 5
}

Get Quote Items

GET /quotes/

Update Quote Quantity

PUT /quotes/{quote_id}?quantity=5

Delete Quote Item

DELETE /quotes/{quote_id}

Submit Request Quote

POST /quotes/request

Example:

{
  "company_name": "Osprey Fasteners",
  "contact_person": "Customer Name",
  "email": "customer@example.com",
  "phone": "9876543210",
  "address": "Customer Address",
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

Contact Us

POST /api/contact/

Example:

{
  "customer_name": "Customer Name",
  "email": "customer@example.com",
  "phone": null,
  "company": null,
  "message": "I need fasteners.",
  "items": "[]"
}

Local Development Setup

Prerequisites

Install:

Python 3.x

Node.js and npm

PostgreSQL, or Docker Desktop with Docker Compose

Git

Backend Setup

Open a terminal in the project root:

cd backend

Create a virtual environment:

python -m venv .venv

Windows PowerShell

.venv\Scripts\Activate.ps1

If PowerShell blocks activation:

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

Then activate again:

.venv\Scripts\Activate.ps1

Install backend dependencies:

pip install -r requirements.txt

Environment Variables

Create:

backend/.env

Example:

DATABASE_URL=postgresql+psycopg2://postgres:YOUR_PASSWORD@localhost:5432/osprey_fasteners

If your application environment uses additional services, configure their required variables in .env.

Never commit passwords, API keys, or other secrets to GitHub.

Run Backend

From the backend directory:

uvicorn app.main:app --reload

If uvicorn is not recognized:

python -m uvicorn app.main:app --reload

Backend URL:

http://127.0.0.1:8000

Swagger API documentation:

http://127.0.0.1:8000/docs

Health check:

http://127.0.0.1:8000/health

Expected response:

{
  "status": "healthy"
}

Frontend Setup

Open a second terminal:

cd frontend

Install dependencies:

npm install

Run the development server:

npm run dev

Frontend normally runs at:

http://localhost:5173

Frontend API Configuration

For local development, the backend API is:

http://127.0.0.1:8000

If using Vite environment variables, create:

frontend/.env

and configure:

VITE_API_URL=http://127.0.0.1:8000

For production, replace this value with the deployed backend URL.

Running the Complete Project

Terminal 1 — Backend

cd backend
.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload

Terminal 2 — Frontend

cd frontend
npm run dev

Then open:

http://localhost:5173

Docker

The repository includes Docker configuration for containerized deployment/development.

Build and start the services:

docker compose up --build

Run in detached mode:

docker compose up -d --build

Stop the services:

docker compose down

Check running containers:

docker compose ps

If PostgreSQL is provided by the Docker Compose setup, make sure the backend DATABASE_URL matches the PostgreSQL service name, credentials, database name, and port defined in docker-compose.yml.

CORS

For local React development, the backend supports:

http://localhost:5173
http://127.0.0.1:5173

For production deployment, update the backend CORS configuration with the actual frontend domain.

Troubleshooting

ModuleNotFoundError: No module named 'app'

Make sure the terminal is inside the backend directory:

cd backend

Then run:

python -m uvicorn app.main:app --reload

uvicorn is not recognized

Activate the virtual environment:

.venv\Scripts\Activate.ps1

Then install dependencies:

pip install -r requirements.txt

PostgreSQL connection error

Check:

PostgreSQL/Docker PostgreSQL is running

Database exists

Username is correct

Password is correct

Port is correct

DATABASE_URL is correct

Docker service name is correct when using Docker Compose

Frontend cannot connect to backend

First check:

http://127.0.0.1:8000/health

Then verify:

VITE_API_URL

Backend CORS configuration

Backend server is running

422 Unprocessable Entity

A 422 response normally means the request body does not match the Pydantic schema expected by the API.

Open:

http://127.0.0.1:8000/docs

and verify the endpoint's request body.

Production Checklist

Before production deployment:

Use a production PostgreSQL database

Configure production DATABASE_URL

Configure the production frontend API URL

Update CORS with the production frontend domain

Keep .env files private

Never expose database passwords or API keys

Build the frontend:

npm run build

Configure a production FastAPI server

Configure HTTPS

Configure the production domain

Test product/inventory pages

Test product search

Test category filtering

Test Add to Quote

Test quantity updates

Test quote item removal

Test Request Quote

Test Contact Us

Test frontend/backend communication

Security Notes

Do not commit:

.env

or any file containing:

PostgreSQL passwords

API keys

JWT secrets

Email service credentials

Other private credentials

Recommended .gitignore entries:

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

Project Status

The repository currently contains the implemented local workflow for:

Home page

Inventory/product listing

Product search

Category filtering

Add to Quote

Quote quantity update

Quote item removal

Request Quote

Contact Us

PostgreSQL integration

FastAPI REST API

React/FastAPI communication

Docker configuration

Production deployment mainly requires environment-specific configuration such as the production database, API URL, CORS, domain, HTTPS, and hosting/server setup.

License

This project is intended for the Osprey Fasteners application. Add the appropriate license here if the project is being distributed publicly.
