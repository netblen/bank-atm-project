# Bank ATM Project

A full-stack ATM banking app with a React frontend and an ASP.NET Core backend. The app includes customer banking pages, admin tools, transaction activity, appointments, surveys, feedback, and financial goals.

## Tech Stack

- Frontend: React, React Router, Axios, Chart.js, Leaflet
- Backend: ASP.NET Core 8 Web API
- Database: SQL Server with Entity Framework Core
- Dev command: `npm run dev` starts the frontend and backend together

## Features

- Sign in, sign up, and forgot password flow
- Customer dashboard with ATM simulator, checking, savings, payments, and financial goals
- Recent activity page with unread highlights and a mark-all-read action
- Schedule appointments and rate customer experience
- Locator and transaction glossary pages
- Admin dashboard with users, activity logs, feedback reports, and performance charts
- Responsive frontend styling across the main pages

## Requirements

Install these before running the project:

- Node.js
- npm
- .NET 8 SDK
- SQL Server or SQL Server Express

## Setup

Clone the repository and install frontend dependencies:

```bash
git clone https://github.com/netblen/bank-atm-project.git
cd bank-atm-project
npm install
```

Create a local backend settings file:

```bash
copy atm-backend\appsettings.json atm-backend\appsettings.Local.json
```

Update `atm-backend/appsettings.Local.json` with your local SQL Server connection string. This file is ignored by Git so database passwords do not get pushed.

Example:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=atm_db;User Id=YOUR_USER;Password=YOUR_PASSWORD;Encrypt=False;TrustServerCertificate=True;"
  }
}
```

The backend creates the database automatically in development with `EnsureCreated()` when SQL Server is reachable.

## Run The App

From the project root, run:

```bash
npm run dev
```

This starts:

- Backend: `https://localhost:7243`
- Frontend: `http://localhost:3000`

Open the frontend in your browser:

```text
http://localhost:3000
```

Stop both servers with `Ctrl + C` in the terminal.

## Useful Commands

Run only the React frontend:

```bash
npm start
```

Run only the backend:

```bash
cd atm-backend
dotnet run --launch-profile https
```

Build the frontend:

```bash
npm run build
```

Build the backend:

```bash
dotnet build atm-backend\atm-backend.csproj
```

## Troubleshooting

If sign in or sign up fails, make sure the backend is running and SQL Server is available.

If the browser blocks the backend HTTPS certificate, trust the local .NET development certificate:

```bash
dotnet dev-certs https --trust
```

If you see Browserslist warnings, the app can still run. To refresh the browser compatibility database, run:

```bash
npx update-browserslist-db@latest
```

## Notes

- Do not commit `atm-backend/appsettings.Local.json`.
- Do not commit `node_modules`, `build`, `bin`, or `obj` folders.
- Do not commit personal editor folders like `.vscode/`.
- The main development command for this project is `npm run dev`.
