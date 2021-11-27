import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config({ path: './././.env' });

const commands = [];
const commandFiles = fs.readdirSync(__dirname + '/commands').filter((file) => file.endsWith('.ts'));

for (const file of commandFiles) {
	const command = require(__dirname + `/commands/${file}`);
	commands.push(command.data.toJSON());
}

// Refresh guild slash commands
// weird type declaration
const clientId = process.env.client_id as unknown as `${bigint}`;
const guildId = process.env.guild_Id as unknown as `${bigint}`;
const rest = new REST({ version: '9' }).setToken(process.env.discord_token);

rest
	.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
