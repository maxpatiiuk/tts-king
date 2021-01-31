export const fetcher = (input:Request|string, init?: RequestInit | undefined) =>
	fetch(input, init).then(res => res.json());
