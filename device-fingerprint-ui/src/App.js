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
import VisibilityIcon from '@mui/icons-material/Visibility';
import './App.css';

const theme = createTheme({
  palette: {
    primary: { main: '#1565C0' }, // A slightly lighter, yet dark blue
    secondary: { main: '#42A5F5' }, // Keep lighter blue for secondary
    error: { main: '#D32F2F' }, // Standard error red
    warning: { main: '#FFB300' }, // Adjusted warning yellow
    background: {
      default: '#1A202C', // Lighter dark background
      paper: 'rgba(30, 40, 50, 0.8)' // Lighter semi-transparent blue for cards/paper
    },
    text: {
      primary: '#FFFFFF', // Keep primary text white for contrast
      secondary: '#90CAF9' // Brighter light blue for secondary text
    }
  },
  shape: { borderRadius: 12 }, // Slightly rounded corners, typical Apple
  typography: {
    fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h2: { fontWeight: 600, letterSpacing: 0.8 },
    h3: { fontWeight: 600, letterSpacing: 0.4 },
    subtitle2: { color: '#E0E0E0' }, // Directly set the color to a static value
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 0, // Remove default elevation to control via boxShadow
      },
      styleOverrides: {
        root: {
          background: 'rgba(30, 40, 50, 0.8)',
          backdropFilter: 'blur(20px) saturate(150%)',
          border: '1px solid rgba(144, 202, 249, 0.3)', // Lighter blue border
          boxShadow: '0 10px 30px rgba(0,0,0,0.4), inset 0 1px rgba(255,255,255,0.06)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 15px 45px rgba(0,0,0,0.6), inset 0 1px rgba(255,255,255,0.1)',
          },
        }
      }
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          background: 'rgba(30, 40, 50, 0.8)',
          backdropFilter: 'blur(20px) saturate(150%)',
          border: '1px solid rgba(144, 202, 249, 0.3)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.4), inset 0 1px rgba(255,255,255,0.06)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 15px 45px rgba(0,0,0,0.6), inset 0 1px rgba(255,255,255,0.1)',
          },
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: { color: '#FFFFFF' },
        subtitle2: ({ theme }) => ({ color: theme.palette.text.primary })
      }
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 999,
          backdropFilter: 'blur(12px)',
          color: theme.palette.text.primary,
          borderColor: 'rgba(144, 202, 249, 0.4)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            borderColor: theme.palette.primary.light,
            boxShadow: '0 0 10px rgba(21, 101, 192, 0.6)',
          },
        })
      }
    },
    MuiAccordion: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          background: 'rgba(30, 40, 50, 0.8)',
          border: '1px solid rgba(144, 202, 249, 0.3)',
          borderRadius: 12,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
          },
          '&:before': { // Remove the default Material-UI border before
            display: 'none',
          },
        },
        expanded: {
          margin: 'auto !important', // Fixes margin issue when expanded
          marginTop: '16px !important', // Add some top margin for spacing
          marginBottom: '16px !important', // Add some bottom margin
        },
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999, // Pill shape
          textTransform: 'none', // No uppercase
          fontWeight: 600,
          padding: '10px 20px',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(21, 101, 192, 0.3)',
          },
        },
      },
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
                textAlign="center"
                sx={{
                  color: theme.palette.text.primary,
                  textShadow: '0 0 15px rgba(21, 101, 192, 0.5)', // Adjusted blue glow for title
                  fontWeight: theme.typography.h2.fontWeight,
                  letterSpacing: theme.typography.h2.letterSpacing
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
                      color: theme.palette.primary.main,
                      filter: 'drop-shadow(0 0 15px rgba(21, 101, 192, 0.6))', // Adjusted blue drop shadow
                    }}
                  />
                </motion.div>
                <Typography
                  variant="h6"
                  mt={3}
                  sx={{
                    color: theme.palette.text.primary,
                    textShadow: '0 0 8px rgba(21, 101, 192, 0.3)', // Adjusted subtle blue text shadow
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
                <WifiOffIcon sx={{ fontSize: 80, color: theme.palette.error.main }} />
                <Typography variant="h3" sx={{ mt: 2, color: theme.palette.text.primary, fontWeight: 700 }}>Uh‑oh, backend took a coffee break!</Typography>
                <Typography variant="h6" sx={{ mt: 1, color: theme.palette.text.primary }}>We can't reach the server right now. It might be stretching its legs.</Typography>
                <SentimentVeryDissatisfiedIcon sx={{ mt: 2, fontSize: 40, color: theme.palette.text.primary }} />
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

            <Grid container spacing={3} sx={{ mb: 8 }}>
              <Grid item>
                <Paper elevation={3} sx={{
                  p: 3,
                  height: '100%',
                  background: theme.palette.background.paper,
                  '& .MuiTypography-root': {
                    color: theme.palette.text.primary,
                  },
                  '& .MuiSvgIcon-root': {
                    color: theme.palette.text.primary,
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

              <Grid item>
                <Paper elevation={3} sx={{
                  p: 3,
                  height: '100%',
                  background: theme.palette.background.paper,
                  '& .MuiTypography-root': {
                    color: theme.palette.text.primary,
                  },
                  '& .MuiSvgIcon-root': {
                    color: theme.palette.text.primary,
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
              <Grid item xs={4} sm={4} md={4} lg={3}>
                <Paper elevation={3} sx={{
                  p: 3,
                  height: '100%',
                  background: theme.palette.background.paper,
                  '& .MuiTypography-root': {
                    color: theme.palette.text.primary,
                  },
                  '& .MuiSvgIcon-root': {
                    color: theme.palette.text.primary,
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
                      sx={{ fontSize: '1.0rem', py: 0.5, px: 1 }}
                    />
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={4} sm={4} md={4} lg={3}>
                <Paper elevation={3} sx={{
                  p: 3,
                  height: '100%',
                  background: theme.palette.background.paper,
                  '& .MuiTypography-root': {
                    color: theme.palette.text.primary,
                  },
                  '& .MuiSvgIcon-root': {
                    color: theme.palette.text.primary,
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
                      sx={{ fontSize: '1.0rem', py: 0.5, px: 1 }}
                    />
                  </Box>
                </Paper>
              </Grid>

              {deviceData?.message && (
                <Grid item xs={4} sm={4} md={4} lg={1}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      height: '100%',
                      background: theme.palette.background.paper,
                      '& .MuiTypography-root': {
                        color: theme.palette.text.primary,
                      },
                      '& .MuiSvgIcon-root': {
                        color: theme.palette.text.primary,
                      }
                    }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      mb={2}
                    >
                      <VisibilityIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Visit Count</Typography>
                    </Box>
                    <Typography variant="h5">
                      {deviceData?.visitCount || 'Unknown'}
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>

            {/* Backend Status now shown in the Status card above */}

            {fingerprint && (
              <Accordion sx={{
                background: theme.palette.background.paper,
                '& .MuiAccordionSummary-root': {
                  borderBottom: 'none',
                }
              }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" sx={{color: theme.palette.text.primary}}>Fingerprint Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card sx={{
                        background: theme.palette.background.paper,
                        border: 'none', // Remove card border as paper has border
                        boxShadow: 'none' // Remove card shadow
                      }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom sx={{color: theme.palette.text.primary}}>Browser Info</Typography>
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
                                  sx={{ color: theme.palette.text.primary }}
                                >
                                  {key}
                                </Typography>
                                <Typography sx={{color: theme.palette.text.primary}}>
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
                      <Card sx={{
                        background: theme.palette.background.paper,
                        border: 'none',
                        boxShadow: 'none'
                      }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom sx={{color: theme.palette.text.primary}}>WebGL</Typography>
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
                                  sx={{ color: theme.palette.text.primary }}
                                >
                                  {key}
                                </Typography>
                                <Typography sx={{color: theme.palette.text.primary}}>
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
                      <Card sx={{
                        background: theme.palette.background.paper,
                        border: 'none',
                        boxShadow: 'none'
                      }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom sx={{color: theme.palette.text.primary}}>Capabilities</Typography>
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
                                  sx={{ color: theme.palette.text.primary }}
                                >
                                  {key}
                                </Typography>
                                <Typography sx={{color: theme.palette.text.primary}}>
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
                      <Card sx={{
                        background: theme.palette.background.paper,
                        border: 'none',
                        boxShadow: 'none'
                      }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom sx={{color: theme.palette.text.primary}}>Screen & Hardware</Typography>
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
                                  sx={{ color: theme.palette.text.primary }}
                                >
                                  {key}
                                </Typography>
                                <Typography sx={{color: theme.palette.text.primary}}>
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
                      <Card sx={{
                        background: theme.palette.background.paper,
                        border: 'none',
                        boxShadow: 'none'
                      }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom sx={{color: theme.palette.text.primary}}>Plugins ({Array.isArray(fingerprint.plugins) ? fingerprint.plugins.length : 0})</Typography>
                          <Box display="flex" flexDirection="column" gap={1}>
                            {(fingerprint.plugins || []).slice(0, 20).map((p, idx) => (
                              <Paper elevation={0} key={idx} sx={{
                                p: 1,
                                bgcolor: 'transparent',
                                border: 'none',
                                boxShadow: 'none'
                              }}>
                                <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary }}>
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
