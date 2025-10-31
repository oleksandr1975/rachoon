<div align="center">
<img src="https://raw.githubusercontent.com/ad-on-is/rachoon/main/apps/frontend/assets/logo.png" height="100" />
</div>

# Rachoon — The Clever Way to Handle Invoices

**Rachoon** (from _račun_, meaning _invoice_ in Bosnian) is a modern, self-hosted invoicing platform designed for freelancers, small
businesses, and everyone who wants full control over their billing. It helps you create and track invoices effortlessly — with the charm of its mascot, the ever-curious raccoon.

---

![Dashboard](https://raw.githubusercontent.com/ad-on-is/rachoon/main/.github/screenshots/dashboard.png)

---

## Features

✅ **Invoices & Offers** — Create and manage invoices and quotations in seconds.  
✅ **Client Management** — Keep all your client info organized and searchable.  
✅ **Payment Tracking** — Log payment status, view balances, and track overdue invoices.  
✅ **Custom Branding** — Highly customizable templates using nunjucks.  
✅ **Multi-Currency & Tax Support** — Bill globally with flexible tax and currency settings.  
✅ **PDF Export** — Instantly download professional-looking PDFs.  
✅ **Dashboard Insights** — Get a snapshot of your revenue, pending payments, and client stats.

---

## Screenshots

- [Invoice Management](https://raw.githubusercontent.com/ad-on-is/rachoon/main/.github/screenshots/invoices.png)
- [Invoice Creation](https://raw.githubusercontent.com/ad-on-is/rachoon/main/.github/screenshots/create-invoice.png)
- [Client Management](https://raw.githubusercontent.com/ad-on-is/rachoon/main/.github/screenshots/clients.png)
- [Settings](https://raw.githubusercontent.com/ad-on-is/rachoon/main/.github/screenshots/settings2.png)
- [Template Creation](https://raw.githubusercontent.com/ad-on-is/rachoon/main/.github/screenshots/template.png)

---

## 🦝 Why "Rachoon"?

The name comes from “račun”, which means invoice in Bosnian — combined with the word raccoon, because invoicing should be smart and quick.

---

## Tech Stack

- **Frontend:** Nuxt.js
- **Backend:** adonisJS
- **Database:** PostgreSQL
- **PDF Engine:** Gotenberg
- **Deployment:** Docker-ready, runs anywhere.

---

## Installation

```yaml
services:
  rachoon:
    image: ghcr.io/ad-on-is/rachoon
    container_name: rachoon
    ports:
      - 8080:8080
    environment:
      - HOST=0.0.0.0
      - APP_KEY=<some-app-key>
      - DRIVE_DISK=local
      - DB_CONNECTION=pg
      - GOTENBERG_URL=http://gotenberg:3000
      - PG_HOST=<pg-host>
      - PG_PORT=5432
      - PG_USER=<pg-user>
      - PG_PASSWORD=<pg-password>
      - PG_DB_NAME=<pg-database>
      - BASE_URL=http://localhost:8080

  gotenberg:
    image: gotenberg/gotenberg:8
    restart: always
```

## First steps

- Visit: <http://localhost:8080/signup>
- Create your account
- Start invoicing
