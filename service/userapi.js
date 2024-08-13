const path = require('path');
const fs = require('fs');
const ginga = require('./ginga');
const jsonata = require('jsonata');

var user_data_path = null;
var user_data = null;
var current_user = null;
var current_service = null;


function setUserData(fpath, current, service) {
	user_data_path = fpath;
	current_user = current;
	current_service = service;

	let file_path = path.join(user_data_path, 'userData.json');
	let rawdata = fs.readFileSync(file_path);
	user_data = JSON.parse(rawdata);
    console.log(`Set user base data ${user_data_path}, current user to ${current_user}, and service ${current_service}.`);
}


async function getUserList(body) {
	let expression = jsonata(getExpression(body));
	let result = await expression.evaluate(user_data);
	return result;
}


function getExpression(body) {
	let exp = `users['${current_service}' in accessConsent`;
	if (body.and || body.or || body.attribute) {
		// parse the body to construct query
		exp += ` and ${parseExpression(body)}`;
	}
	exp += "]{ 'users': [$.{ 'id': id }] }";
	return exp;
}


function parseExpression(exp) {
	if (exp.attribute) {
		return exp.attribute + parseComparator(exp.comparator) + parseValue(exp.attribute, exp.value);
	}
	else if (exp.and) {
		return parseArray(exp.and, 'and');
	}
	else if (exp.or) {
		return parseArray(exp.or, 'or');
	}
}


function parseValue(att, val) {
	if (att == 'age') {
		return val;
	}
	else if (val == 'true' || val == 'false') {
		return val;
	}
	else {
		return `'${val}'`
	}
}


function parseArray(arr, op) {
	let exp = '(' + parseExpression(arr[0]);
	for (var i = 1; i < arr.length; i++) {
		exp += ` ${op} ` + parseExpression(arr[i]);
	}
	exp += ')';
	return exp;
}


function parseComparator(cmp) {
	if (cmp == 'eq') { return '='; }
	else if (cmp == 'neq') { return '!='; }
	else if (cmp == 'lt') { return '<'; }
	else if (cmp == 'lte') { return '<='; }
	else if (cmp == 'gt') { return '>'; }
	else if (cmp == 'gte') { return '>='; }
}


async function getUserAttribute(uid, atname) {
	let exp = `users['${current_service}' in accessConsent and id='${uid}']`;
	if (atname) {
		exp = `users['${current_service}' in accessConsent and id='${uid}'].${atname}`;
	}
	let expression = jsonata(exp);
	let result = await expression.evaluate(user_data);
	return result;
}


async function getCurrentUser() {
	let exp = `users['${current_service}' in accessConsent and id='${current_user}'].{ 'id': id }`;
	let expression = jsonata(exp);
	let result = await expression.evaluate(user_data);
	return result;
}


function setCurrentUser(uid) {
	current_user = uid;
	ginga.updateCurrentUser(uid);
}


async function checkConsent(fpath) {
	let exp = `users['${current_service}' in accessConsent and avatar='${fpath}'] != null`;
	let expression = jsonata(exp);
	let result = await expression.evaluate(user_data);
	return result;
}


function getFile(fpath) {
	var file_path = path.join(user_data_path, fpath);
	var file_name = path.parse(file_path).base;
	var file_ext = path.extname(file_name);
	
	var stat = fs.statSync(file_path);
	var file = fs.readFileSync(file_path, 'binary');
	
	return {
		size: stat.size,
		mime: GetMime(file_ext),
		name: file_name,
		file: file
	}
}


function GetMime(file_ext) {
	// images
	if (file_ext == '.jpeg' || file_ext == '.jpg') {
		return 'image/jpeg';
	}
	else if (file_ext == '.png') {
		return 'image/png';
	}
	// others
	else {
		return 'application/octet-stream';
	}
}


module.exports = {
	setUserData,
	getUserList,
	getUserAttribute,
	getCurrentUser,
	setCurrentUser,
	checkConsent,
	getFile
}