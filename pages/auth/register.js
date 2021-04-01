import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Form, Input, Checkbox, notification } from 'antd';

import AuthLayout from 'components/Auth/AuthLayout';
import { gql, useMutation } from '@apollo/client';

export default function Register() {
	const [values, setValues] = useState({
		name: '',
		username: '',
		email: '',
		psassword: '',
	});

	const showNotification = (err) =>
		notification.error({
			message: 'Error',
			description: [Object.values(err).map((v, k) => <span key={k}>{v}</span>)],
			duration: 6,
		});

	const [addUser, { loading }] = useMutation(REGISTER_USER, {
		update(proxy, result) {
			console.log(result);
		},
		onError(err) {
			showNotification(err.graphQLErrors[0].extensions.exception.errors);
		},
		variables: values,
	});

	const onFinish = (values) => {
		setValues({
			...values,
			name: values.fullname,
		});
		addUser();
	};

	return (
		<>
			<Head>
				<title>PanicAlarm | Register</title>
			</Head>
			<AuthLayout pageTitle="Create an account">
				<div className="auth-form">
					<Form onFinish={onFinish}>
						<Form.Item
							name="fullname"
							rules={[
								{
									required: true,
									message: 'Please input your Full Name!',
								},
							]}
						>
							<Input placeholder="Full Name" className="auth-form-input" />
						</Form.Item>

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
							name="email"
							rules={[
								{
									type: 'email',
									message: "Ah :( ! It's not a valid email",
								},
								{
									required: true,
									message: 'Please input your E-mail!',
								},
							]}
						>
							<Input placeholder="Your Email" className="auth-form-input" />
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
						<Form.Item
							name="phone"
							rules={[
								{
									required: true,
									message: 'Please input your Phone Number!',
								},
							]}
						>
							<Input placeholder="Phone Number" className="auth-form-input" />
						</Form.Item>
						<Form.Item
							name="agreement"
							valuePropName="checked"
							rules={[
								{
									validator: (_, value) =>
										value
											? Promise.resolve()
											: Promise.reject(new Error('Should accept agreement')),
								},
							]}
						>
							<Checkbox>
								I have read the <a href="">agreement</a>
							</Checkbox>
						</Form.Item>
						<button type="submit" className="btn" disabled={loading}>
							Get Started
							{loading && <div className="loader"></div>}
						</button>
					</Form>
				</div>
				<div className="auth-attr">
					<p>
						Already a member?{' '}
						<Link href="/auth/login">
							<a>Sign In Now</a>
						</Link>
					</p>
				</div>
			</AuthLayout>
		</>
	);
}

// GQL Stuff
const REGISTER_USER = gql`
	mutation registerUser(
		$name: String!
		$username: String!
		$email: String!
		$password: String!
	) {
		registerUser(
			registerInput: {
				name: $name
				email: $email
				username: $username
				password: $password
			}
		) {
			id
			email
			username
			token
		}
	}
`;
