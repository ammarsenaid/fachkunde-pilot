# Project Architecture

## Overview
Fachkunde Pilot is a frontend-only learning platform for Taxi & Mietwagen Fachkunde exam preparation.

## Tech Stack
- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui style components
- React Router for page routing

## Structure
- `src/App.tsx`: route configuration
- `src/components/AppLayout.tsx`: top navigation, mobile dropdown, bottom mobile nav
- `src/pages/*`: page-level views
- `src/data/*`: split mock data sources
- `src/types/learning.ts`: centralized domain model types

## Current Boundaries
No backend, auth, payments, Supabase integration, PDF parsing, or mobile wrapper are implemented.
