'use strict';

const _parseInteger = (attrValue, defaultValue) => {
    const integerValue = parseInt(attrValue);
    if (!isNaN(integerValue)) {
        return integerValue;
    }
    return defaultValue;
};

const _parseBoolean = (attrValue, defaultValue) => {
    if (attrValue === 'true' || attrValue === 'false') {
        try {
            return JSON.parse(attrValue);
        } catch (e) {
            return Boolean(attrValue);
        }
    } else {
        return defaultValue;
    }
};

const _parseString = (attrValue, defaultValue) => attrValue === defaultValue ? defaultValue : '' + attrValue;

const _parseArray = (attrValue, defaultValue) => {
    return () => {
        if (attrValue === defaultValue) {
            return defaultValue;
        }
        attrValue += '';
        return attrValue.split(',');
    };
};

const parseAttrFromObject = (object, attr, defaultValue) => {
    if (!object || !attr) {
        return {};
    }

    let attrValue = defaultValue;
    if (object.hasOwnProperty(attr) && object[attr] !== null) {
        attrValue = object[attr];
    }

    return {
        integer: _parseInteger.bind(null, attrValue, defaultValue),
        string: _parseString.bind(null, attrValue, defaultValue),
        array: _parseArray.call(null, attrValue, defaultValue),
        boolean: _parseBoolean.bind(null, attrValue, defaultValue),
        value: () => attrValue,
    };
};

module.exports = parseAttrFromObject;