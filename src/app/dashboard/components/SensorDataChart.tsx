import { useQuery } from '@tanstack/react-query';
import Card from 'components/card';
import LineChart from 'components/charts/LineChart';
import Dropdown from 'components/dropdown';
import Loader from 'components/loader';
import { AIO_KEY } from 'constants/aio';
import { format } from 'date-fns';
import qs from 'query-string';
import { ComponentType, useMemo, useState } from 'react';
import { MdOutlineCalendarToday } from 'react-icons/md';

import { ApexOptions } from 'apexcharts';
import EmptyState from 'assets/img/empty_state.png';
import { useDarkMode } from 'providers/dark-mode-provider';
import { IconBaseProps } from 'react-icons';

type TimescaleOption = {
  text: string;
  value: 'hour' | 'minute';
};

const TIMESCALE_OPTIONS: TimescaleOption[] = [
  { text: 'Last day', value: 'hour' },
  {
    text: 'Last hour',
    value: 'minute',
  },
];

type ChardDataResponse = {
  feed: {
    id: number;
    key: string;
    name: string;
  };
  parameters: {
    start_time: string;
    end_time: string;
    resolution: number;
    hours: number;
    field: string;
  };
  columns: ['date', 'avg'];
  data: Array<[string, string]>;
};

const SensorDataChart = ({
  Icon,
  title,
  feedKey,
}: {
  title: string;
  feedKey: string;
  Icon: ComponentType<IconBaseProps>;
}) => {
  const { isDarkMode } = useDarkMode();
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [timescale, setTimescale] = useState<TimescaleOption>(
    TIMESCALE_OPTIONS[0]
  );

  const { data } = useQuery({
    queryKey: ['temperature', feedKey, timescale.value],
    refetchInterval: 10000,
    placeholderData: (previousData) => previousData,
    queryFn: () => {
      setLastUpdated(new Date());
      return fetch(
        qs.stringifyUrl({
          url: `https://io.adafruit.com/api/v2/${feedKey}/data/chart`,
          query: {
            hours: timescale.value === 'hour' ? 24 : 3,
            resolution: timescale.value === 'hour' ? 10 : 1,
          },
        }),
        {
          method: 'GET',
          headers: {
            'X-AIO-Key': AIO_KEY,
          },
        }
      ).then((res) => res.json() as unknown as ChardDataResponse);
    },
  });

  const chartData = useMemo(
    () => [
      {
        name: title,
        data: data?.data?.map?.((record) => record[1]) ?? [],
        color: '#4318FF',
      },
    ],
    [data?.data, title]
  );

  const yValues = useMemo(
    () => data?.data?.map?.((record): number => Number(record[1])) ?? [],
    [data]
  );

  const chartOptions = useMemo(
    (): ApexOptions => ({
      legend: {
        position: 'top',
        horizontalAlign: 'left',
      },

      theme: {
        mode: isDarkMode ? 'dark' : 'light',
      },
      chart: {
        type: 'line',
        background: 'transparent',

        toolbar: {
          show: false,
        },
        dropShadow: {
          enabled: true,
          enabledOnSeries: [0],
          top: -2,
          left: 2,
          blur: 5,
          opacity: 0.06,
        },
      },

      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },

      tooltip: {
        style: {
          fontSize: '12px',
          fontFamily: undefined,
        },
        theme: 'dark',
        x: {
          format: 'dd/MM/yy HH:mm',
        },
      },
      grid: {
        borderColor: isDarkMode ? '#d2d2d210' : '#d2d2d240',
        show: true,
        yaxis: {
          lines: {},
        },
      },
      xaxis: {
        type: 'datetime',
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            colors: '#A3AED0',
            fontSize: '12px',
            fontWeight: '500',
          },
        },
        range: undefined,
        categories:
          data?.data?.map?.((record) => new Date(record[0]).getTime()) ?? [],
      },

      yaxis: {
        show: true,
        min: Math.floor(Math.min(...yValues) - 1),
        max: Math.ceil(Math.max(...yValues) + 1),
        stepSize: 4,
        labels: {
          formatter: (value) => value.toFixed(2),
        },
      },
    }),
    [data, isDarkMode, yValues]
  );

  return (
    <Card extra="!p-[20px] text-center relative">
      {/* {isFetching && <Loader transparent className="absolute top-0 left-0" />} */}
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <button className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 !transition !duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10">
            <Icon className="h-6 w-6" />
          </button>
          <div className="flex flex-col justify-start items-start">
            <h2 className="text-lg font-bold text-navy-700 dark:text-white">
              {title}
            </h2>
            <div className="text-xs text-gray-700 dark:text-white text-left">
              Last updated at {format(lastUpdated, 'dd MMMM HH:mm:ss')}
            </div>
          </div>
        </div>
        <Dropdown
          button={
            <div className="min-w-[120px] w-full linear mt-1 flex items-center justify-center gap-2 rounded-lg bg-lightPrimary p-2 text-gray-600 transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:hover:opacity-90 dark:active:opacity-80">
              <MdOutlineCalendarToday />
              <span className="text-sm font-medium text-gray-600">
                {timescale.text}
              </span>
            </div>
          }
        >
          {(dismiss) => (
            <div className="p-2">
              {TIMESCALE_OPTIONS.filter(
                (option) => option.value !== timescale.value
              ).map((option) => (
                <div
                  key={option.value}
                  className="p-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-navy-600 font-medium"
                  onClick={() => {
                    dismiss();
                    setTimescale(option);
                  }}
                >
                  {option.text}
                </div>
              ))}
            </div>
          )}
        </Dropdown>
      </div>

      <div className="flex h-full w-full flex-row justify-between sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden min-h-[400px]">
        <div className="h-full w-full ">
          <LineChart chartOptions={chartOptions} chartData={chartData} />
        </div>
      </div>
    </Card>
  );
};

export default SensorDataChart;
