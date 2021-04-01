import { gql } from 'apollo-server-micro';

const typeDefs = gql`
	type User {
		id: ID!
		name: String!
		username: String!
		email: String!
		token: String!
	}

	input UserRegisterInput {
		name: String!
		username: String!
		email: String!
		password: String!
	}

	input UserLoginInput {
		username: String!
		password: String!
	}

	type Query {
		getUser(userId: ID!): User!
	}

	type Mutation {
		registerUser(registerInput: UserRegisterInput): User!
		loginUser(loginInput: UserLoginInput): User!
	}
`;

export default typeDefs;
