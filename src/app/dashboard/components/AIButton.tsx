import { useMutation } from '@tanstack/react-query';
import { AIO_FEED_IDS } from 'constants/aio';
import { useSubcribeMqttTopic } from 'hooks';
import { useState } from 'react';

import { AutoTokenizer } from '@xenova/transformers';

const AIButton = () => {
  const [temperature, setTemperature] = useState(0);
  const [moisture, setMoisture] = useState(0);

  useSubcribeMqttTopic({
    topic: AIO_FEED_IDS.TEMPERATURE_SENSOR,
    handler: ({ data }) => setTemperature(Number(data) || 0),
  });

  useSubcribeMqttTopic({
    topic: AIO_FEED_IDS.MOISTURE_SENSOR,
    handler: ({ data }) => setMoisture(Number(data) || 0),
  });

  const aiMutation = useMutation({
    mutationFn: (params: { temperature: number; moisture: number }) =>
      AutoTokenizer.from_pretrained('HuggingFaceH4/zephyr-7b-alpha')
        .then((tokenizer) => {
          console.log(tokenizer);
          return tokenizer.apply_chat_template(
            [
              {
                role: 'system',
                content: `As an agriculture professor, our farm is planting jasmine flowers. The farm has a fan, pump (for watering), and light with the following action codes:
                  - Turn on pump: pump-01
                  - Turn off pump: pump-00
                  - Turn on light: light-01
                  - Turn off light: light-00
                  - Turn on fan: fan-01
                  - Turn off fan: fan-00
                  Based on the provided temperature and moisture to suggest the action. The response must follow this pattern:
                  [explain]
                  [action_code_1, action_code_2]
                  
                  If there is no action to add, return empty [] without any explanation.`,
              },
              {
                role: 'user',
                content: `The temperature is ${params.temperature} celsius degree and moisture is ${params.moisture}%`,
              },
            ],
            {
              tokenize: false,
              add_generation_prompt: true,
            }
          );
        })
        .catch((err) => console.error(err))
        .then((inputs) => {
          console.log(inputs);
          return inputs;
        })
        .then((inputs) =>
          fetch(
            'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-alpha',
            {
              headers: {
                Authorization: 'Bearer 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',
              },
              method: 'POST',
              body: JSON.stringify({ inputs }),
            }
          )
        ),
    onSuccess: (data) => console.log(data),
  });

  return (
    <button onClick={() => aiMutation.mutate({ temperature, moisture })}>
      AI
    </button>
  );
};

export default AIButton;
