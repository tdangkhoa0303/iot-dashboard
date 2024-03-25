import {
  AIO_FEED_IDS,
  AIO_KEY,
  AIO_USERNAME,
  BROKER_URI,
} from './constants/aio';
import { MOISTURE_THRESHOLD, TEMPERATURE_THRESHOLD } from './constants/biz';
import { capitalize } from 'lodash-es';
import mqtt from 'mqtt';
import type { ManifestEntry } from 'workbox-build';
import { clientsClaim } from 'workbox-core';
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';

declare let self: ServiceWorkerGlobalScope;

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST as ManifestEntry[]);

// clean old assets
cleanupOutdatedCaches();

const allowlist = import.meta.env.DEV ? [/^\/$/] : undefined;

// to allow work offline
registerRoute(
  new NavigationRoute(createHandlerBoundToURL('index.html'), { allowlist })
);

const pushNotification = (title: string, message: string) =>
  self.registration.showNotification(capitalize(title ?? ''), {
    body: message,
    icon: '/apple-icon-180.png',
    badge: '/apple-icon-180.png',
  });

const handleMqttTopic = (topic: string, payload: number) => {
  switch (topic) {
    case AIO_FEED_IDS.MOISTURE_SENSOR:
      if (payload < MOISTURE_THRESHOLD.MIN) {
        pushNotification('IOT', 'Humidity is lower than threshold');
      } else if (payload > MOISTURE_THRESHOLD.MAX) {
        pushNotification('IOT', 'Humidity is higher than threshold');
      }
      break;
    case AIO_FEED_IDS.TEMPERATURE_SENSOR:
      if (payload < TEMPERATURE_THRESHOLD.MIN) {
        pushNotification('IOT', 'Temperature is lower than threshold');
      } else if (payload > TEMPERATURE_THRESHOLD.MAX) {
        pushNotification('IOT', 'Temperature is higher than threshold');
      }
      break;
    default:
      return;
  }
};

const subcribeMqtt = () => {
  const client = mqtt.connect(BROKER_URI, {
    clientId: 'khoadtran/sw',
    username: AIO_USERNAME,
    password: AIO_KEY,
    clean: false,
  });

  client.on('connect', () => {
    console.log('Connected to MQTT server.');
  });

  client.on('disconnect', () => {
    console.log('Disconnected MQTT server.');
  });

  client.subscribe([
    AIO_FEED_IDS.TEMPERATURE_SENSOR,
    AIO_FEED_IDS.MOISTURE_SENSOR,
  ]);

  client.on('message', (topic: string, message: Buffer) => {
    const payload = Number(message.toString());
    if (!payload) {
      return;
    }

    handleMqttTopic(topic, payload);
  });
};

subcribeMqtt();

const { clients } = self;

self.addEventListener('notificationclick', (event) => {
  const { notification } = event;
  notification.close();

  clients.openWindow(`/`);
});

self.skipWaiting();
clientsClaim();
