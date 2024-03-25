import { ToggleDevice } from 'components/iot';
import { AIO_FEED_IDS } from 'constants/aio';
import { FaFan, FaSun } from 'react-icons/fa';
import { IoWater } from 'react-icons/io5';
import { TbTemperature } from 'react-icons/tb';
import { WiHumidity } from 'react-icons/wi';
import SensorDataChart from './components/SensorDataChart';
import TemperatureWidget from './components/TemperatureWidget';
import MoistureWidget from './components/MoistureWidget';

const Dashboard = () => {
  return (
    <div>
      {/* <AIButton /> */}
      <div className="mt-3 grid gap-5 grid-cols-1 md:grid-cols-3">
        <TemperatureWidget />
        <MoistureWidget />
        <div className="flex flex-col gap-4 md:gap-6">
          <ToggleDevice
            title="Pump"
            icon={<IoWater />}
            feedId={AIO_FEED_IDS.PUMP}
            activeClassName="animate-pulse"
          />
          <ToggleDevice
            title="Fan"
            icon={<FaFan />}
            feedId={AIO_FEED_IDS.FAN}
            activeClassName="animate-spin"
          />
          <ToggleDevice
            title="Light"
            icon={<FaSun />}
            feedId={AIO_FEED_IDS.LIGHT}
            activeClassName="animate-spin"
          />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <SensorDataChart
          title="Temperature"
          Icon={TbTemperature}
          feedKey={AIO_FEED_IDS.TEMPERATURE_SENSOR}
        />
        <SensorDataChart
          title="Moisture"
          Icon={WiHumidity}
          feedKey={AIO_FEED_IDS.MOISTURE_SENSOR}
        />
      </div>
      {/* <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <ActivitiesTable />

        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <DailyTraffic />
          <PieChartCard />
        </div>

        <ComplexTable tableData={tableDataComplex} />

        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <TaskCard />
          <div className="grid grid-cols-1 rounded-[20px]">
            <MiniCalendar />
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;
