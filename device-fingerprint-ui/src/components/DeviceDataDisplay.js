import React from 'react';
import {
    Chip, Grid, Paper, Box, Typography
} from '@mui/material';
import DevicesIcon from '@mui/icons-material/Devices';
import TimerIcon from '@mui/icons-material/Timer';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HistoryIcon from '@mui/icons-material/History';
import VisibilityIcon from '@mui/icons-material/Visibility';
import theme from '../theme';
import { formatDeviceAge, formatDateTime } from '../utils/formatters';

const DeviceDataDisplay = ({ deviceData }) => {
    return (
        <Grid container spacing={2} sx={{ mb: 8 }}>
            <Grid item xs={12} sm={6} md={4} width={'15%'}>
                <Paper elevation={3} sx={{
                    p: 3,
                    height: '80%',
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
                        {deviceData?.deviceId || 'Loading...'}
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4} width={'15%'}>
                <Paper elevation={3} sx={{
                    p: 3,
                    height: '80%',
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
                        {deviceData ? formatDeviceAge(deviceData.ageMinutes) : 'Loading...'}
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4} width={'25%'}>
                <Paper elevation={3} sx={{
                    p: 3,
                    height: '80%',
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
            <Grid item xs={12} sm={6} md={4} width={'25%'}>
                <Paper elevation={3} sx={{
                    p: 3,
                    height: '80%',
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
            <Grid item xs={12} sm={6} md={4} width={'13%'}>
                <Paper
                    elevation={3}
                    mt={4}
                    sx={{
                        p: 3,
                        height: '80%',
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
                        <Typography variant="h6">Visit</Typography>
                    </Box>
                    <Typography variant="h5">
                        {deviceData?.visitCount || 'Loading...'}
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default DeviceDataDisplay;
