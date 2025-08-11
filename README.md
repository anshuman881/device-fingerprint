# Device Fingerprint Tracking

A full-stack project for device/browser fingerprinting and tracking, consisting of a React frontend and a Spring Boot backend.

---

## Overview

- **Frontend (`device-fingerprint-ui`)**: Collects browser/device properties, generates a fingerprint, and displays visit info.
- **Backend (`webfingerprint`)**: Stores fingerprints, tracks visits, and exposes REST APIs for device tracking.

---

## Features

- Collects device/browser info (user agent, platform, screen, timezone, plugins, etc.)
- Generates a unique fingerprint hash per device
- Tracks device visits and statistics
- RESTful API for submitting fingerprints and retrieving stats
- CORS enabled for local development

---

## Quick Start

### Backend

1. **Requirements:** Java 17+, Maven
2. **Run:**
   ```sh
   cd webfingerprint
   ./mvnw spring-boot:run
   ```
   API available at `http://localhost:8080/api/device`

### Frontend

1. **Requirements:** Node.js, npm
2. **Run:**
   ```sh
   cd device-fingerprint-ui
   npm install
   npm start
   ```
   App available at `http://localhost:3000`

---

## API Endpoints

- `POST /api/device` — Submit fingerprint data
- `GET /api/device/{id}` — Get device stats by fingerprint hash

---

## License

For
