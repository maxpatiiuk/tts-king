import React from 'react';

const baseButtonStyle = 'inline-flex px-4 py-2 rounded-md sm:text-sm' +
	' sm:w-auto text-gray-700';

interface ButtonProps {
	children: React.ReactNode,
	props?: React.ButtonHTMLAttributes<HTMLButtonElement>
	extraStyles?: string,
	baseStyles?: string,
}

function Button({
	children,
	props = {},
	baseStyles = '',
	extraStyles = '',
}:ButtonProps ){
	return <button
		type="button"
		className={`${baseStyles} ${baseButtonStyle} ${
			extraStyles}`}
		{...props}
	>
		{children}
	</button>;
}

export function ButtonPrimary({children, ...props}:ButtonProps) {
	return <Button
		baseStyles={'bg-white hover:bg-grey-500 border'}
		{...props}>
		{children}
	</Button>
}

export function ButtonSecondary({children, ...props}:ButtonProps) {
	return <Button
		baseStyles={'bg-grey-200 hover:bg-grey-700 border'}
		{...props}>
		{children}
	</Button>
}

export function ButtonDanger({children, ...props}:ButtonProps) {
	return <Button
		baseStyles={'bg-red-600 hover:bg-red-700'}
		{...props}>
		{children}
	</Button>
}

export function ButtonSuccess({children, ...props}:ButtonProps) {
	return <Button
		baseStyles={'bg-green-600 hover:bg-green-700'}
		{...props}>
		{children}
	</Button>
}

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
		<span className='border p-1.5 rounded-md mb-4 bg-gray-200'>{
			children
		}</span>
	</label>;
}

export function DangerLink({
	children,
	className='',
	props
}:{
	children: React.ReactNode
	className?: string,
	props?: React.ButtonHTMLAttributes<HTMLButtonElement>
}){
	return <button
		className={`border-none p-none m-none text-red-500
			hover:underline text-left ${className}`}
		{...props}
	>{
		children
	}</button>
}