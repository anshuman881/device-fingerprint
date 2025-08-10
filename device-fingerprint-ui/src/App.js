import React, { useEffect, useState } from 'react';
import DeviceFingerprint from './DeviceFingerPrint';
import './App.css';

const API_BASE_URL = 'http://localhost:8080/api';

function App() {
  const [deviceData, setDeviceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fingerprint, setFingerprint] = useState(null);

  useEffect(() => {
    const initializeDevice = async () => {
      try {
        setLoading(true);
        setError(null);
        // Collect device fingerprint
        const fp = DeviceFingerprint.collect();
        setFingerprint(fp);
        const hash = DeviceFingerprint.getHashCode();
        // Send fingerprint to backend using the stable device ID
        const payload = {
          hash: hash,
          userAgent: fp.userAgent,
          platform: fp.platform,
          screenResolution: fp.screenResolution,
          timezone: fp.timezone,
          language: fp.language,
          cookiesEnabled: fp.cookiesEnabled,
          touchSupport: fp.touchSupport,
          hardwareConcurrency: fp.hardwareConcurrency,
          timezone: fp.timezone,
          webGL: fp.webGL,
          plugins: fp.plugins,
          touchSupport: fp.touchSupport,
          deviceMemory: fp.deviceMemory,
          hardwareConcurrency: fp.hardwareConcurrency
        };

        await fetch(`${API_BASE_URL}/device/${hash}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        })
          .then(async res => {
            if (res.ok) {
              const data = await res.json();
              setDeviceData(data);
            } else {
              const postRes = await fetch(`${API_BASE_URL}/device`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json"
                },
                body: JSON.stringify(payload)
              });
              const postData = await postRes.json();
              setDeviceData(postData);
            }
          })
          .catch(err => {
            console.error("Network error:", err);
          });
      } catch (err) {
        console.error('Error tracking device:', err);
        setError(err.message);
        setDeviceData({
          deviceId: 123,
          ageMinutes: 0,
          isNewDevice: true,
          message: 'Backend not available - using demo mode'
        });
      } finally {
        setLoading(false);
      }
    };
    initializeDevice();
  }, []);

  const formatDeviceAge = (minutes) => {
    if (minutes === 0) return '0 minutes (new device)';
    if (minutes < 60) return `${minutes} minutes`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)} hours ${minutes % 60} minutes`;
    return `${Math.floor(minutes / 1440)} days ${Math.floor((minutes % 1440) / 60)} hours`;
  };

  if (loading) {
    return (
      <div className="App">
        <div className="container">
          <h1>Device Tracker</h1>
          <div className="loading">
            <p>Analyzing device fingerprint...</p>
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="container">
        <h1>Device Tracker</h1>
        <div className="device-info">
          <div className="info-grid">
            <div className="info-item">
              <label>Device ID:</label>
              <span className="device-id">{deviceData?.deviceId || 'Unknown'}</span>
            </div>
            <div className="info-item">
              <label>Device Age:</label>
              <span className="device-age">
                {deviceData ? formatDeviceAge(deviceData.ageMinutes) : 'Unknown'}
              </span>
            </div>
            <div className="info-item">
              <label>Status:</label>
              <span className={`status ${deviceData?.isNewDevice ? 'new' : 'returning'}`}>
                {deviceData?.isNewDevice ? ' New Device' : ' Returning Device'}
              </span>
            </div>
          </div>

          {deviceData?.message && (
            <div className="message">
              <p>{deviceData.message}</p>
            </div>
          )}
        </div>

        {fingerprint && (
          <details className="fingerprint-details">
            <summary>View Fingerprint Data</summary>
            <div className="fingerprint-data">
              <div className="fp-section">
                <h4>Device ID Debug</h4>
                <p><strong>LocalStorage Available:</strong> {fingerprint.localStorage ? 'Yes' : 'No'}</p>
                <p><strong>Stored Device ID:</strong> {localStorage.getItem('device_fingerprint_id') || 'None'}</p>
              </div>

              <div className="fp-section">
                <h4>Browser Info</h4>
                <p><strong>User Agent:</strong> {fingerprint.userAgent}</p>
                <p><strong>Language:</strong> {fingerprint.language}</p>
                <p><strong>Platform:</strong> {fingerprint.platform}</p>
                <p><strong>Timezone:</strong> {fingerprint.timezone}</p>
              </div>

              <div className="fp-section">
                <h4>Screen Info</h4>
                <p><strong>Resolution:</strong> {fingerprint.screenResolution}</p>
              </div>

              <div className="fp-section">
                <h4>Capabilities</h4>
                <p><strong>Cookies Enabled:</strong> {fingerprint.cookiesEnabled ? 'Yes' : 'No'}</p>
                <p><strong>Local Storage:</strong> {fingerprint.localStorage ? 'Yes' : 'No'}</p>
                <p><strong>Touch Support:</strong> {fingerprint.touchSupport ? 'Yes' : 'No'}</p>
                <p><strong>Hardware Concurrency:</strong> {fingerprint.hardwareConcurrency}</p>
              </div>
            </div>
          </details>
        )}

        <div className="footer">
          <p>This application tracks devices using browser fingerprinting techniques.</p>
        </div>
      </div>
    </div>
  );
}

export default App;