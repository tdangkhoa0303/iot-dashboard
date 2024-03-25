import React from 'react';
import ReactApexChart from 'react-apexcharts';

type ChartProps = {
  // using `interface` is also ok
  [x: string]: any;
};

const PieChart = ({ chartData, chartOptions }: ChartProps) => (
  <ReactApexChart
    options={chartOptions}
    series={chartData}
    type="pie"
    width="100%"
    height="100%"
  />
);

export default PieChart;
