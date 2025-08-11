# WebFingerprint

A Spring Boot backend service for device/browser fingerprinting and tracking. This project exposes REST APIs to collect, store, and analyze device fingerprints, enabling identification and visit tracking of unique devices.

---

## Features

- **Device Fingerprinting:** Collects browser/device properties (user agent, platform, screen resolution, timezone, plugins, etc.) via API.
- **Device Tracking:** Stores fingerprints and tracks visit counts, first seen time, and device statistics.
- **RESTful API:** Endpoints for submitting fingerprints and retrieving device stats.
- **CORS Support:** Configured for frontend integration (default: `http://localhost:3000`).
- **In-memory Database:** Uses H2 for quick prototyping and testing.

---

## Project Structure

```
webfingerprint/
├── src/
│   ├── main/
│   │   ├── java/com/outseer/webfingerprint/
│   │   │   ├── config/         # WebConfig for CORS
│   │   │   ├── controller/     # DeviceTrackingController (API endpoints)
│   │   │   ├── dto/            # DeviceFingerprintRequest, DeviceTrackingResponse
│   │   │   ├── model/          # Device entity
│   │   │   ├── repository/     # DeviceRepository (Spring Data JPA)
│   │   │   ├── service/        # DeviceTrackingService (business logic)
│   │   │   └── WebFingerPrintApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── static/
│   │       └── templates/
│   └── test/
│       └── java/com/outseer/webfingerprint/
│           └── WebfingerprintApplicationTests.java
├── pom.xml
└── HELP.md
```

---

## API Endpoints

### Track Device

`POST /api/device`

- **Request Body:** `DeviceFingerprintRequest` (JSON)
- **Response:** `DeviceTrackingResponse` (JSON)

### Get Device Stats

`GET /api/device/{id}`

- **Path Variable:** `id` (device fingerprint hash)
- **Response:** `DeviceTrackingResponse` (JSON)

---

## Getting Started

### Prerequisites

- Java 17+
- Maven

### Run the Application

```sh
./mvnw spring-boot:run
```

The service will start at `http://localhost:8080`.

---

## Configuration

- **CORS:** By default, only requests from `http://localhost:3000` are allowed (see `WebConfig.java`).
- **Database:** Uses H2 in-memory DB (no setup required).

---

## License

For demo and educational purposes.
```