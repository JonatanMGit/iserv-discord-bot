import needle from 'needle';
import fs from 'fs';
import { SlashCommandBuilder } from '@discordjs/builders';
const updateCookies = require('../../index');

module.exports = {
	data: new SlashCommandBuilder().setName('vertretung').setDescription('Schickt den Vertretungsplan'),
	async execute(interaction) {
		updateCookies.updateCookies(true);
		needle('get', process.env.iserv_url + 'iserv/plan/show/raw/Vertretungsplan%20Sek1%20Heute/subst_001.htm', {
			cookies: JSON.parse(fs.readFileSync('./././data.json', 'utf-8')),
		})
			.then(function (resp) {
				if (resp.statusCode !== 200) {
					console.log('Login failed with statuscode ' + resp.statusCode);
					return interaction.reply('Es ist ein Fehler aufgetreten');
				} else {
					process.env.iserv_console && console.log('Get Sub Table Sucessfull');
					interaction.reply('Get Sub Table Sucessfull');
				}
			})
			.catch(function (err) {
				console.log(err);
				return err;
			});
		return;
	},
};
