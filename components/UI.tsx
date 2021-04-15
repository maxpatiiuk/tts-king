import React from 'react';

// TODO: remove this component if not used
export const Section = ({
  title,
  children,
}: {
  readonly title: string;
  readonly children: React.ReactNode;
}): JSX.Element => (
  <div className="py-4">
    <h2 className="font-bold text-3xl">{title}</h2>
    <span>{children}</span>
  </div>
);

// TODO: remove this component if not used
export const Subsection = ({
  title,
  children,
}: {
  readonly title: string;
  readonly children: React.ReactNode;
}): JSX.Element => (
  <div className="py-3">
    <h2 className="pb-1 font-bold text-xl">{title}</h2>
    <span>{children}</span>
  </div>
);

export const Centered = ({
  children,
}: {
  readonly children: React.ReactNode;
}): JSX.Element => (
  <main className="flex-grow flex items-center mb-10 justify-center">
    <div className="sm:flex gap-x-5 max-w-2xl mx-5">{children}</div>
  </main>
);

export const unpaddedContentClassName = 'container mx-auto max-w-screen-lg';
export const contentClassName = `${unpaddedContentClassName} mb-10 p-4`;
