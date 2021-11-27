// Require the necessary discord.js classes
import { Client, Intents } from 'discord.js';
import * as dotenv from 'dotenv';
dotenv.config({ path: './././.env' });
const fs = require('fs');
require('./deploy-commands');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const commands = [];
const commandFiles = fs.readdirSync(__dirname + '/commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(__dirname + `/commands/${file}`);
	commands.push(command.data.toJSON());
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;

	const command = require(__dirname + `/commands/${interaction.commandName}`);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});
// Login to Discord with your client's token
client.login(process.env.discord_token);
