# 📜 Project Roadmap

---

## 1. Initial Setup

- [x] Setup Node.js environment (.nvmrc for 22.x.x LTS)
- [x] Configure basic monorepo structure (apps/, packages/, etc.)
- [x] Setup package manager (pnpm)
- [x] Configure SWC for fast TypeScript builds
- [x] Setup Prettier, ESLint, and Biome for formatting and linting
- [x] Initialize Husky for Git hooks
- [x] Add dotenv-expand for extended environment variable support
- [x] Setup TypeDoc for documentation generation

---

## 2. Core Infrastructure

- [ ] Setup Prisma ORM with PostgreSQL
- [ ] Setup Docker (optional for database containers)
- [ ] Setup initial database schema
- [ ] Setup Pino for logging
- [ ] Create custom logger wrapper with decorators
- [ ] Add fast-glob for dynamic file loading

---

## 3. Application Structure

- [ ] Setup basic Discord bot with discord.js
- [ ] Create command/event handlers
- [ ] Create base classes for Commands and Events
- [ ] Setup Dependency Injection (using tsyringe)

---

## 4. Shared Utilities

- [ ] Create @core/logger package
- [ ] Create @core/handler package (command/event handling)
- [ ] Create @core/common package (shared types, constants, helpers)

---

## 5. Development & Testing

- [ ] Setup basic tests (unit tests)
- [ ] Setup sandbox environment (apps/sandbox/)
- [ ] Create CLI scripts in tools/cli-scripts

---

## 6. Experimental Features (Optional)

- [ ] RxJS integration for event streams
- [ ] Advanced decorators for automatic binding/loading
- [ ] Web dashboard (later)
- [ ] MongoDB/Mongoose (only for non-critical testing)

---

## 📦 Project Structure

''' 
apps/            # Main application(s) (bot, later maybe web services)
packages/        # Shared modules (core functionality, logger, utils)
infrastructure/  # Database schemas and related services
sandbox/         # Experimental prototypes and isolated tests
tools/           # Development CLI scripts and utilities
oldCode/         # Archived legacy code (read-only)
'''

---

## 📅 Milestones

- **M1:** Base monorepo setup (tools, configs, package manager)
- **M2:** Infrastructure (DB, logging, core utilities)
- **M3:** Bot functional base (commands, events, handlers)
- **M4:** Utility packages and internal sandbox
- **M5:** Optional features (RxJS, web dashboard, etc.)

---
