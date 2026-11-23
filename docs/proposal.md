# Proposal: Console Parking System

**Problem:** Manual parking records often lead to lost data and wrong fee calculations. This TypeScript console app helps a parking attendant record vehicles, calculate fees, and find data quickly.

**Users:** parking attendant

**Input:** plate number, vehicle type, entry hour, duration

**Output:** vehicle list, vehicle details, parking fee, search results

**Entity Vehicle:** id (string), plateNumber (string), type (string), entryHour (number), duration (number), fee (number), hasLeft (boolean)

**Features:** Create, Read (all + by ID), Update, Delete (Y/N confirmation), Search (plate keyword + vehicle type filter)

**Decomposition:** 1) Main menu loop, 2) Input validation, 3) Create, 4) Read, 5) Update, 6) Delete, 7) Search, 8) Fee calculation
