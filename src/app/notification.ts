import { NOTIFICATION_PERMISSION_LOCAL_STORAGE_KEY } from 'constants/biz';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const CustomSwal = withReactContent(Swal);

const requestPermission = async () => {
  if (!('Notification' in window)) {
    // Check if the browser supports notifications
    console.info('This browser does not support desktop notification');
  } else if (Notification.permission === 'granted') {
    return;
  } else if (Notification.permission !== 'denied') {
    await CustomSwal.fire({
      title: 'Notifcation',
      text: 'Enable notifcation to recieve alert from your devices!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Allow',
      cancelButtonText: 'Deny',
      reverseButtons: true,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        Notification.requestPermission().then((permission) => {
          // If the user accepts, let's create a notification
          localStorage.setItem(
            NOTIFICATION_PERMISSION_LOCAL_STORAGE_KEY,
            `${permission === 'granted'}`
          );
        });
      }
    });
  }
};

export const requestNotificationPermission = async (
  serviceWorkerRegistration: ServiceWorkerRegistration
) => {
  if (serviceWorkerRegistration.active) {
    await requestPermission();
  } else if (serviceWorkerRegistration.installing) {
    serviceWorkerRegistration.installing.addEventListener(
      'statechange',
      async (event) => {
        const serviceWorker = event.target as ServiceWorker;
        if (serviceWorker?.state === 'activated') {
          await requestPermission();
        }
      }
    );
  }

  return true;
};
