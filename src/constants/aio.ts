export const AIO_FEED_IDS = {
  FAN: 'duc23mse23106/feeds/button1',
  LIGHT: 'duc23mse23106/feeds/button2',
  PUMP: 'duc23mse23106/feeds/button3',
  TEMPERATURE_SENSOR: 'duc23mse23106/feeds/temperature',
  MOISTURE_SENSOR: 'duc23mse23106/feeds/moisture',
} as const;

export const AIO_USERNAME = 'duc23mse23106';
export const AIO_KEY = 'aio_XOdg639KpUeEF5KDkUHklYRs74Tq';
export const BROKER_URI = `mqtts://${AIO_USERNAME}:${AIO_KEY}@io.adafruit.com`;
