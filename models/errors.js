const Errors = [
    {
        "error": 101,
        "description": "Illegal argument [argumentName] value"
    },
    {
        "error": 105,
        "description": "Illegal argument carousel id value"
    },
];

exports.getError = (number) => {
    return Errors.filter(errors => errors.error == number)[0];
}