import Card from 'components/card';
import Checkbox from 'components/checkbox';

import { useQuery } from '@tanstack/react-query';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Loader from 'components/loader';
import { AIO_KEY, AIO_USERNAME } from 'constants/aio';
import { TbReload } from 'react-icons/tb';
import clsx from 'clsx';
import queryString from 'query-string';
import { subDays } from 'date-fns';

type Activity = {
  id: number;
  action: string;
  model: string;
  data: number;
  user_id: string;
  created_at: string;
  updated_at: string;
};

const columnHelper = createColumnHelper<Activity>();

function ActivitiesTable() {
  const columns = [
    columnHelper.accessor('action', {
      id: 'action',
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          ACTION
        </p>
      ),
      cell: (info) => (
        <div className="flex items-center">
          <Checkbox
            defaultChecked={info.getValue()[1]}
            colorScheme="brandScheme"
            me="10px"
          />
          <p className="ml-3 text-sm font-bold text-navy-700 dark:text-white">
            {info.getValue()[0]}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor('model', {
      id: 'progress',
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          PROGRESS
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor('data', {
      id: 'quantity',
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          QUANTITY
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor('updated_at', {
      id: 'date',
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">DATE</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
  ]; // eslint-disable-next-line

  const {
    data = [],
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['activities'],
    queryFn: () =>
      fetch(
        queryString.stringifyUrl({
          url: `https://io.adafruit.com/api/v2/${AIO_USERNAME}/activities`,
          query: {
            limit: 5,
            start_time: subDays(new Date(), 7).toUTCString(),
          },
        }),
        {
          method: 'GET',
          headers: {
            'X-AIO-Key': AIO_KEY,
          },
        }
      ).then((res) => res.json() as unknown as Activity[]),
  });

  const table = useReactTable<Activity>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  return (
    <Card extra={'w-full h-full sm:overflow-auto px-6'}>
      <header className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Recent Activities
        </div>
        <button
          onClick={() => refetch()}
          className={`flex items-center text-xl hover:cursor-pointer ${'bg-lightPrimary p-2 text-brand-500 hover:bg-gray-100 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10'} linear justify-center rounded-lg font-bold transition duration-200`}
        >
          <TbReload
            className={clsx('h-5 w-5', {
              'animate-spin': isFetching,
            })}
          />
        </button>
      </header>

      <div className="mt-4 overflow-x-scroll xl:overflow-x-hidden relative">
        {isFetching && <Loader transparent className="absolute top-0 left-0" />}
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="!border-px !border-gray-400">
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"
                    >
                      <div className="items-center justify-between text-xs text-gray-200">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: '',
                          desc: '',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table
              .getRowModel()
              .rows.slice(0, 5)
              .map((row) => {
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td
                          key={cell.id}
                          className="min-w-[150px] border-white/0 py-3  pr-4"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default ActivitiesTable;
