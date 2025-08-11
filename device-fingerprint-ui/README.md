# Device Fingerprint UI

A React frontend for collecting browser/device fingerprint data and interacting with the WebFingerprint backend service. This app gathers device properties, generates a fingerprint, and displays device tracking information.

---

## Features

- **Device Data Collection:** Gathers user agent, platform, screen resolution, timezone, plugins, and more from the browser.
- **Fingerprint Generation:** Creates a unique hash for each device/browser.
- **API Integration:** Sends fingerprint data to the backend and displays visit statistics.
- **User Feedback:** Shows device info and visit count to the user.

---

## Project Structure

```
device-fingerprint-ui/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── App.js                # Main app component
│   ├── DeviceFingerPrint.js  # Device fingerprint logic & UI
│   ├── index.js              # Entry point
│   ├── App.css
│   ├── index.css
│   ├── logo.svg
│   ├── reportWebVitals.js
│   └── setupTests.js
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm

### Install Dependencies

```sh
npm install
```

### Run the Application

```sh
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Configuration

- **Backend API:** By default, expects the backend at `http://localhost:8080/api/device`.
- **CORS:** Ensure the backend allows requests from this frontend (see backend `WebConfig.java`).

---

## License

For demo and educational purposes only.
