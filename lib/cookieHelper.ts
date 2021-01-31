import React        from 'react';
import cookie from 'cookie';

export function useCookie(
	key:string,
) {

	if (typeof window === 'undefined')
		throw new Error('Tried to read a cookie on the server side');

	const cookies = cookie.parse(document.cookie);

	const [value, setValue] = React.useState(cookies[key] ?? undefined);

	return [value, (value:string, options:string) => {
		document.cookie = `${key}=${value}; ${options}`;
		setValue(value);
	}];
}