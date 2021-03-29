import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateAuthToken = (user) => {
	const _secret = process.env.SECRET;

	return jwt.sign(
		{
			id: user.id,
			email: user.email,
			username: user.email,
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
			//TODO : Validate Input
			//TODO : Check if user Exists

			password = await bcrypt.hash(password, 12);

			const res = await context.db
				.collection('Users')
				.insertOne({ name, username, email, password })
				.then(({ ops }) => ops[0]);

			const token = generateAuthToken(res);

			return {
				...res,
				id: res._id,
				token,
			};
		},
	},
};

export default userResolver;
