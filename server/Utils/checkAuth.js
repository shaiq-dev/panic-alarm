import { AuthenticationError } from 'apollo-server-errors';
import jwt from 'jsonwebtoken';
const _secret = process.env.SECRET;

module.exports = (context) => {
	const authHeader = context.req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split('Bearer ')[1];
		if (token) {
			try {
				const admin = jwt.verify(token, _secret);
				return admin;
			} catch (err) {
				throw new AuthenticationError('Invalid/Expired Token');
			}
		}
		throw new Error('Auth Token has invalid format');
	}
	throw new Error('Auth Header not available');
};
