import React, { useEffect, useState } from 'react';
import DeviceFingerprint from './components/DeviceFingerPrint';
import { getDeviceData, createDevice, getBackendStatus } from './services/DeviceFingerprintService';
import { motion } from 'framer-motion';
import {
  Typography, Container, Box, Card, CardContent, Grid, Paper, Chip
} from '@mui/material';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { ThemeProvider } from '@mui/material';
import './App.css';
import { formatDeviceAge, parseToDate, formatDateTime } from './utils/formatters';
import theme, { auroraShift } from './theme';
import LoadingScreen from './components/LoadingScreen';
import BackendErrorScreen from './components/BackendErrorScreen';
import FingerprintDetails from './components/FingerprintDetails';
import DeviceDataDisplay from './components/DeviceDataDisplay'; // New import

function App() {
  const [deviceData, setDeviceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fingerprint, setFingerprint] = useState(null);
  const [backendStatus, setBackendStatus] = useState(null);
  const [backendStatusError, setBackendStatusError] = useState(null);

  let mounted = true;
  useEffect(() => {
    initializeDevice();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const subscription = getBackendStatus().subscribe({
      next: (data) => setBackendStatus(data),
      error: (err) => setBackendStatusError('Backend Unavailable')
    });
    return () => subscription.unsubscribe();
  }, []);

  const initializeDevice = async () => {
    try {
      if (!mounted) return;
      setLoading(true);
      // Collect device fingerprint
      const fp = DeviceFingerprint.collect();
      if (!mounted) return;
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
        canvas: fp.canvas,
        webGL: fp.webGL,
        plugins: fp.plugins,
        deviceMemory: fp.deviceMemory
      };

      let subscription;

      subscription = getDeviceData(hash).subscribe({
        next: (data) => {
          setDeviceData(data);
          setLoading(false);
        },
        error: (error) => {
          // If device not found, create new device
          subscription = createDevice(payload).subscribe({
            next: (data) => {
              setDeviceData(data);
              setLoading(false);
            },
            error: (error) => {
              console.error('Error:', error);
              setBackendStatusError(error.message); // Using backendStatusError for general errors
              setLoading(false);
            }
          });
        }
      });
    } finally {
      if (mounted) setLoading(false);
    }
  };

  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  const particlesConfig = {
    particles: {
      number: { value: 70, density: { enable: true, value_area: 800 } }, // Slightly fewer particles
      color: { value: "#BBDEFB" }, // Light blue for particles
      opacity: { value: 0.5 }, // Slightly more opaque
      size: { value: 2.5 }, // Smaller particles
      line_linked: {
        enable: true,
        distance: 150,
        color: "#90CAF9", // Slightly darker blue for lines
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 1.5,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "bubble" }, // Changed to bubble for a more subtle effect
        resize: true
      },
      modes: {
        bubble: { distance: 200, size: 6, duration: 2, opacity: 0.5 } // Defined bubble mode
      }
    },
    retina_detect: true
  };

  if (loading) {
    return (
      <LoadingScreen
        particlesInit={particlesInit}
        particlesConfig={particlesConfig}
      />
    );
  }

  // Funny offline screen when actuator check fails
  if (backendStatusError && !backendStatus) {
    return (
      <BackendErrorScreen
        particlesInit={particlesInit}
        particlesConfig={particlesConfig}
        setBackendStatusError={setBackendStatusError}
        getBackendStatus={getBackendStatus}
        setBackendStatus={setBackendStatus}
      />
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        py: 4,
        bgcolor: 'background.default',
      }}>
        <Particles id="tsparticles" init={particlesInit} options={particlesConfig} />
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h3"
              gutterBottom
              textAlign="center"
              sx={{
                background: 'linear-gradient(180deg, #FFFFFF, #B3B3B3)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 6px 25px rgba(0,0,0,0.4)'
              }}
            >
              Device Tracker
            </Typography>

            <DeviceDataDisplay deviceData={deviceData} />

            {/* Backend Status now shown in the Status card above */}

            <FingerprintDetails fingerprint={fingerprint} />

            <Box mt={4} textAlign="center">
              <Typography variant="body2" color="textSecondary">
                This application tracks devices using browser fingerprinting techniques.
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
