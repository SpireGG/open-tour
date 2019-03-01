module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: [
		'eslint:recommended',
	],
	rules: {
		'class-methods-use-this': 0,
		'indent': [2, 'tab'],
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-new': 0,
		'no-return-assign': 2,
		'object-curly-spacing': [2, 'always'],
		'semi': 2,
		'comma-dangle': [2, {
			'arrays': 'always-multiline',
			'objects': 'always-multiline',
			'imports': 'never',
			'exports': 'never',
			'functions': 'never',
		}],
		'no-tab': 0,
		'import/no-unresolved': 0,
		'import/prefer-default-export': 0,
	},
	parserOptions: {
		parser: 'babel-eslint',
	},
	globals: {
		process: false,
	},
};
