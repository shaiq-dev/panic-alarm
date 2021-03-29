import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
	type User {
		id: ID!
		firstName: String!
		lastName: String!
		blog: String
		stars: Int
	}

	type Query {
		users: [User]!
	}
`;
