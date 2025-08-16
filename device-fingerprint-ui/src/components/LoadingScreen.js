import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { ThemeProvider } from '@mui/material';
import theme from '../theme';

const LoadingScreen = ({ particlesInit, particlesConfig }) => {
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
                textShadow: '0 0 15px rgba(21, 101, 192, 0.5)',
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
                    filter: 'drop-shadow(0 0 15px rgba(21, 101, 192, 0.6))',
                  }}
                />
              </motion.div>
              <Typography
                variant="h6"
                mt={3}
                sx={{
                  color: theme.palette.text.primary,
                  textShadow: '0 0 8px rgba(21, 101, 192, 0.3)',
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
};

export default LoadingScreen;
