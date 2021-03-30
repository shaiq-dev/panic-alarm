import Link from 'next/link';
import Logo from 'assets/logo.svg';

const AuthLayout = ({ children, pageTitle }) => {
	return (
		<div className="auth-layout">
			<div className="auth-layout-wrapper">
				<div className="logo">
					<Link href="/">
						<a>
							<Logo />
						</a>
					</Link>
				</div>
				<div className="title">
					Get alerted if danger sneezes near your parents or kids
				</div>
				<div className="page-title">{pageTitle}</div>
			</div>
			<div className="auth-layout-container">{children}</div>
			<footer>
				<div className="logo">
					<Link href="/">
						<a>
							<Logo />
						</a>
					</Link>
				</div>
				<p>
					© Presidency University - PanicAlarm IOT Project by Group 2
					section 5CSE10{' '}
				</p>
			</footer>
		</div>
	);
};

export default AuthLayout;
