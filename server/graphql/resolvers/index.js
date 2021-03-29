import userResolver from './user';

const resolvers = {
	Query: {
		...userResolver.Query,
	},

	Mutation: {
		...userResolver.Mutation,
	},
};

export default resolvers;
