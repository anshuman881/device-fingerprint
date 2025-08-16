export const formatDeviceAge = (minutes) => {
  if (minutes === 0) return '0 minutes (new device)';
  if (minutes < 60) return `${minutes} minutes`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)} hours ${minutes % 60} minutes`;
  return `${Math.floor(minutes / 1440)} days ${Math.floor((minutes % 1440) / 60)} hours`;
};

export const parseToDate = (value) => {
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

export const formatDateTime = (value) => {
  const date = parseToDate(value);
  if (!date || isNaN(date.getTime())) return 'Loading...';
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};
