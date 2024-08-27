'use strict';

const env = process.env.NODE_ENV;

const utils = {
    parseAttrFromObject: require('../../utils/parse/attr-from-object'),
};

module.exports = {
    env,
    client: {
        serverURL: utils.parseAttrFromObject(process.env, 'SERVER_URL', 'localhost').string(),
		gingaSockePort: utils.parseAttrFromObject(process.env, 'GINGA_SOCKET_PORT', '8085').string(),
		defaultUUID: utils.parseAttrFromObject(process.env, 'DEV_DEFAULT_UUID', null).string(),
		appBaseURL: utils.parseAttrFromObject(process.env, 'APP_BASE_URL', null).string(),
		appID: utils.parseAttrFromObject(process.env, 'APP_ID', null).string(),
		
		usrFilePath: utils.parseAttrFromObject(process.env, 'USER_FILE_PATH', null).string(),
		currentUser: utils.parseAttrFromObject(process.env, 'CURRENT_USER', null).string(),
		currentService: utils.parseAttrFromObject(process.env, 'CURRENT_SERVICE', null).string()
    }
};