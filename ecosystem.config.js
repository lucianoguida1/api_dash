module.exports = {
    apps: [
        {
            name: 'API_DASH',
            script: './src/app.js',
            instances: 1,
            autorestart: true,
            watch: true,
            ignore_watch: ["mydb.sqlite"],
            max_memory_restart: '1G'
        }
    ]
};