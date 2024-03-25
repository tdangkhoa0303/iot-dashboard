import clsx from 'clsx';
import { ClimbingBoxLoader } from 'react-spinners';

function Loader({
  transparent = false,
  className,
}: {
  transparent?: boolean;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'flex justify-center items-center w-full h-full bg-white dark:bg-navy-700 z-10',
        className,
        {
          'bg-opacity-70': transparent,
        }
      )}
    >
      <ClimbingBoxLoader color="#8171FC" />
    </div>
  );
}

export default Loader;
