module.exports = {
    apps: [
        {
            name: 'web-prolibu',
            script: 'npm run start',
            autorestart: true,
            watch: false,
            env: {
                PORT: 3122,
                NODE_ENV: 'development'
            },
            env_production: {
                PORT: 3122,
                NODE_ENV: 'production'
            }
        }
    ]
};
