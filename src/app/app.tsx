import Admin from 'layouts/admin';
import Dashboard from './dashboard';
import MqttProvider from 'providers/mqtt-provider';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { requestNotificationPermission } from './notification';
import { NOTIFICATION_PERMISSION_LOCAL_STORAGE_KEY } from 'constants/biz';

const intervalMS = 60 * 60 * 1000;

export function App() {
  useRegisterSW({
    onRegistered(registeration) {
      if (!registeration) {
        return;
      }

      setInterval(() => {
        registeration.update();
      }, intervalMS);

      if (
        localStorage.getItem(NOTIFICATION_PERMISSION_LOCAL_STORAGE_KEY) ==
        undefined
      )
        requestNotificationPermission(registeration);
    },
  });

  return (
    <MqttProvider>
      <Admin>
        <Dashboard />
      </Admin>
    </MqttProvider>
  );
}

export default App;
