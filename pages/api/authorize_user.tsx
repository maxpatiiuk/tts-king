import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies'

export default function AuthorizeUser(req: NextApiRequest, res: NextApiResponse){

	const cookies = new Cookies(req,res);

	if(typeof cookies.get('accessToken') !== 'undefined')
		return res.status(409).json({
			type: 'error',
			error_message: 'User is already signed in'
		});

	if(!('accessToken' in req.body))
		return res.status(400).json({
			type: 'error',
			error_message: 'Invalid request received'
		});

	/*
	* req.body.user:
	* displayName
	* email
	* photoURL
	* */

	cookies.set('accessToken',req.body.accessToken, {
		maxAge: 30 * 86400 * 1000,
		sameSite: 'strict',
	});

	res.status(200).json((req.body));
}