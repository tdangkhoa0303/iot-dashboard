import React from 'react';
import Chart from 'react-apexcharts';

type ChartProps = {
  // using `interface` is also ok
  [x: string]: any;
};

const ColumnChart = ({ chartData, chartOptions }: ChartProps) => (
  <Chart
    options={chartOptions}
    series={chartData}
    type="bar"
    width="100%"
    height="100%"
  />
);

export default ColumnChart;
