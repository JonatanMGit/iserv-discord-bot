const config = require('./config.json');
import * as needle from 'needle';
import * as querystring from 'query-string';
import * as fs from 'fs';

// Login sourced from https://github.com/dunklesToast/IServ/blob/master/index.js
const login = querystring.stringify({
	_username: config.username,
	_password: config.password,
});

// Login to IServ
function getCookies() {
	needle.post(config.url + 'iserv/app/login', login, function (err, resp) {
		if (err) {
			console.log(err);
		} else {
			fs.writeFileSync('data.json', JSON.stringify(resp.cookies), 'utf-8');
			console.log('Saved cookies');
		}
	});
}
if (!fs.existsSync('data.json')) {
	getCookies();
}

const cookie = JSON.parse(fs.readFileSync('data.json').toString());
needle.get(
	config.url + 'iserv/plan/show/raw/Vertretungsplan%20Sek1%20Heute/subst_001.htm',
	{ cookies: cookie, follow_max: 0 },
	function (err, resp) {
		if (err || resp.statusCode !== 200) {
			//console.log(err);
			console.log('Login failed');
			return;
		} else {
			console.log(resp.body);
		}
	},
);
