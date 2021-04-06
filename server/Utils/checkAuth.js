import { AuthenticationError } from 'apollo-server-errors';
import jwt from 'jsonwebtoken';
const _secret = process.env.SECRET;

const checkAuth = (token) => {
	if (token) {
		try {
			const user = jwt.verify(token, _secret);
			return user;
		} catch (err) {
			throw new AuthenticationError('Invalid/Expired Token');
		}
	}
	throw new Error('Auth Token has invalid format');
};

export default checkAuth;
