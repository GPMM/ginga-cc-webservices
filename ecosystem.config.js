module.exports = {
  apps : [
    {
      name   : 'Ginga CC WS',
      script : './app.js',
      env: {
        'NODE_ENV': 'development',
        'GINGACCWSPORT': '8080',
        'WEB_SOCKET_URL': 'ws://localhost',
        'GINGA_SOCKET_PORT': '8085'
      }
    }
  ]
}
