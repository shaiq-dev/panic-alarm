const { createContext, useContext, useReducer } = require('react');

const StateContext = createContext({
	authenticated: false,
	user: null,
});

const DispatchContext = createContext(null);

const reducer = (state, { type, payload }) => {
	switch (type) {
		case 'LOGIN':
			return {
				...state,
				authenticated: true,
				user: payload,
			};

		case 'LOGOUT':
			return {
				...state,
				authenticated: false,
				user: null,
			};

		default:
			throw new Error('Something Went Wrong, __Unknown__ACTION__TYPE');
	}
};

export const AuthProvider = ({ children, user, authenticated }) => {
	const [state, dispatch] = useReducer(reducer, {
		user,
		authenticated,
	});

	return (
		<DispatchContext.Provider value={dispatch}>
			<StateContext.Provider value={state}>{children}</StateContext.Provider>
		</DispatchContext.Provider>
	);
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
