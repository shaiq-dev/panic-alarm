import { gql } from 'apollo-server-micro';

const typeDefs = gql`
	type AlertOccurance {
		occuredAt: String!
		pulse: String
	}

	input AlertInput {
		alertId: String!
		type: String!
		associatedIp: String!
		pulse: Int!
		occuredAt: String!
	}

	type Alert {
		name: String!
		firstOccurance: String!
		type: String!
		totalOccurances: Int!
		occurances: [AlertOccurance]!
		associatedIp: String!
	}

	type User {
		id: ID!
		name: String!
		username: String!
		email: String!
		token: String!
		alerts: [Alert]
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
		getAlerts(username: String!): [Alert]
	}

	type Mutation {
		registerUser(registerInput: UserRegisterInput): User!
		loginUser(loginInput: UserLoginInput): User!
		logoutUser(lKey: String): String!
		addAlert(alertInput: AlertInput): String!
	}
`;

export default typeDefs;
