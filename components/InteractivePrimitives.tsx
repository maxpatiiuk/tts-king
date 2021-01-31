import React from 'react';

const baseButtonStyle = 'inline-flex px-4 py-2 rounded-md sm:text-sm sm:w-auto text-gray-700';

export const ButtonSecondary = ({
	children,
	props={},
	extraStyles=''
}:{
	children: React.ReactNode,
	props?: Record<string,unknown>
	extraStyles?: string,
}) =>
	<button
		type="button"
		className={`bg-white hover:bg-grey-700 border ${baseButtonStyle} ${extraStyles}`}
		{...props}
	>
		{children}
	</button>;

export const ButtonDanger = ({
	children,
	props={},
	extraStyles=''
}:{
	children: React.ReactNode,
	props?: Record<string,unknown>
	extraStyles?: string,
}) =>
	<button
		type="button"
		className={`bg-red-600 hover:bg-red-700 ${baseButtonStyle} ${extraStyles}`}
		{...props}
	>
		{children}
	</button>;
