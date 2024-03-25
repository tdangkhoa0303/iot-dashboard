import { MqttMessageHandler, useMqttContext } from 'providers/mqtt-provider';
import { useCallback, useEffect } from 'react';

interface SubcribeMqttTopicProps {
  topic: string;
  handler: MqttMessageHandler;
}

export const useSubcribeMqttTopic = ({
  topic,
  handler,
}: SubcribeMqttTopicProps) => {
  const { mqttClient, registerTopic } = useMqttContext();

  useEffect(() => {
    const unsubcribe = registerTopic(topic, handler);

    return () => {
      unsubcribe();
    };
  }, [handler, registerTopic, topic]);

  const publishTopicData = useCallback(
    (payload: string) => {
      if (mqttClient) {
        mqttClient.publish(
          topic,
          payload,
          { qos: 0, retain: true },
          (error) => {
            if (error) {
              console.log('Publish error: ', error);
            }
          }
        );
      }
    },
    [mqttClient, topic]
  );

  return { publishTopicData };
};
