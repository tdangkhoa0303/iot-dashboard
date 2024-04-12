export const AIO_FEED_IDS = {
  FAN: 'duc23mse23106/feeds/button2',
  LIGHT: 'duc23mse23106/feeds/button3',
  PUMP: 'duc23mse23106/feeds/button1',
  TEMPERATURE_SENSOR: 'duc23mse23106/feeds/temperature',
  MOISTURE_SENSOR: 'duc23mse23106/feeds/moisture',
} as const;

export const AIO_USERNAME = '';
export const AIO_KEY = '';
export const BROKER_URI = `mqtts://${AIO_USERNAME}:${AIO_KEY}@io.adafruit.com`;
