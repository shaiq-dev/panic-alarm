const store = {
	config: {
		siteTitle:
			'PanicAlarm - IOT based alerts to help elderly people and kids in case of panic situation',
	},

	emojis: ['🧐', '🤓', '😎', '😃', '😄', '😁', '👋'],
	host:
		process.env.NODE_ENV === 'production'
			? 'https://panicalarm.vercel.app/'
			: 'http://localhost:3000',
};

export default store;
