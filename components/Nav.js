import Status from 'assets/nav/status.svg';
import Settings from 'assets/nav/settings.svg';
import Help from 'assets/nav/help.svg';

export default function Nav() {
	return (
		<div className="pa-nav">
			<ul className="nav-links">
				<NavItem title="Status" icon={<Status />} active={true} />
				<NavItem title="Settings" icon={<Settings />} />

				<NavItem title="Help" icon={<Help />} />
			</ul>
		</div>
	);
}

function NavItem({ title, link, icon, active = false }) {
	return (
		<li>
			<a className={`nav-link ${active ? 'active' : ''}`} href={link}>
				<div className="icon">{icon}</div>
				<span>{title}</span>
			</a>
		</li>
	);
}
