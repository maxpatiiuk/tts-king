import React from 'react';
import Modal from 'react-modal';
import css from 'styled-jsx/css';

export function ModalDialog({
  isOpen = true,
  title,
  buttons,
  children,
  onCloseClick: handleCloseClick,
}: {
  readonly isOpen?: boolean;
  readonly title: string;
  readonly buttons?: React.ReactNode;
  readonly children: React.ReactNode;
  readonly onCloseClick?: () => void;
}): JSX.Element {
  const { className } = css.resolve``;

  Modal.setAppElement('#__next');

  return (
    <div className="modal-root">
      <Modal
        isOpen={isOpen}
        closeTimeoutMS={100}
        contentLabel={title}
        portalClassName={`${className}`}
        overlayClassName={
          'w-screen h-screen absolute inset-0 flex items-center opacity-0 ' +
          'justify-center bg-shadow transition-opacity'
        }
        className={'w-full outline-none'}
        shouldCloseOnEsc={typeof handleCloseClick === 'function'}
      >
        <div className="bg-white shadow-xl w-auto w-1/2 m-auto">
          <div
            className={`bg-gray-50 p-4 flex justify-between
          items-center`}
          >
            <h3 className="text-lg text-gray-900">{title}</h3>
            {handleCloseClick && (
              <div
                className={`flex items-center justify-center
                rounded-full bg-red-100 sm:h-10 sm:w-10
                cursor-pointer`}
                onClick={handleCloseClick}
              >
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            )}
          </div>
          <div className="p-4 text-sm text-gray-500">{children}</div>
          <div className="bg-gray-50 flex justify-end p-4 gap-x-2">
            {buttons}
          </div>
        </div>
      </Modal>
      <style jsx global>{`
        .${className} > :global(.ReactModal__Overlay--after-open) {
          opacity: 1 !important;
        }

        .${className} > :global(.ReactModal__Overlay--before-close) {
          opacity: 0 !important;
        }
      `}</style>
    </div>
  );
}

export function Loading(): JSX.Element {
  return (
    <ModalDialog title="Loading...">
      {/* TODO: add a fancy loading bar here */}
      Loading...
    </ModalDialog>
  );
}
