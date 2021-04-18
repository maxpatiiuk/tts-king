import React from 'react';
import type { StatusLineStatus } from '../lib/statusLineConfig';
import { DEFAULT_STATUS_LINE_TIMEOUT } from '../lib/statusLineConfig';

export function StatusLine({
  statusStackPusher,
  durationOfVisibility = DEFAULT_STATUS_LINE_TIMEOUT,
}: {
  readonly statusStackPusher: (
    addStatusCallback: (status: Readonly<StatusLineStatus>) => void
  ) => void;
  readonly durationOfVisibility?: number;
}): JSX.Element {
  const [configuration, setConfiguration] = React.useState<
    StatusLineStatus | undefined
  >(undefined);

  const updateStack = React.useRef<StatusLineStatus[]>([]);
  const timeOutId = React.useRef<undefined | ReturnType<typeof setTimeout>>(
    undefined
  );

  function updateStatus(): void {
    timeOutId.current =
      updateStack.current.length > 0
        ? setTimeout(() => {
            updateStack.current.shift();
            updateStatus();
          }, durationOfVisibility)
        : undefined;
    setConfiguration(updateStack.current[0]);
  }

  React.useEffect(() => {
    statusStackPusher((status: Readonly<StatusLineStatus>): void => {
      if (
        status.id !== '' &&
        updateStack.current.some(
          ({ id }: { readonly id: string }) => id === status.id
        )
      )
        return;
      updateStack.current.push(status);
      if (typeof timeOutId.current === 'undefined') updateStatus();
    });
  }, []);

  return (
    <div
      className={`absolute inset-0 w-screen h-screen pointer-events-none
        overflow-hidden`}
    >
      <div
        className={`transform absolute bottom-0 left-0 transition-transform
        transition-none duration-100 w-screen p-5 pointer-events-auto
        text-xl${
          typeof configuration === 'undefined'
            ? 'translate-y-0'
            : 'translate-y-full'
        }`}
      >
        {configuration?.message ?? ''}
      </div>
    </div>
  );
}
