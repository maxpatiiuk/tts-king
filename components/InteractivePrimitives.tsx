import React from 'react';

const baseButtonStyle = 'inline-flex px-4 py-2 rounded-md sm:text-sm ' +
  'justify-center text-gray-700';
export const primaryButtonClassName = `${baseButtonStyle} bg-white
  hover:bg-grey-500 border`;
export const secondaryButtonClassName = `${baseButtonStyle} bg-grey-200
  hover:bg-grey-700 border`;
export const dangerButtonClassName = `${baseButtonStyle} bg-red-600
  hover:bg-red-700`;
export const successButtonClassName = `${baseButtonStyle} bg-green-600
  hover:bg-green-700`;
export const dangerLinkClassName = `border-none p-none m-none text-red-500
  hover:underline text-left`;

export const fieldClassName = 'border p-1.5 rounded-md bg-gray-200';

export function LabeledField({
  label,
  children,
}: {
  label: string,
  children: React.ReactNode,
}) {
  return <label
    className='flex flex-col first:border-none'
  >
    <span className='text-sm pb-1'>{
      label
    }</span>
    <span className={fieldClassName}>{
      children
    }</span>
  </label>;
}