# Fachkunde Taxi & Mietwagen Lernplattform

Frontend learning platform for preparing the German Fachkunde exam for Taxi & Mietwagen.

## Current Status
This repository currently contains a frontend-only implementation.

Not implemented yet:
- Backend
- Authentication
- Supabase
- PDF parsing
- Payment processing
- Mobile wrapper (Capacitor)

## Development
Use **npm only**.

```bash
npm install
npm run dev
```

## Quality checks
```bash
npm run build
npm run lint
npm run test
```

## Docker local VPS-style test
```bash
docker compose up --build
```
Then open `http://localhost:8080`.
