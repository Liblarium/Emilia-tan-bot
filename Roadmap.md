# Emilia-tan-bot — Roadmap

~~may change. The roadmap is not very accurate, because I myself do not know how to put it together correctly (I did not put it together)~~

Welcome to the development roadmap for **Emilia-tan-bot**!  
This document outlines the planned structure, goals, and important milestones for the project.

---

## 🌟 Goals

- Build a modular, scalable, and maintainable architecture based on a monorepo approach.
- Follow clean code practices: **SOLID**, **DRY**, **KISS** principles.
- Use **pnpm** workspace for managing multiple packages.
- Focus on type-safety and strict validation using **TypeScript**.
- Integrate high-quality logging, database, and messaging solutions.
- Prepare for future scaling with minimal refactoring.

---

## 📦 Project Structure

```
apps/            # Main application(s) (bot, later maybe web services)
packages/        # Shared modules (core functionality, logger, utils)
infrastructure/  # Database schemas and related services
sandbox/         # Experimental prototypes and isolated tests
tools/           # Development CLI scripts and utilities
oldCode/         # Archived legacy code (read-only)
```


---

## 🛠️ Technologies Used

- **discord.js** — Discord bot API
- **Prisma** — ORM for PostgreSQL (and optionally others)
- **TypeScript** — Full strict mode
- **pnpm** — Package manager
- **SWC** — TypeScript transpiler for fast builds
- **Pino** — High-performance logger
- **RxJS** — (optional, TBD) Reactive utilities
- **Husky + Lint-Staged** — Git hooks for automatic checks
- **Typedoc** — Documentation generation

---

## 🗺️ Milestones

| Status | Milestone                           | Description                                |
| :----: | ----------------------------------- | ------------------------------------------ |
|   ✅    | Core structure setup                | Initialize monorepo structure and configs  |
|   🟡    | Logging service (Pino + decorators) | Create a shared logging module             |
|   ⬜    | Database integration                | Setup Prisma, migrations, and seeders      |
|   ⬜    | Bot Client Initialization           | Basic Discord client with command handling |
|   ⬜    | Command / Event architecture        | Abstract classes, decorators, loaders      |
|   ⬜    | Utilities and common modules        | Helper functions, validators, DTOs         |
|   ⬜    | Linting, formatting, Git hooks      | ESLint, Prettier, Biome, Husky setup       |
|   ⬜    | Documentation                       | Generate basic TypeDoc documentation       |
|   ⬜    | First full MVP                      | First working version of the bot           |

---

## 📋 Notes

- New technologies or refactoring ideas may be added based on development needs.
- All scripts and automation will target developer friendliness and scalability.
- Contributions to the roadmap (ideas, improvements) are welcome!

---

## 🚀 Updated repository structure for stage 2

```
Emilia-tan-bot/            # Main root
├── apps/                  # Main applications (bot and others)
│   └── emilia-bot/        # Main bot
├── packages/              # Shared packages
│   ├── core/              # Core logic, DI container
│   ├── decorators/        # Decorators for commands, injections, etc.
│   ├── types/             # Shared types
│   ├── logger/            # Logging (Pino + decorators)
│   ├── utils/             # Utilities (formatters, validators)
│   └── network/           # Network utilities, e.g. for API
├── infrastructure/        # Database schemas, migrations, and services
│   └── prisma/            #  Prisma settings, migrations, seed
├── sandbox/               # Experimental prototypes and isolated tests
├── tools/                 # Development scripts and utilities (CLI)
├── oldCode/               # Archived old code
├── docs/                  # Documentation
└── .github/               # GitHub configurations (CI/CD, templates, etc.)
```

---

## 🚀 Updated goals for stage 2

1. **Modules:**
   - Complete the main `BotCore` class.
   - Implement command and event handling using classes and decorators.
   - Create interfaces for logging, configs, utilities.

   
2. **CI/CD:**
   - Add tests for command handler and main utilities.
   - Set up integration with CI (GitHub Actions for automated testing, linting, build).

3. **Logic implementation:**
   - Logging using Pino, wrappers, and decorators.
   - Implement database connection (Prisma).
   - Set up interfaces for command and event handling.

---
Let's create something amazing together! 🚀

---

Let's build something amazing together! 🚀
