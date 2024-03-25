export const TEMPERATURE_THRESHOLD = {
  MIN: 15,
  MAX: 40,
} as const;

export const MOISTURE_THRESHOLD = {
  MIN: 40,
  MAX: 80,
} as const;

export const NOTIFICATION_PERMISSION_LOCAL_STORAGE_KEY =
  'iot/notificationPermission';
