import Command from "@Commands/command";
import Credits from "@Utils/Credits";

import type { Message } from "discord.js-selfbot-v13";

export default class Ping extends Command {
	public static metadata = {
		name: "ping",
		parameters: [],
		description: "Check your ping to the Discord API.",
		aliases: [],
	};

	constructor(message: Message) {
		super(message, Ping.metadata);
	}

	async execute() {
		const startTime = Date.now();
		const message = await this.message.channel.send("Calculating ping...");
		const endTime = Date.now();

		const latency = endTime - startTime;

		await message.edit(
			Credits.Append(`🏓 Api latency is \`${latency}ms\``)
		);
	}
}
