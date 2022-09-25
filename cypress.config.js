const { defineConfig } = require('cypress');

module.exports = defineConfig({
	projectId: 'rfu8xk',
	video: false,
	e2e: {
		baseUrl: 'http://localhost:5000',
		specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
	},
});
