import React, { useEffect, useState } from 'react';
import DeviceFingerprint from './components/DeviceFingerPrint';
import { getDeviceData, createDevice, getBackendStatus } from './services/DeviceFingerprintService';
import { motion } from 'framer-motion';
import {
  Card, CardContent, Typography, CircularProgress,
  Chip, Accordion, AccordionSummary, AccordionDetails,
  Grid, Paper, Box, Container, Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DevicesIcon from '@mui/icons-material/Devices';
import TimerIcon from '@mui/icons-material/Timer';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HistoryIcon from '@mui/icons-material/History';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { createTheme, ThemeProvider } from '@mui/material';
import { keyframes } from '@mui/system';
import './App.css';

// Apple-inspired glassy theme
const theme = createTheme({
  palette: {
    primary: { main: '#0A84FF' }, // Apple blue
    secondary: { main: '#30D158' }, // Apple green
    error: { main: '#FF453A' },
    warning: { main: '#FFD60A' },
    background: {
      default: '#0b0b0f',
      paper: 'rgba(26, 26, 30, 0.6)'
    },
    text: {
      primary: '#EDEDED',
      secondary: '#A1A1AA'
    }
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h2: { fontWeight: 700, letterSpacing: 1 },
    h3: { fontWeight: 700, letterSpacing: 0.5 },
    subtitle2: { color: '#64ffda' }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(26, 26, 30, 0.6)',
          backdropFilter: 'blur(16px) saturate(120%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.40), inset 0 1px rgba(255,255,255,0.06)'
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: { color: '#EDEDED' },
        subtitle2: { color: '#64ffda' }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          backdropFilter: 'blur(10px)',
          color: '#EDEDED',
          borderColor: 'rgba(255, 255, 255, 0.12)'
        }
      }
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          background: 'rgba(26, 26, 30, 0.6)',
          border: '1px solid rgba(255,255,255,0.08)'
        }
      }
    }
  }
});

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
        error: () => {
          // If device not found, create new device
          subscription = createDevice(payload).subscribe({
            next: (data) => {
              setDeviceData(data);
              setLoading(false);
            },
            error: (error) => {
              console.error('Error:', error);
              setLoading(false);
            }
          });
        }
      });
    } finally {
      if (mounted) setLoading(false);
    }
  };

  const formatDeviceAge = (minutes) => {
    if (minutes === 0) return '0 minutes (new device)';
    if (minutes < 60) return `${minutes} minutes`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)} hours ${minutes % 60} minutes`;
    return `${Math.floor(minutes / 1440)} days ${Math.floor((minutes % 1440) / 60)} hours`;
  };

  // Helpers to format LocalDateTime (array or ISO string) to a readable date/time
  const parseToDate = (value) => {
    if (!value) return null;
    try {
      if (Array.isArray(value)) {
        const [year, month, day, hour = 0, minute = 0, second = 0, nano = 0] = value;
        return new Date(year, month - 1, day, hour, minute, second, Math.floor(nano / 1e6));
      }
      return new Date(value);
    } catch (_) {
      return null;
    }
  };

  const formatDateTime = (value) => {
    const date = parseToDate(value);
    if (!date || isNaN(date.getTime())) return 'Unknown';
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  const particlesConfig = {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: "#ffffff" },
      opacity: { value: 0.2 },
      size: { value: 3 },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#0A84FF",
        opacity: 0.2,
        width: 1
      },
      move: {
        enable: true,
        speed: 2,
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
        onhover: { enable: true, mode: "repulse" },
        resize: true
      }
    },
    retina_detect: true
  };

  // Subtle aurora background animation (eye-relaxing)
  const auroraShift = keyframes`
    0% { background-position: 0% 0%, 100% 0%, 0% 100%; }
    50% { background-position: 100% 0%, 0% 100%, 100% 100%; }
    100% { background-position: 0% 100%, 100% 100%, 0% 0%; }
  `;

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            bgcolor: 'background.default',
            minHeight: '100vh',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Particles
            id="tsparticles"
            init={particlesInit}
            options={particlesConfig}
          />
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h2"
                gutterBottom
                sx={{
                  color: 'text.primary',
                  textShadow: '0 0 10px rgba(33, 150, 243, 0.5)',
                  fontWeight: 'bold',
                  letterSpacing: 2
                }}
              >
                Device Tracker
              </Typography>
              <Box textAlign="center" mt={4}>
                <motion.div
                  animate={{
                    rotate: 360
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <CircularProgress
                    size={80}
                    thickness={4}
                    sx={{
                      color: 'primary.main',
                      filter: 'drop-shadow(0 0 10px rgba(33, 150, 243, 0.5))'
                    }}
                  />
                </motion.div>
                <Typography
                  variant="h6"
                  mt={3}
                  sx={{
                    color: 'text.secondary',
                    textShadow: '0 0 5px rgba(33, 150, 243, 0.3)'
                  }}
                >
                  Analyzing device fingerprint...
                </Typography>
              </Box>
            </motion.div>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  // Funny offline screen when actuator check fails
  if (backendStatusError && !backendStatus) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
          <Particles id="tsparticles" init={particlesInit} options={particlesConfig} />
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Box textAlign="center">
                <WifiOffIcon sx={{ fontSize: 80, color: '#ff1744' }} />
                <Typography variant="h3" sx={{ mt: 2, color: '#ff8a80', fontWeight: 700 }}>Uh‑oh, backend took a coffee break!</Typography>
                <Typography variant="h6" sx={{ mt: 1, color: '#a8b2d1' }}>We can't reach the server right now. It might be stretching its legs.</Typography>
                <SentimentVeryDissatisfiedIcon sx={{ mt: 2, fontSize: 40, color: '#a8b2d1' }} />
                <Box sx={{ mt: 4 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setBackendStatusError(null);
                      const subscription = getBackendStatus().subscribe({
                        next: (data) => setBackendStatus(data),
                        error: () => setBackendStatusError('Backend Unavailable')
                      });
                      setTimeout(() => subscription.unsubscribe(), 5000);
                    }}
                  >
                    Try Again
                  </Button>
                </Box>
              </Box>
            </motion.div>
          </Box>
        </Box>
      </ThemeProvider>
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
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(60% 50% at 10% 10%, rgba(10,132,255,0.15), transparent 60%),
                       radial-gradient(50% 60% at 90% 20%, rgba(48,209,88,0.12), transparent 60%),
                       radial-gradient(70% 60% at 30% 90%, rgba(255,214,10,0.08), transparent 60%)`,
          filter: 'blur(40px) saturate(120%)',
          animation: `${auroraShift} 40s ease-in-out infinite`,
          backgroundSize: '200% 200%',
          opacity: 0.9,
          pointerEvents: 'none'
        }
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
                background: 'linear-gradient(180deg, #ffffff, #b3b3b3)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 10px 30px rgba(0,0,0,0.45)'
              }}
            >
              Device Tracker
            </Typography>

            <Grid container spacing={3} sx={{ mb: 8 }} columns={{ xs: 4, sm: 8, md: 20 }}>
              <Grid item xs={4} sm={4} md={4}>
                <Paper elevation={3} sx={{
                  p: 3,
                  height: '100%',
                  background: 'rgba(23, 42, 69, 0.95)',
                  '& .MuiTypography-root': {
                    color: '#ffffff',
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#64ffda', // Mint color for icons
                  }
                }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <DevicesIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Device ID</Typography>
                  </Box>
                  <Typography variant="h5">
                    {deviceData?.deviceId || 'Unknown'}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={4} sm={4} md={4}>
                <Paper elevation={3} sx={{
                  p: 3,
                  height: '100%',
                  background: 'rgba(23, 42, 69, 0.95)',
                  '& .MuiTypography-root': {
                    color: '#ffffff',
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#64ffda',
                  }
                }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <TimerIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Age</Typography>
                  </Box>
                  <Typography variant="h5">
                    {deviceData ? formatDeviceAge(deviceData.ageMinutes) : 'Unknown'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={4} sm={4} md={4}>
                <Paper elevation={3} sx={{
                  p: 3,
                  height: '100%',
                  background: 'rgba(23, 42, 69, 0.95)',
                  '& .MuiTypography-root': {
                    color: '#ffffff',
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#64ffda',
                  }
                }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <CalendarTodayIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">First Visit Time</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip
                      label={formatDateTime(deviceData?.firstSeen)}
                      color={'default'}
                      variant={'outlined'}
                      sx={{ fontSize: '1.1rem', py: 1 }}
                    />
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={4} sm={4} md={4}>
                <Paper elevation={3} sx={{
                  p: 3,
                  height: '100%',
                  background: 'rgba(23, 42, 69, 0.95)',
                  '& .MuiTypography-root': {
                    color: '#ffffff',
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#64ffda',
                  }
                }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <HistoryIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Last Visit Time</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip
                      label={formatDateTime(deviceData?.lastSeen)}
                      color={'default'}
                      variant={'outlined'}
                      sx={{ fontSize: '1.1rem', py: 1 }}
                    />
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            {deviceData?.message && (
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  mb: 6,
                  background: 'rgba(23, 42, 69, 0.95)',
                  border: '1px solid rgba(100, 255, 218, 0.3)',
                  borderRadius: 2,
                  position: 'relative',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, #64ffda, transparent)'
                  }
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                  sx={{
                    px: 2
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#64ffda',
                      opacity: 0.8,
                    }}
                  >
                    Welcome! This is your Visit #{deviceData.visitCount}
                  </Typography>
                </Box>
              </Paper>
            )}

            {/* Backend Status now shown in the Status card above */}

            {fingerprint && (
              <Accordion sx={{
                background: 'transparent',
                '& .MuiAccordionSummary-root': {
                  borderBottom: 'none',
                }
              }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Fingerprint Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid item>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>Browser Info</Typography>
                          <Box display="flex" flexDirection="column" gap={1}>
                            {Object.entries({
                              'User Agent': fingerprint.userAgent,
                              'Language': fingerprint.language,
                              'Platform': fingerprint.platform,
                              'Timezone': fingerprint.timezone
                            }).map(([key, value]) => (
                              <Paper elevation={0} key={key} sx={{
                                p: 1,
                                bgcolor: 'transparent',
                                border: 'none',
                                boxShadow: 'none'
                              }}>
                                <Typography
                                  variant="subtitle2"
                                  sx={{ color: 'text.secondary' }}
                                >
                                  {key}
                                </Typography>
                                <Typography>
                                  {value}
                                </Typography>
                              </Paper>
                            ))}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* WebGL Section */}
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>WebGL</Typography>
                          <Box display="flex" flexDirection="column" gap={1}>
                            {Object.entries({
                              'Supported': fingerprint.webGLSupported,
                              'Vendor': fingerprint.webGL?.vendor || 'Unknown',
                              'Renderer': fingerprint.webGL?.renderer || 'Unknown'
                            }).map(([key, value]) => (
                              <Paper elevation={0} key={key} sx={{
                                p: 1,
                                bgcolor: 'transparent',
                                border: 'none',
                                boxShadow: 'none'
                              }}>
                                <Typography
                                  variant="subtitle2"
                                  sx={{ color: 'text.secondary' }}
                                >
                                  {key}
                                </Typography>
                                <Typography>
                                  {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                                </Typography>
                              </Paper>
                            ))}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    {/* Capabilities Section */}
                    <Grid item xs={12} md={4}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>Capabilities</Typography>
                          <Box display="flex" flexDirection="column" gap={1}>
                            {Object.entries({
                              'Cookies': fingerprint.cookiesEnabled,
                              'Local Storage': fingerprint.localStorage,
                              'Touch Support': fingerprint.touchSupport,
                              'Hardware Concurrency': fingerprint.hardwareConcurrency
                            }).map(([key, value]) => (
                              <Paper elevation={0} key={key} sx={{
                                p: 1,
                                bgcolor: 'transparent',
                                border: 'none',
                                boxShadow: 'none'
                              }}>
                                <Typography
                                  variant="subtitle2"
                                  sx={{ color: 'text.secondary' }}
                                >
                                  {key}
                                </Typography>
                                <Typography>
                                  {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                                </Typography>
                              </Paper>
                            ))}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Screen & Hardware Section */}
                    <Grid item xs={12} md={4}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>Screen & Hardware</Typography>
                          <Box display="flex" flexDirection="column" gap={1}>
                            {Object.entries({
                              'Screen Resolution': fingerprint.screenResolution,
                              'Color Depth': fingerprint.colorDepth,
                              'Pixel Depth': fingerprint.pixelDepth,
                              'Device Memory (GB)': fingerprint.deviceMemory
                            }).map(([key, value]) => (
                              <Paper elevation={0} key={key} sx={{
                                p: 1,
                                bgcolor: 'transparent',
                                border: 'none',
                                boxShadow: 'none'
                              }}>
                                <Typography
                                  variant="subtitle2"
                                  sx={{ color: 'text.secondary' }}
                                >
                                  {key}
                                </Typography>
                                <Typography>
                                  {value}
                                </Typography>
                              </Paper>
                            ))}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Plugins Section */}
                    <Grid item xs={12} md={4}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>Plugins ({Array.isArray(fingerprint.plugins) ? fingerprint.plugins.length : 0})</Typography>
                          <Box display="flex" flexDirection="column" gap={1}>
                            {(fingerprint.plugins || []).slice(0, 20).map((p, idx) => (
                              <Paper elevation={0} key={idx} sx={{
                                p: 1,
                                bgcolor: 'transparent',
                                border: 'none',
                                boxShadow: 'none'
                              }}>
                                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                                  {p?.name || 'Unknown Plugin'}
                                </Typography>
                              </Paper>
                            ))}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            )}

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