import { useState } from 'react';
import Head from 'next/head';
import { Form, Input, Checkbox, notification } from 'antd';

import AuthLayout from 'components/Auth/AuthLayout';
import { gql, useMutation } from '@apollo/client';
import Link from 'next/link';

export default function Login() {
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

	const onFinish = (values) => {
		setValues({
			...values,
			name: values.fullname,
		});
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

						<button type="submit" className="btn" disabled={false}>
							Log In
							{/* {loading && <div className="loader"></div>} */}
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
