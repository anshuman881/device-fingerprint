import React from 'react';
import {
  Card, CardContent, Typography, Accordion, AccordionSummary, AccordionDetails,
  Grid, Paper, Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import theme from '../theme';

const FingerprintDetails = ({ fingerprint }) => {
  return (
    fingerprint && (
      <Accordion sx={{
        background: theme.palette.background.paper,
        '& .MuiAccordionSummary-root': {
          borderBottom: 'none',
        }
      }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>Fingerprint Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} width={'48%'}>
              <Card sx={{
                background: theme.palette.background.paper,
                border: 'none', // Remove card border as paper has border
                boxShadow: 'none' // Remove card shadow
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>Browser Info</Typography>
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
                        <Typography sx={{ color: theme.palette.text.primary }}>
                          {value}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* WebGL Section */}
            <Grid item xs={12} md={6} width={'49%'}>
              <Card sx={{
                background: theme.palette.background.paper,
                border: 'none',
                boxShadow: 'none'
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>WebGL</Typography>
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
                        <Typography sx={{ color: theme.palette.text.primary }}>
                          {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            {/* Capabilities Section */}
            <Grid item xs={12} md={4} width={'31%'}>
              <Card sx={{
                background: theme.palette.background.paper,
                border: 'none',
                boxShadow: 'none'
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>Capabilities</Typography>
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
                        <Typography sx={{ color: theme.palette.text.primary }}>
                          {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Screen & Hardware Section */}
            <Grid item xs={12} md={4} width={'32%'}>
              <Card sx={{
                background: theme.palette.background.paper,
                border: 'none',
                boxShadow: 'none'
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>Screen & Hardware</Typography>
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
                        <Typography sx={{ color: theme.palette.text.primary }}>
                          {value}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Plugins Section */}
            <Grid item xs={12} md={4} width={'32%'}>
              <Card sx={{
                background: theme.palette.background.paper,
                border: 'none',
                boxShadow: 'none'
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>Plugins ({Array.isArray(fingerprint.plugins) ? fingerprint.plugins.length : 0})</Typography>
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
    )
  );
};

export default FingerprintDetails;
