module.exports = {
  apps: [
    {
      name: 'tripoly',
      exec_mode: 'fork', // needs to be fork for interpreter
      instances: '1', // Or a number of instances
      script: './node_modules/nuxt/bin/nuxt.js',
      args: 'start',
      interpreter: '/home/forge/.nvm/versions/node/v16.18.0/bin/node', // 'v18.11.0'
      env: {
        HOST: 'localhost',
        PORT: 3002,
      },
    },
  ],
}