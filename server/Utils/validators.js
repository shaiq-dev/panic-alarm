module.exports.validateUserRegisterInput = (
	name,
	username,
	password,
	email
) => {
	const errors = {};
	const data = {
		Name: name,
		Username: username,
		Password: password,
		Email: email,
	};

	Object.keys(data).map((key, _) => {
		if ('' === data[key].trim()) {
			errors[key.toLowerCase()] = `${key} must not be empty`;
		}
	});

	if (Object.keys(errors).length < 1) {
		/*
		 * Username must be 6 - 20 characters long.
		 * Can contain only alphanumeric characters and '_' or '.'
		 * No _ or . at beginning or end
		 * No __ or _. or ._ or .. inside
		 */

		if (username.length < 6 || username.length > 20)
			errors.username = 'Username must be 6-20 characters long';
		else {
			const _userRegex = /^(?=[a-zA-Z0-9._]{6,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
			if (!username.match(_userRegex))
				errors.username = 'Invalid Username pattern';
		}

		/*
		 * Password must be atleast 8 characters long.
		 * Must contain atleast 1 lower case, 1 upper case,
		 * 1 number and 1 special character.
		 */

		if (password.length < 9)
			errors.password =
				'Password must be greater than or equal to 8 chracters';
		else {
			const _passRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
			if (!password.match(_passRegex))
				errors.password = 'Invalid password pattern';
		}

		const _emailRegex = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
		if (!email.match(_emailRegex)) errors.email = 'Invalid email address';
	}

	return {
		errors,
		valid: Object.keys(errors).length < 1,
	};
};

module.exports.validateUserLoginInput = (username, password) => {
	const errors = {};
	const data = { Username: username, Password: password };

	Object.keys(data).map((key, _) => {
		if ('' === data[key].trim()) {
			errors[key.toLowerCase()] = `${key} must not be empty`;
		}
	});

	return {
		errors,
		valid: Object.keys(errors).length < 1,
	};
};
