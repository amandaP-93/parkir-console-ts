# Console Parking System (TypeScript)

A TypeScript console application for managing parking vehicle data (create, read, update, delete, and search), including fee calculation, payment, and transaction history. Built as the Final Project (UAS) of Pemrograman Dasar, Teknologi Informasi, Fakultas Vokasi, Universitas Brawijaya.

## Documentation

- Report draft (Google Docs): https://docs.google.com/document/d/1wSHKGDEJYnNXg5Ikf69y9Pd8RuAz1SeRxB2qtiZxmwk/edit?tab=t.0
- Proposal and report drafts (.docx) are also stored in the `docs/` folder.

## Team Members

| Name | NIM | GitHub Account |
|---|---|---|
| Amanda Patricia | 263140700111013 | @amandaP-93 |
| M. Fadhol Latiful Mutaqin | 263140700111024 | @Latif6261 |

## Task Division

| Member | Features / Code Sections | Main Pull Request |
|---|---|---|
| Amanda Patricia | Project setup (`package.json`, `tsconfig.json`, `.gitignore`); BAGIAN 1-3 (imports, constants, data types, seed data, input & validation functions); BAGIAN 5 (duration, fee calculation, payment); BAGIAN 6: Create (vehicle entry) and Vehicle Exit & Payment; BAGIAN 7 (main menu loop) | |
| M. Fadhol Latiful Mutaqin | Proposal; BAGIAN 4 (display & search helper functions); BAGIAN 6: Read (all data + detail by ID), Update, Delete (Y/N confirmation), Search (keyword + filters), Transaction History; Computational Thinking (Chapter I), Flowchart (Chapter II), report in `docs/` | |

## Features

| Feature | Status |
|---|---|
| Main menu (loop until exit, invalid input handled) | Done |
| Create + input validation (empty, invalid number, duplicate plate) | Done |
| Read (all data + detail by ID, empty-data message) | Done |
| Update (old value shown, Enter to skip) | Done |
| Delete
