module.exports = {
  apps: [{
    name: 'orbit-trails-api',
    script: './server/simple.mjs',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'development',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024',
    watch: false,
    ignore_watch: [
      'node_modules',
      'logs',
      'dist/spa'
    ],
    max_restarts: 10,
    min_uptime: '10s',
    kill_timeout: 5000,
    autorestart: true,
    restart_delay: 4000,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};
