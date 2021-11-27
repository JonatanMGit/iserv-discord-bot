import needle from 'needle';
import * as querystring from 'query-string';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config({ path: '././.env' });

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
// get Cookies from Iserv
export function updateCookies(saveCookies: boolean) {
	const cookie = fs.existsSync('data.json') ? JSON.parse(fs.readFileSync('data.json', 'utf-8')) : {};
	// Check if cookies are saved cookies are valid
	needle('get', process.env.iserv_url + 'iserv/', { cookies: cookie })
		.then(function (resp) {
			if (resp.statusCode == 302) {
				process.env.iserv_debug && console.log('Cookies are invalid\nGetting new ones');
				// incase they are invalid, get new cookies
				needle('post', process.env.iserv_url + 'iserv/app/login', login, options)
					.then((resp) => {
						if (!resp.cookies) {
							console.log('Unable to get cookies');
							return false;
						}
						if (saveCookies !== false) {
							fs.writeFileSync('data.json', JSON.stringify(resp.cookies), 'utf-8');
							console.log('Cookies saved');
						}
					})
					.catch(function (err) {
						console.log(err);
						return err;
					});
				return true;
			} else {
				// else use old cookies
				process.env.iserv_debug && console.log('Cookies are already valid');
				return true;
			}
		})
		.catch(function (err) {
			console.log(err);
			return err;
		});
}

updateCookies(true);

require('./bot/bot');
