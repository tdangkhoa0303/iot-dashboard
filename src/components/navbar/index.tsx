import { useDarkMode } from 'providers/dark-mode-provider';
import { IoReloadSharp } from 'react-icons/io5';
import { RiMoonFill, RiSunFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';

const Navbar = (props: {
  onOpenSidenav: () => void;
  brandText: string;
  secondary?: boolean | string;
}) => {
  const { brandText } = props;
  const { toggleDarkMode, isDarkMode } = useDarkMode();

  return (
    <nav className="z-40 flex flex-row flex-wrap items-center justify-between bg-white/10 p-2 dark:bg-[#0b14374d]">
      <div className="ml-[6px]">
        <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white">
          <Link
            to="/"
            className="font-bold capitalize hover:text-navy-700 dark:hover:text-white"
          >
            {brandText}
          </Link>
        </p>
      </div>

      <div className="flex gap-2">
        <div
          className="rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer text-gray-600 bg-white p-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none w-11 h-11"
          onClick={() => window.location.reload()}
        >
          <IoReloadSharp />
        </div>
        <div
          className="rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer text-gray-600 bg-white p-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none w-11 h-11"
          onClick={() => {
            if (isDarkMode) {
              document.body.classList.remove('dark');
              toggleDarkMode(false);
            } else {
              document.body.classList.add('dark');
              toggleDarkMode(true);
            }
          }}
        >
          {isDarkMode ? (
            <RiSunFill className="h-5 w-5 text-gray-600 dark:text-white" />
          ) : (
            <RiMoonFill className="h-5 w-5 text-gray-600 dark:text-white" />
          )}
        </div>
      </div>
      {/* <div className="relative mt-[3px] flex w-10 h-10 min-w-0 flex-grow items-center justify-around gap-2 md:gap-8 rounded-full bg-white px-4 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:flex-grow-0 xl:gap-2"> */}
      {/* <div className="flex h-full items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
          <p className="pl-3 pr-2 text-xl">
            <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
          </p>
          <input
            type="text"
            placeholder="Search..."
            className="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
          />
        </div> */}
      {/* <span
          className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
          onClick={onOpenSidenav}
        >
          <FiAlignJustify className="h-5 w-5" />
        </span> */}
      {/* start Notification */}
      {/* <Dropdown
          button={
            <p className="cursor-pointer">
              <IoMdNotificationsOutline className="h-4 w-4 text-gray-600 dark:text-white" />
            </p>
          }
          animation="origin-[65%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
          children={
            <div className="flex w-[360px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none sm:w-[460px]">
              <div className="flex items-center justify-between">
                <p className="text-base font-bold text-navy-700 dark:text-white">
                  Notification
                </p>
                <p className="text-sm font-bold text-navy-700 dark:text-white">
                  Mark all read
                </p>
              </div>

              <button className="flex w-full items-center">
                <div className="flex h-full w-[85px] items-center justify-center rounded-xl bg-gradient-to-b from-brandLinear to-brand-500 py-4 text-2xl text-white">
                  <BsArrowBarUp />
                </div>
                <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                  <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
                    New Update: Horizon UI Dashboard PRO
                  </p>
                  <p className="font-base text-left text-xs text-gray-900 dark:text-white">
                    A new update for your downloaded item is available!
                  </p>
                </div>
              </button>

              <button className="flex w-full items-center">
                <div className="flex h-full w-[85px] items-center justify-center rounded-xl bg-gradient-to-b from-brandLinear to-brand-500 py-4 text-2xl text-white">
                  <BsArrowBarUp />
                </div>
                <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                  <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
                    New Update: Horizon UI Dashboard PRO
                  </p>
                  <p className="font-base text-left text-xs text-gray-900 dark:text-white">
                    A new update for your downloaded item is available!
                  </p>
                </div>
              </button>
            </div>
          }
          classNames={'py-2 top-4 -left-[230px] md:-left-[440px] w-max'}
        /> */}
      {/* start Horizon PRO */}
      {/* <Dropdown
          button={
            <p className="cursor-pointer">
              <IoMdInformationCircleOutline className="h-4 w-4 text-gray-600 dark:text-white" />
            </p>
          }
          children={
            <div className="flex w-[350px] flex-col gap-2 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
              <div
                style={{
                  backgroundImage: `url(${navbarimage})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                }}
                className="mb-2 aspect-video w-full rounded-lg"
              />
              <a
                target="blank"
                href="https://horizon-ui.com/pro?ref=live-free-tailwind-react"
                className="px-full linear flex cursor-pointer items-center justify-center rounded-xl bg-brand-500 py-[11px] font-bold text-white transition duration-200 hover:bg-brand-600 hover:text-white active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:bg-brand-200"
              >
                Buy Horizon UI PRO
              </a>
              <a
                target="blank"
                href="https://horizon-ui.com/docs-tailwind/docs/react/installation?ref=live-free-tailwind-react"
                className="px-full linear flex cursor-pointer items-center justify-center rounded-xl border py-[11px] font-bold text-navy-700 transition duration-200 hover:bg-gray-200 hover:text-navy-700 dark:!border-white/10 dark:text-white dark:hover:bg-white/20 dark:hover:text-white dark:active:bg-white/10"
              >
                See Documentation
              </a>
              <a
                target="blank"
                href="https://horizon-ui.com/?ref=live-free-tailwind-react"
                className="hover:bg-black px-full linear flex cursor-pointer items-center justify-center rounded-xl py-[11px] font-bold text-navy-700 transition duration-200 hover:text-navy-700 dark:text-white dark:hover:text-white"
              >
                Try Horizon Free
              </a>
            </div>
          }
          classNames={'py-2 top-6 -left-[250px] md:-left-[330px] w-max'}
          animation="origin-[75%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
        /> */}

      {/* Profile & Dropdown */}
      {/* <Dropdown
          button={
            <img
              className="h-10 w-10 rounded-full"
              src="https://avatar.iran.liara.run/public"
              alt="Elon Musk"
            />
          }
          classNames={'py-2 top-8 -left-[180px] w-max'}
        >
          <div className="flex h-48 w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
            <div className="mt-3 ml-4">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-navy-700 dark:text-white">
                  <span role="img" aria-label="emoji">
                    👋
                  </span>{' '}
                  Hey, Adela
                </p>{' '}
              </div>
            </div>
            <div className="mt-3 h-px w-full bg-gray-200 dark:bg-white/20 " />

            <div className="mt-3 ml-4 flex flex-col">
              <a
                href=" "
                className="text-sm text-gray-800 dark:text-white hover:dark:text-white"
              >
                Profile Settings
              </a>
              <a
                href=" "
                className="mt-3 text-sm text-gray-800 dark:text-white hover:dark:text-white"
              >
                Newsletter Settings
              </a>
              <a
                href=" "
                className="mt-3 text-sm font-medium text-red-500 hover:text-red-500"
              >
                Log Out
              </a>
            </div>
          </div>
        </Dropdown> */}
      {/* </div> */}
    </nav>
  );
};

export default Navbar;
