import clsx from 'clsx';
import Card from 'components/card';
import Switch from 'components/switch';
import { useSubcribeMqttTopic } from 'hooks';
import { ChangeEvent, ReactElement, useState } from 'react';

interface ToggleDeviceProps {
  title: string;
  feedId: string;
  icon: ReactElement;
  activeClassName?: string;
}

export const ToggleDevice = ({
  title,
  icon,
  feedId,
  activeClassName = '',
}: ToggleDeviceProps) => {
  const [isOn, setIsOn] = useState(false);

  const { publishTopicData } = useSubcribeMqttTopic({
    topic: feedId,
    handler: ({ data }) => setIsOn(data === '1'),
  });

  return (
    <Card extra="!flex-row flex-grow items-center rounded-[20px] px-4 gap-4">
      <div className="flex h-[90px] w-auto flex-row items-center">
        <div className="rounded-full bg-lightPrimary p-3 dark:bg-navy-700">
          <span
            className={clsx(
              'flex items-center text-brand-500 dark:text-white',
              isOn && activeClassName
            )}
          >
            {icon}
          </span>
        </div>
      </div>

      <div className="h-50 flex w-auto items-center justify-between flex-grow-[1]">
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
          {title}
        </h4>
        <Switch
          checked={isOn}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const nextValue = event.target.checked;
            publishTopicData(nextValue ? '1' : '0');
          }}
        />
      </div>
    </Card>
  );
};
