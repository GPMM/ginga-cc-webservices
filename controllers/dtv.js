const uuidv4 = require('uuid').v4;

exports.GETAuthorize = (req, res, next) => {
	res.status(200).json({
		challenge : uuidv4()
	});
};

exports.GETToken = (req, res, next) => {
	res.status(200).json({
		accessToken : uuidv4(),
		tokenType : "uuidv4",
		expiresIn : 100000,
		refreshToken : uuidv4(),
		serverCert : uuidv4()
	});
};

exports.GETCurrentService = (req, res, next) => {
	res.status(200).json({
		serviceContextId : "c08b2c72-fd14-4095-adaf-2e5810850c57",
		serviceName : "Rede Midiacom",
		transportStreamId : "c08b2c72-fd14-4095-adaf-2e5810850c57",
		originalNetworkId : "09e59a1d-e2e7-467e-85db-2fb5a572e2fc",
		serviceId : "fe2481ea-5d44-4225-884b-504782636c3a"
	});
};