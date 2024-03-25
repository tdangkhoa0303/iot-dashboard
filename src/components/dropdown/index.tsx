import {
  FloatingFocusManager,
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from '@floating-ui/react';
import React from 'react';

const Dropdown = (props: {
  button: JSX.Element;
  children: ((dismiss: () => void) => JSX.Element) | JSX.Element;
  classNames?: string;
  animation?: string;
}) => {
  const { button, children } = props;
  const wrapperRef = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const { refs, floatingStyles, context } = useFloating<HTMLElement>({
    placement: 'bottom-start',
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({ padding: 10 }),
      size({
        apply({ rects, elements, availableHeight }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${availableHeight}px`,
            minWidth: `${rects.reference.width}px`,
          });
        },
        padding: 10,
      }),
    ],
  });

  const click = useClick(context, { event: 'mousedown' });
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    dismiss,
    click,
  ]);

  return (
    <div ref={wrapperRef} className="relative flex">
      <div
        className="flex cursor-pointer"
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        {button}
      </div>
      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              style={{
                ...floatingStyles,
                overflowY: 'auto',
                background: '#eee',
                minWidth: 100,
                borderRadius: 8,
                outline: 0,
                zIndex: 100,
              }}
              className="flex flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none"
              {...getFloatingProps()}
            >
              {typeof children === 'function'
                ? children(() => setIsOpen(false))
                : children}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </div>
  );
};

export default Dropdown;
