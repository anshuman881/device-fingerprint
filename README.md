# Device Tracker - Full Stack Application

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
✅ **Comprehensive Testing**: Unit and integration tests  
✅ **CORS Configuration**: Frontend-backend communication  
✅ **Error Handling**: Graceful fallbacks and user feedback  

## API Endpoints

### POST /api/device/track
Tracks a device based on fingerprint data
```json
Request: {
  "userAgent": "Mozilla/5.0...",
  "screen": {"width": 1920, "height": 1080},
  "timezone": "America/New_York",
  "hash": "abc123"
}

Response: {
  "deviceId": "dev_1234567890_abcd1234",
  "ageMinutes": 45,
  "isNewDevice": false,
  "visitCount": 3,
  "message": "Welcome back! Visit #3"
}
```

### GET /api/device/health
Health check endpoint

### GET /api/device/stats
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

### Security
- HTTPS recommended for production
- Consider rate limiting on tracking endpoint
- Add authentication for admin endpoints

### Database
- Switch to persistent database (PostgreSQL/MySQL)
- Add database indexes for performance
- Consider data retention policies

### Monitoring
- Add application metrics
- Implement health checks
- Log fingerprint mismatches for analysis

### Scalability
- Consider Redis for session storage
- Add database connection pooling
- Implement caching for frequent lookups

## Technical Decisions

1. **H2 Database**: Quick setup for demo, easily replaceable
2. **Exact + Fuzzy Matching**: Handles browser updates gracefully
3. **Comprehensive Fingerprinting**: High device uniqueness
4. **React Frontend**: Modern, responsive UI
5. **Spring Boot**: Robust backend with excellent testing support

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Works in private/incognito mode
- Progressive enhancement for older browsers
