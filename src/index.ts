import * as needle from 'needle';
import * as querystring from 'query-string';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config({ path: '././.env' });

// Login sourced from https://github.com/dunklesToast/IServ/blob/master/index.js
const login = querystring.stringify({
	_username: process.env.iserv_username,
	_password: process.env.iserv_password,
});

// Login to IServ
function getCookies() {
	needle.post(process.env.iserv_url + 'iserv/app/login', login, function (err, resp) {
		if (err) {
			console.log(err);
		} else {
			console.log('Cookies are valid');
			fs.writeFileSync('data.json', JSON.stringify(resp.cookies), 'utf-8');
			console.log('Saved cookies');
		}
	});
}

function checkCookies() {
	needle.get(process.env.iserv_url + 'iserv/', function (err, resp) {
		if (err || resp.statusCode == 301) {
			console.log('Cookies are invalid\nGetting new ones');
			getCookies();
		} else {
			console.log('Cookies are valid');
		}
	});
}

if (!fs.existsSync('data.json')) {
	getCookies();
}
checkCookies();

const cookie = JSON.parse(fs.readFileSync('data.json').toString());
console.log(cookie);

needle.get(
	process.env.iserv_url + 'iserv/plan/show/raw/Vertretungsplan%20Sek1%20Heute/subst_001.htm',
	{ cookies: cookie, follow_max: 0 },
	function (err, resp) {
		if (err || resp.statusCode !== 200) {
			//console.log(err);
			console.log('Login failed');
			console.log(resp.statusCode);
			return;
		} else {
			console.log('Login successful');
		}
	},
);
