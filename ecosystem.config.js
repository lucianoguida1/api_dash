module.exports = {
    apps: [
        {
            name: 'API_DASH',
            script: './src/app.js',
            instances: 1,
            autorestart: true,
            watch: true,
            ignore_watch: [
                "node_modules",
                "mydb.sqlite",
                "mydb.sqlite-journal"
            ],
            max_memory_restart: '1G'
        }
    ]
};