# Device Fingerprint - Full Stack Application

## Overview
A complete full-stack application that tracks devices using browser fingerprinting techniques. Built with React frontend and Spring Boot backend.

## Architecture

### Frontend (React)
- **DeviceFingerprint.js**: Comprehensive fingerprinting utility collecting:
  - Browser info (user agent, language, platform, timezone)
  - Screen properties (resolution, color depth, viewport)
  - Browser capabilities (local storage, cookies, touch support)
  - Advanced fingerprinting (canvas, WebGL, fonts, plugins)
  - Hardware info (memory, CPU cores)
- **App.js**: Main UI component with device tracking and display
- **Responsive design** with loading states and error handling
- **Works in incognito mode** (no cookies required)

### Backend (Spring Boot)
- **RESTful API** with device tracking endpoints
- **JPA/Hibernate** with H2 in-memory database
- **Intelligent fingerprint matching**:
  - Exact hash matching for returning devices
  - Fuzzy matching for devices with minor changes
  - Device age calculation in minutes
- **Production-ready** with proper error handling and logging

## Key Features

✅ **Device Fingerprinting**: 15+ browser/device properties  
✅ **Persistent Tracking**: Survives browser restarts and incognito mode  
✅ **Age Calculation**: Accurate device age in minutes since first visit  
✅ **Fuzzy Matching**: Handles minor fingerprint changes (browser updates)  
✅ **Clean Architecture**: Layered design with DTOs, services, repositories
✅ **CORS Configuration**: Frontend-backend communication  
✅ **Error Handling**: Graceful fallbacks and user feedback  

## API Endpoints

### POST /api/device
Tracks a device based on fingerprint data

### GET /api/device/{id}
Device statistics

## Running the Application

### Backend (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
```
Backend runs on http://localhost:8080

### Frontend (React)
```bash
cd frontend
npm install
npm start
```
Frontend runs on http://localhost:3000

## Database
- **H2 in-memory** database for demo (easily switchable to PostgreSQL/MySQL)
- **H2 Console**: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:devicetracker`
  - Username: `sa`
  - Password: (empty)

## Testing

### Backend Tests
```bash
cd backend
./mvnw test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Production Considerations

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Works in private/incognito mode
- Progressive enhancement for older browsers
