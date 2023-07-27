const Errors = [
    {
        "error": 101,
        "description": "Illegal argument [argumentName] value"
    },
    {
        "error": 105,
        "description": "Illegal argument carousel id value"
    },
    {
        "error": 106,
        "description": "Request without body"
    },
];

exports.getError = (number) => {
    return Errors.filter(errors => errors.error == number)[0];
}