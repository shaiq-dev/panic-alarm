import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
	validateUserRegisterInput,
	validateUserLoginInput,
} from '@/server/Utils/validators';
import { UserInputError } from 'apollo-server-errors';
import { LogoutOutlined } from '@ant-design/icons';

const generateAuthToken = (user) => {
	const _secret = process.env.SECRET;

	return jwt.sign(
		{
			id: user.id,
			email: user.email,
			username: user.username,
			name: user.name,
			id: user._id,
		},
		_secret,
		{ expiresIn: '5h' }
	);
};

const userResolver = {
	Mutation: {
		async registerUser(
			_,
			{ registerInput: { name, username, email, password } },
			context,
			info
		) {
			// Validate User Input
			const { valid, errors } = validateUserRegisterInput(
				name,
				username,
				password,
				email
			);
			if (!valid) {
				throw new UserInputError('Invalid Data', {
					errors,
				});
			}

			const user = await context.db
				.collection('Users')
				.findOne({ username }, { $exists: true })
				.then((resp) => resp);

			if (user) {
				throw new UserInputError('User Exists', {
					errors: {
						username: 'This username is taken',
					},
				});
			}

			password = await bcrypt.hash(password, 12);

			const res = await context.db
				.collection('Users')
				.insertOne({ name, username, email, password, alerts: [] })
				.then(({ ops }) => ops[0]);

			const token = generateAuthToken(res);

			return {
				...res,
				id: res._id,
				token,
			};
		},

		async loginUser(_, { loginInput: { username, password } }, context, info) {
			// Validate User Input
			const { valid, errors } = validateUserLoginInput(username, password);
			if (!valid) {
				throw new UserInputError('Invalid Data', {
					errors,
				});
			}

			const user = await context.db
				.collection('Users')
				.findOne({ username }, { $exists: true })
				.then((resp) => resp);

			if (!user) {
				throw new UserInputError("User doesn't exist", {
					errors: {
						general: 'Username not found',
					},
				});
			}

			const passwordMatch = await bcrypt.compare(password, user.password);

			if (!passwordMatch) {
				throw new UserInputError('Invalid data', {
					errors: {
						general: 'Invalid Credentials',
					},
				});
			}

			const token = generateAuthToken(user);

			context.cookies.set('authToken', token, {
				httpOnly: true,
				maxAge: 12 * 60 * 60 * 1000,
				// secure: process.env.NODE_ENV === 'production',
				secure: false,
				path: '/',
			});

			return {
				...user,
				id: user._id,
				token,
			};
		},

		async logoutUser(_, args, context, info) {
			context.cookies.set('authToken', {
				maxAge: 0,
			});

			return 'LOGOUT SUCCESS';
		},
	},
};

export default userResolver;
