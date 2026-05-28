# Operational Clarity Platform

## Overview

Operational Clarity Platform is a SaaS product designed for service-based businesses.

The goal is NOT to build another booking application.

The goal is to help businesses identify operational inefficiencies, improve customer management, reduce operational chaos, and create consulting opportunities.

The software serves two purposes:

1. Free operational toolkit for businesses.
2. Lead generation and consulting platform for Hamster.

---

# Target Businesses

- Hair Salons
- Barbershops
- Massage Centers
- Spas
- Beauty Clinics
- Medical Clinics
- Dentists
- Tutors
- Fitness Coaches
- Photography Studios
- Tailors
- Fashion Designers
- Auto Workshops
- Cleaning Services
- Home Service Businesses

---

# Core Business Philosophy

We are not selling software.

We are helping businesses move from operational chaos to operational clarity.

The software acts as a conversation starter that helps identify deeper operational problems and consulting opportunities.

---

# Technology Stack

Frontend:
- React
- TypeScript
- Vite
- TailwindCSS
- React Router

Backend Platform:
- Supabase

Database:
- Supabase PostgreSQL

Authentication:
- Supabase Auth

Storage:
- Supabase Storage

Security:
- Row Level Security (RLS)

---

# Important Constraints

DO NOT:

- Use Prisma
- Use MongoDB
- Introduce Microservices
- Introduce Kubernetes
- Introduce Docker

This project is built by a solo technical founder.

Optimize for:

- Simplicity
- Fast development
- Maintainability
- Validation speed

Not enterprise complexity.

---

# Current MVP Scope

## Sprint 1

Authentication

Business Onboarding

Dashboard Shell

---

## Sprint 2

Service Management

- Create Service
- Edit Service
- Disable Service

---

## Sprint 3

Customer Management

- Create Customer
- Edit Customer
- Customer Notes
- Customer History

---

## Sprint 4

Appointment System

- Create Appointment
- Edit Appointment
- Cancel Appointment
- Status Tracking

---

# Future Features

These are NOT MVP priorities:

- Advanced Analytics
- Operational Health Score
- AI Recommendations
- Consultant Dashboard
- Revenue Forecasting
- Automated WhatsApp Messaging

Only build after real business validation.

---

# Current Progress

Completed:

- Vite setup
- React setup
- TypeScript setup
- Tailwind setup
- React Router setup
- Supabase project created
- Environment variables configured
- Supabase client configured
- Folder structure created

Current Status:

Phase 1 Complete

Ready to begin Authentication Module.

---

# Current Folder Structure

src/

- assets/
- components/
  - auth/
  - layout/
  - onboarding/
  - ui/
- contexts/
- hooks/
- lib/
  - supabase.ts
  - database.types.ts
- pages/
- routes/
- services/
- types/
- utils/

---

# Authentication Requirements

Authentication Module must support:

- Sign Up
- Sign In
- Sign Out
- Password Reset
- Protected Routes
- Session Persistence

Authentication must use:

- Supabase Auth

Do not build custom authentication.

---

# Business Onboarding Requirements

Step 1:
Business Information

- Business Name
- Industry

Step 2:
Operating Hours

Stored in JSON format.

Step 3:
Initial Service Setup

Create first service(s).

After completion:

- onboarding_completed = true

User is redirected to dashboard.

---

# Success Criteria

MVP success is NOT measured by features.

Success is:

A business owner can:

1. Sign Up
2. Create Business
3. Complete Onboarding
4. Create Services
5. Create Customers
6. Create Appointments

At that point the product can be tested with real businesses.

Validation comes before expansion.