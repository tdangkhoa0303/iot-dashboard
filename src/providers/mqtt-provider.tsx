import mqtt, { MqttClient } from 'mqtt';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { v4 as uuid } from 'uuid';
import { noop, omit } from 'lodash-es';
import { AIO_KEY, AIO_USERNAME, BROKER_URI } from 'constants/aio';
import Loader from 'components/loader';

export type MqttMessagePayload = {
  topic: string;
  data: string;
};

interface MqttContextValue {
  mqttClient: MqttClient | null;
  isConnecting: boolean;
  registerTopic: (topic: string, handler: MqttMessageHandler) => () => void;
}

const MqttConext = createContext<MqttContextValue>({
  mqttClient: null,
  isConnecting: false,
  registerTopic: () => noop,
});

export const useMqttContext = () => useContext(MqttConext);

export type MqttMessageHandler = (payload: MqttMessagePayload) => void;

// const BROKER_URI = `tcp://mqtt.ohstem.vn:1883`;

const MqttProvider = ({
  children,
  initialTopics = [],
}: {
  children: ReactNode;
  initialTopics?: string[];
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [mqttClient, setMqttClient] = useState<MqttClient | null>(null);
  const [subcribedTopics, setSubcribedTopics] = useState(
    new Set<string>(initialTopics)
  );
  const messageHandlersRef = useRef<
    Record<string, Record<string, MqttMessageHandler>>
  >({});

  const registerTopic = useCallback(
    (topic: string, handler: MqttMessageHandler) => {
      if (!subcribedTopics.has(topic)) {
        setSubcribedTopics(new Set(subcribedTopics).add(topic));
      }

      const handlerId = uuid();
      messageHandlersRef.current = {
        ...messageHandlersRef.current,
        [topic]: {
          ...messageHandlersRef.current[topic],
          [handlerId]: handler,
        },
      };

      return () => {
        messageHandlersRef.current = {
          ...messageHandlersRef.current,
          [topic]: omit(messageHandlersRef.current[topic], handlerId),
        };
      };
    },
    [subcribedTopics]
  );

  const contextValue = useMemo(
    (): MqttContextValue => ({ mqttClient, isConnecting, registerTopic }),
    [isConnecting, mqttClient, registerTopic]
  );

  useEffect(() => {
    const client = mqtt.connect(BROKER_URI, {
      clientId: 'khoadtran',
      username: AIO_USERNAME,
      password: AIO_KEY,
      clean: false,
    });
    client.on('connect', () => {
      setIsConnecting(false);
    });

    client.on('disconnect', () => {
      setMqttClient(null);
    });

    client.on('message', (topic, message) => {
      const payload: MqttMessagePayload = { topic, data: message.toString() };
      const handlers = Object.values(messageHandlersRef.current[topic] ?? {});

      handlers.forEach((handler) => handler(payload));
    });

    setMqttClient(client);
    setIsConnecting(true);

    return () => {
      client.end();
    };
  }, []);

  useEffect(() => {
    if (!mqttClient || isConnecting) {
      return;
    }

    mqttClient.subscribe(Array.from(subcribedTopics));
  }, [isConnecting, mqttClient, subcribedTopics]);

  if (isConnecting) {
    return <Loader transparent className="fixed h-[100dvh] top-0 left-0" />;
  }

  return (
    <MqttConext.Provider value={contextValue}>{children}</MqttConext.Provider>
  );
};

export default MqttProvider;
