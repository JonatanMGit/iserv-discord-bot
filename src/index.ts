const config = require('./config.json');
import needle from 'needle';

import * as querystring from 'query-string';

console.log(config);

// Login sourced from https://github.com/dunklesToast/IServ/blob/master/index.js
const login = querystring.stringify({
	_username: config.username,
	_password: config.password,
});

needle.post(config.url + 'iserv/app/login', login, config.needle, function (err, resp) {
	if (err) {
		console.log(err);
		return;
	}
	const cookie = resp.cookies;
	console.log('Logged in');
	console.log(cookie);
});
