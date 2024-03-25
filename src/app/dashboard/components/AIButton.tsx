import { useMutation } from '@tanstack/react-query';
import { AIO_FEED_IDS } from 'constants/aio';
import { useSubcribeMqttTopic } from 'hooks';
import { useState } from 'react';

import { PreTrainedTokenizer } from '@xenova/transformers';
import tokenizerJson from 'data/tokenizer.json';
import tokenizerConfigs from 'data/tokenizer_config.json';
import { RiOpenaiFill } from 'react-icons/ri';
import clsx from 'clsx';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
} from '@chakra-ui/popover';
import Card from 'components/card';
import { Portal } from '@chakra-ui/portal';

const tokenizer = new PreTrainedTokenizer(tokenizerJson, tokenizerConfigs);
const ASSISTANT_TOKEN = '<|assistant|>';

const AIButton = () => {
  const [content, setContent] = useState('');
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
    mutationFn: (params: { temperature: number; moisture: number }) => {
      const inputs = tokenizer.apply_chat_template(
        [
          {
            role: 'system',
            content: `As an agriculture professor, our farm is planting jasmine flowers. The farm has a fan, pump (for watering), and light with the following action codes:
                  - Turn on pump
                  - Turn off pump
                  - Turn on light
                  - Turn off light
                  - Turn on fan
                  - Turn off fan
                  Based on the provided temperature and moisture to suggest the action.`,
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

      return fetch(
        'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-alpha',
        {
          headers: {
            Authorization: 'Bearer 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',
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({ inputs }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          const generatedText =
            data[0]['generated_text']?.split(ASSISTANT_TOKEN);
          console.log(data[0]['generated_text']);
          return generatedText?.[generatedText?.length - 1] ?? '';
        });
    },
    onSuccess: (data) => setContent(data),
  });

  return (
    <Popover isOpen={!!content}>
      <PopoverTrigger>
        <button
          onClick={() => aiMutation.mutate({ temperature, moisture })}
          className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 !transition !duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10"
        >
          <RiOpenaiFill
            className={clsx('h-6 w-6', {
              'animate-spin': aiMutation.isPending,
            })}
          />
        </button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent className="max-w-[300px] md:max-w-[600px]">
          <PopoverArrow />
          <Card extra="p-6">
            <PopoverCloseButton
              size="small"
              className="absolute right-2 top-2 !w-4 !h-4"
              onClick={() => setContent('')}
            />
            <PopoverBody>{content}</PopoverBody>
          </Card>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default AIButton;
