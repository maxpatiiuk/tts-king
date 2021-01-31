import React from 'react';

//TODO: remove this component if not used
export const Section = ({
	title,
	children,
}:{
	title: string,
	children: React.ReactNode
}) =>
	<div className='py-4'>
		<h2 className='font-bold text-3xl'>{title}</h2>
		<span>{children}</span>
	</div>;

//TODO: remove this component if not used
export const Subsection = ({
	title,
	children,
}:{
	title: string,
	children: React.ReactNode
}) =>
	<div className='py-3'>
		<h2 className='pb-1 font-bold text-xl'>{title}</h2>
		<span>{children}</span>
	</div>;

export const Centered = ({
	children
}:{
	children: React.ReactNode
})=><div className='flex-grow flex items-center mb-10 justify-center'>
	<div className='sm:flex gap-x-5 max-w-2xl mx-5'>
		{children}
	</div>
</div>;