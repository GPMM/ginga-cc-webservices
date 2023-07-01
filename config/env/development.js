'use strict';

const env = process.env.NODE_ENV;

const utils = {
    parseAttrFromObject: require('../../utils/parse/attr-from-object'),
};

module.exports = {
    env,
    client: {
        webSocketUrl: utils.parseAttrFromObject(process.env, 'WEB_SOCKET_URL', 'ws://localhost').string()
    }
};