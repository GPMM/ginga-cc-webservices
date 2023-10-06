const path = require('path');
const fs = require('fs');
const ginga = require('./ginga');
const jsonata = require('jsonata');

var user_data_path = null;
var user_data = null;
var current_user = null;


ginga.registerHandler('userapi', function (fpath, current) {
	user_data_path = fpath;
	current_user = current;

	let file_path = path.join(user_data_path, 'userData.json');
	let rawdata = fs.readFileSync(file_path);
	user_data = JSON.parse(rawdata);
});


async function getUserList(body) {
	let expression = jsonata(getExpression(body));
	let result = await expression.evaluate(user_data);
	return result;
}


function getExpression(body) {
	let exp = 'users';
	if (body.and || body.or || body.attribute) {
		// parse the body to construct query
		exp += `[${parseExpression(body)}]`;
	}
	exp += "{ 'users': [$.{ 'id': id, 'name': name, 'icon': icon }] }";
	return exp;
}


function parseExpression(exp) {
	if (exp.attribute) {
		return exp.attribute + parseComparator(exp.comparator) + `'${exp.value}'`;
	}
	else if (exp.and) {
		return parseArray(exp.and, 'and');
	}
	else if (exp.or) {
		return parseArray(exp.or, 'or');
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
	let exp = `users[id='${uid}']`;
	if (atname) {
		exp = `users[id='${uid}'].${atname}`;
	}
	let expression = jsonata(exp);
	let result = await expression.evaluate(user_data);
	return result;
}


async function getCurrentUser() {
	let exp = `users[id='${current_user}'].{ 'id': id, 'name': name, 'icon': icon }`;
	let expression = jsonata(exp);
	let result = await expression.evaluate(user_data);
	return result;
}


function setCurrentUser(uid) {
	current_user = uid;
	ginga.updateCurrentUser(uid);
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
	getUserList,
	getUserAttribute,
	getCurrentUser,
	setCurrentUser,
	getFile
}