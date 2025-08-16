import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import Particles from "react-tsparticles";
import { ThemeProvider } from '@mui/material';
import theme from '../theme';

const BackendErrorScreen = ({
  particlesInit, particlesConfig, setBackendStatusError, getBackendStatus, setBackendStatus
}) => {
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
};

export default BackendErrorScreen;
