module.exports = (function (env) {
    let config = {};
    switch (env) {
        case 'development':
            config = require('./development');
            break;
        default:
            process.exit(1);
    }
    return config;
})(process.env.NODE_ENV);