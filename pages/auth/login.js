import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Router from 'next/router';
import { gql, useMutation } from '@apollo/client';
import { Form, Input, Checkbox, notification } from 'antd';

import AuthLayout from 'components/Auth/AuthLayout';
import { useAuthDispatch } from 'context/auth';
import checkAuth from '@/server/Utils/checkAuth';

export default function Login() {
	const dispatch = useAuthDispatch();

	const [values, setValues] = useState({
		username: '',
		psassword: '',
	});

	const showNotification = (err) =>
		notification.error({
			message: 'Error',
			description: [Object.values(err).map((v, k) => <span key={k}>{v}</span>)],
			duration: 6,
		});

	const [signIn, { loading }] = useMutation(LOGIN_USER, {
		update(_, { data: { loginUser: userData } }) {
			dispatch({ type: 'LOGIN', payload: userData });
			Router.push('/');
		},
		onError(err) {
			let errors;
			let errorObj = err.graphQLErrors[0].extensions.exception;
			if (errorObj) errors = errorObj.errors;

			if (errors) showNotification(errors);
			else showNotification({ Wrong: 'Something Went Wrong' });
		},
		variables: values,
	});

	const onFinish = (values) => {
		setValues({
			...values,
		});
		signIn();
	};

	return (
		<>
			<Head>
				<title>PanicAlarm | Login</title>
			</Head>
			<AuthLayout pageTitle="Let's sign you in">
				<div className="auth-form">
					<Form onFinish={onFinish}>
						<Form.Item
							name="username"
							rules={[
								{
									required: true,
									message: 'Please input your username!',
								},
							]}
						>
							<Input placeholder="Username" className="auth-form-input" />
						</Form.Item>

						<Form.Item
							name="password"
							rules={[
								{
									required: true,
									message: 'Please input your password!',
								},
							]}
							hasFeedback
						>
							<Input.Password
								placeholder="Password"
								className="auth-form-input"
							/>
						</Form.Item>
						<Form.Item>
							<Form.Item name="remember" valuePropName="checked" noStyle>
								<Checkbox>Remember me</Checkbox>
							</Form.Item>
							<Link href="/auth/reset">
								<a className="auth-form-forgot" href="">
									Forgot password
								</a>
							</Link>
						</Form.Item>

						<button type="submit" className="btn" disabled={loading}>
							Log In
							{loading && <div className="loader"></div>}
						</button>
					</Form>
				</div>
				<div className="auth-attr">
					<p>
						Don't have an account yet?{' '}
						<Link href="/auth/register">
							<a>Join Now</a>
						</Link>
					</p>
				</div>
			</AuthLayout>
		</>
	);
}

export const getServerSideProps = async ({ req, res }) => {
	try {
		const token = req.cookies.authToken;
		if (token) {
			checkAuth(token);
			res.writeHead(307, { Location: '/?authenticated=true' }).end();
		}
	} catch (error) {
		console.log(error);
	}

	return { props: {} };
};

// GQL Stuff

const LOGIN_USER = gql`
	mutation loginUser($username: String!, $password: String!) {
		loginUser(loginInput: { username: $username, password: $password }) {
			id
			name
			email
			username
			token
		}
	}
`;
