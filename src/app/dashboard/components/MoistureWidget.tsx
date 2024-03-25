import { useQuery } from '@tanstack/react-query';
import Card from 'components/card';
import Loader from 'components/loader';
import { AIO_FEED_IDS, AIO_KEY } from 'constants/aio';
import { MOISTURE_THRESHOLD } from 'constants/biz';
import { useSubcribeMqttTopic } from 'hooks';
import { useDarkMode } from 'providers/dark-mode-provider';
import queryString from 'query-string';
import { useState } from 'react';
import GaugeComponent from 'react-gauge-component';

const MoistureWidget = () => {
  const { isDarkMode } = useDarkMode();

  useSubcribeMqttTopic({
    topic: AIO_FEED_IDS.MOISTURE_SENSOR,
    handler: ({ data }) => setValue(Number(data)),
  });

  const { data, isFetching } = useQuery({
    queryKey: ['lastHumidity'],
    queryFn: () =>
      fetch(
        queryString.stringifyUrl({
          url: `https://io.adafruit.com/api/v2/${AIO_FEED_IDS.MOISTURE_SENSOR}/data/last`,
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
      <div className="text-xl font-bold text-navy-700 dark:text-white">
        Humidity
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
              limit: MOISTURE_THRESHOLD.MIN,
              showTick: true,
              tooltip: {
                text: 'Low moisture!',
                style: {
                  border: 'none',
                  borderRadius: '8px',
                  textShadow: 'none',
                  padding: '4px 8px',
                },
              },
            },
            {
              limit: MOISTURE_THRESHOLD.MAX,
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
              showTick: true,
              tooltip: {
                text: 'High moisture',
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

export default MoistureWidget;
