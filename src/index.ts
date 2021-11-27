import needle from 'needle';
import * as querystring from 'query-string';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config({ path: '././.env' });

require('./bot/bot');

// Login sourced from https://github.com/dunklesToast/IServ/blob/master/index.js
const login = querystring.stringify({
	_username: process.env.iserv_username,
	_password: process.env.iserv_password,
	_remember_me: 'on',
});
const options = {
	headers: {
		'User-Agent': 'Mozilla/5.0 (Linux x86_64) Gecko/20100101 JoeBiden/0.0',
	},
};
function updatecookie(): object {
	process.env.iserv_debug && console.log('Getting new cookies');
	getCookies(true);
	return JSON.parse(fs.readFileSync('data.json', 'utf-8'));
}

const cookie = fs.existsSync('data.json') ? JSON.parse(fs.readFileSync('data.json', 'utf-8')) : {};

// Login to IServ and save a *new* cookies
async function getCookies(saveCookies: boolean): Promise<boolean | Error | unknown> {
	const a = await needle('post', process.env.iserv_url + 'iserv/app/login', login, options)
		.then((resp) => {
			if (!resp.cookies) {
				console.log('Unable to get cookies');
				return false;
			}
			if (saveCookies) {
				fs.writeFileSync('data.json', JSON.stringify(resp.cookies), 'utf-8');
			}
			return resp.cookies;
		})
		.catch(function (err) {
			console.log(err);
			return err;
		});
	process.env.iserv_debug && console.log(a);
	return a;
}

// Check if cookies are still valid
async function checkCookies(): Promise<boolean | Error | unknown> {
	const a = await needle('get', process.env.iserv_url + 'iserv/', options)
		.then(function (resp) {
			if (resp.statusCode == 301) {
				process.env.iserv_debug && console.log('Cookies are invalid\nGetting new ones');
				getCookies(true);
				return false;
			} else {
				process.env.iserv_debug && console.log('Cookies are valid');
				return true;
			}
		})
		.catch(function (err) {
			console.log(err);
			return err;
		});
	process.env.iserv_console && console.log(a);
	return a;
}

async function getSubstitutionRaw() {
	const a = await needle(
		'get',
		process.env.iserv_url + 'iserv/plan/show/raw/Vertretungsplan%20Sek1%20Heute/subst_001.htm',
		{ cookies: cookie },
		options,
	)
		.then(function (resp) {
			if (resp.statusCode !== 200) {
				//console.log(err);
				console.log('Login failed');
				console.log(resp.statusCode);
				return false;
			} else {
				process.env.iserv_console && console.log('Get Sub Table Sucessfull');
				return resp.body;
			}
		})
		.catch(function (err) {
			console.log(err);
			return err;
		});
	process.env.iserv_console && console.log(a);
	return await a;
}
