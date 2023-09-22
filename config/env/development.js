'use strict';

const env = process.env.NODE_ENV;

const utils = {
    parseAttrFromObject: require('../../utils/parse/attr-from-object'),
};

module.exports = {
    env,
    client: {
        webSocketUrl: utils.parseAttrFromObject(process.env, 'WEB_SOCKET_URL', 'ws://localhost').string(),
		gingaSockePort: utils.parseAttrFromObject(process.env, 'GINGA_SOCKET_PORT', '8085').string()
    }
};