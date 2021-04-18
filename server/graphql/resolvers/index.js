import userResolver from './user';
import alertResolver from './alert';

const resolvers = {
	Query: {
		...userResolver.Query,
		...alertResolver.Query,
	},

	Mutation: {
		...userResolver.Mutation,
		...alertResolver.Mutation,
	},
};

export default resolvers;
