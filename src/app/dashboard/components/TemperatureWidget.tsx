import { useQuery } from '@tanstack/react-query';
import Card from 'components/card';
import Loader from 'components/loader';
import { AIO_FEED_IDS, AIO_KEY } from 'constants/aio';
import { TEMPERATURE_THRESHOLD } from 'constants/biz';
import { useSubcribeMqttTopic } from 'hooks';
import { useDarkMode } from 'providers/dark-mode-provider';
import queryString from 'query-string';
import { useState } from 'react';
import GaugeComponent from 'react-gauge-component';
import AIButton from './AIButton';

const TemperatureWidget = () => {
  const { isDarkMode } = useDarkMode();

  useSubcribeMqttTopic({
    topic: AIO_FEED_IDS.TEMPERATURE_SENSOR,
    handler: ({ data }) => setValue(Number(data)),
  });

  const { data, isFetching } = useQuery({
    queryKey: ['lastTemperature'],
    queryFn: () =>
      fetch(
        queryString.stringifyUrl({
          url: `https://io.adafruit.com/api/v2/${AIO_FEED_IDS.TEMPERATURE_SENSOR}/data/last`,
          query: {
            include: 'value',
          },
        }),
        {
          method: 'GET',
          headers: {
            'X-AIO-Key': AIO_KEY,
          },
        }
      )
        .then((res) => res.json())
        .then(({ value }: { value: string }) => Number(value)),
  });

  const [value, setValue] = useState(data);

  return (
    <Card extra="p-4">
      <div className="flex justify-between items-center">
        <p className="text-xl font-bold text-navy-700 dark:text-white">
          Temperature
        </p>
        <AIButton />
      </div>
      {isFetching && <Loader transparent className="absolute top-0 left-0" />}
      <GaugeComponent
        key={`${isDarkMode}`}
        type="radial"
        arc={{
          width: 0.15,
          padding: 0.02,
          cornerRadius: 16,
          colorArray: ['#F5CD19', '#5BE12C', '#EA4228'],
          subArcs: [
            {
              limit: TEMPERATURE_THRESHOLD.MIN,
              showTick: true,
              tooltip: {
                text: 'Low temperature!',
                style: {
                  border: 'none',
                  borderRadius: '8px',
                  textShadow: 'none',
                  padding: '4px 8px',
                },
              },
            },
            {
              showTick: true,
              tooltip: {
                text: 'Looks good!',
                style: {
                  border: 'none',
                  borderRadius: '8px',
                  textShadow: 'none',
                  padding: '4px 8px',
                },
              },
            },
            {
              limit: TEMPERATURE_THRESHOLD.MAX,
              showTick: true,
              tooltip: {
                text: 'High temperature',
                style: {
                  border: 'none',
                  borderRadius: '8px',
                  textShadow: 'none',
                  padding: '4px 8px',
                },
              },
            },
          ],
        }}
        pointer={{
          color: '#345243',
          length: 0.8,
          width: 15,
          elastic: true,
          type: 'blob',
        }}
        labels={{
          valueLabel: {
            formatTextValue: (value) => value + 'ºC',
            style: {
              fontSize: 60,
              fill: isDarkMode ? '#ffffff' : '#333333',
              textShadow: 'none',
              transform: 'translateY(-25%)',
            },
          },
          tickLabels: {
            type: 'outer',

            defaultTickValueConfig: {
              formatTextValue: (value) => value + 'ºC',
              style: {
                fontWeight: 600,
                fontSize: 10,
              },
            },
          },
        }}
        value={value}
        minValue={0}
        maxValue={100}
      />
    </Card>
  );
};

export default TemperatureWidget;
