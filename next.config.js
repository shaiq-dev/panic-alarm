const withAntdLess = require('next-plugin-antd-less');

module.exports = withAntdLess({
	// modifyVars: { '@primary-color': '#04f' },

	lessVarsFilePath: './styles/antdVariables.less',
	cssLoaderOptions: {},
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ['@svgr/webpack'],
		});

		return config;
	},
});
