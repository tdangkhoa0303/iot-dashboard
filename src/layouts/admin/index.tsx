import React, { ReactNode } from 'react';
import Navbar from 'components/navbar';
import Sidebar from 'components/sidebar';
import Footer from 'components/footer/Footer';

export default function Admin({ children }: { children: ReactNode }) {
  const [open, setOpen] = React.useState(true);
  const [currentRoute, setCurrentRoute] = React.useState('IoT Dashboard');

  React.useEffect(() => {
    window.addEventListener('resize', () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
    );
  }, []);

  const getActiveRoute = (): string | boolean => {
    // const activeRoute = 'Main Dashboard';
    // for (let i = 0; i < routes.length; i++) {
    //   if (
    //     window.location.href.indexOf(
    //       routes[i].layout + '/' + routes[i].path
    //     ) !== -1
    //   ) {
    //     setCurrentRoute(routes[i].name);
    //   }
    // }
    // return activeRoute;
    return false;
  };
  const getActiveNavbar = (): string | boolean => {
    // const activeNavbar = false;
    // for (let i = 0; i < routes.length; i++) {
    //   if (
    //     window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
    //   ) {
    //     return routes[i].secondary;
    //   }
    // }
    // return activeNavbar;
    return false;
  };

  document.documentElement.dir = 'ltr';

  return (
    <div className="flex h-full w-full">
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        <main
          className={`h-full flex-none transition-all md:pr-2 min-h-[100dvh]`}
        >
          <div className="h-full">
            <Navbar
              onOpenSidenav={() => setOpen(true)}
              brandText={currentRoute}
              secondary={getActiveNavbar()}
            />
            <div className="pt-5s mx-auto mb-auto h-full  p-4 md:pr-2">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
