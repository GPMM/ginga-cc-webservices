const Errors = [
    {
        "error": 100,
        "description": "API not found"
    },
    {
        "error": 101,
        "description": "Illegal argument value"
    },
    {
        "error": 102,
        "description": "Access not authorized by user"
    },
    {
        "error": 103,
        "description": "Unable to ask for user authorization"
    },
    {
        "error": 104,
        "description": "Access not authorized by the broadcaster"
    },
    {
        "error": 105,
        "description": "Missing argument"
    },
    {
        "error": 106,
        "description": "API unavailable for this runtime environment"
    },
    {
        "error": 107,
        "description": "Invalid or outdated access token"
    },
    {
        "error": 108,
        "description": "Invalid or revoked bind token"
    },
    {
        "error": 200,
        "description": "Platform resource unavailable"
    },
    {
        "error": 201,
        "description": "Format not supported"
    },
    {
        "error": 202,
        "description": "Action not supported"
    },
    {
        "error": 203,
        "description": "Parameter not supported"
    },
    {
        "error": 300,
        "description": "No DTV service currently in use"
    },
    {
        "error": 301,
        "description": "Service information cache unavailable"
    },
    {
        "error": 302,
        "description": "No DTV Signal"
    },
    {
        "error": 303,
        "description": "Empty DTV channel list"
    },
    {
        "error": 304,
        "description": "DTV service not found"
    },
    {
        "error": 305,
        "description": "DTV resource not found"
    },
];

exports.getError = (number) => {
    return Errors.filter(errors => errors.error == number)[0];
}