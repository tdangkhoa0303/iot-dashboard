import React from 'react';
import ReactApexChart from 'react-apexcharts';

type ChartProps = {
  // using `interface` is also ok
  [x: string]: any;
};

const LineChart = ({ chartData, chartOptions }: ChartProps) => (
  <ReactApexChart
    options={chartOptions}
    series={chartData}
    type="area"
    width="100%"
    height="100%"
  />
);

export default LineChart;
