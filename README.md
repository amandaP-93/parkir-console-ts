# Console Parking System (TypeScript)

A TypeScript console application for managing parking vehicle data (create, read, update, delete, and search). Built as the Final Project (UAS) of Pemrograman Dasar, Teknologi Informasi, Fakultas Vokasi, Universitas Brawijaya.

## Team Members

| Name | NIM | GitHub Account |
|---|---|---|
| Amanda Patricia | 263140700111013 | @amandaP-93 |
| M. Fadhol Latiful Mutaqin | 263140700111024 | @Latif6261 |

## Task Division & Contributions

| Member | Features / Code Sections | Main Pull Request |
|---|---|---|
| Amanda Patricia | Project setup, data structure (entity & seed data), typed functions, UTS fundamentals (operators, conditionals, variables, comments), Main Menu loop, Create + input validation, fee calculation function | <link PR Amanda> |
| M. Fadhol Latiful Mutaqin | Proposal, Computational Thinking (Chapter I), Flowchart (Chapter II), report documentation in `docs/`, PR review; Read, Update, Delete, Search (upcoming progress) | <link PR Fadhol> |

## Features

| Feature | Status |
|---|---|
| Main menu (loop until exit, invalid input handled) | Done (Progress 2) |
| Create + input validation | In progress (Progress 3) |
| Read (all data + detail by ID) | Planned (Progress 4) |
| Update | Planned (Progress 5) |
| Delete (Y/N confirmation) | Planned (Progress 5) |
| Search (keyword + filter) | Planned (Progress 6) |

## Progress Log

| Progress | Date | Summary |
|---|---|---|
| 1 | 23 Nov 2026 | Public repository, project setup, proposal, initial analysis |
| 2 | 27 Nov 2026 | Flowchart, data structure & typed functions, UTS fundamentals, main menu |

## Project Structure

parking-system/
├── src/
│   └── index.ts      # all code: types, seed data, CRUD + search functions, main menu
├── docs/             # report draft (.docx), flowchart, proposal
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md

## Git Workflow

- `main`: always runnable, updated at every progress deadline
- `develop`: integration branch
- `feature/<feature-name>`: one branch per feature, merged to `develop` via reviewed Pull Request

## How to Run

npm install
npx ts-node src/index.ts

## Screenshots

(Will be added as features are completed)
