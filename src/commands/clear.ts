import Command from "@Commands/command";
import Credits from "@Utils/Credits";

import type { Message, TextChannel } from "discord.js-selfbot-v13";

export default class Clear extends Command {
	public static metadata = {
		name: "clear",
		parameters: [
			{
				name: "amount",
				type: "number",
				description: "Number of messages to delete (default: 100)",
				required: false,
			},
		],
		description: "Delete your own messages from the current channel.",
		aliases: ["purge", "clean"],
	};

	constructor(message: Message) {
		super(message, Clear.metadata);
	}

	async execute() {
		const parameters = await this.getParameters();
		if (!parameters) return;

		const [amount] = parameters;

		const statusMessage = await this.message.channel.send(
			Credits.Append("🧹 Deleting messages...")
		);

		try {
			if (!(this.message.channel as TextChannel).messages) {
				await statusMessage.edit(
					Credits.Append(
						"❌ This command only works in text channels."
					)
				);
				return;
			}

			const fetchedMessages = await this.message.channel.messages.fetch({
				limit: amount,
			});

			const userMessages = fetchedMessages.filter(
				(m) => m.author.id === this.message.author.id
			);

			const messagesToDelete = userMessages.first(
				Math.min(amount, userMessages.size)
			);

			let deletedCount = 0;

			for (const msg of messagesToDelete) {
				try {
					await msg.delete();
					deletedCount++;
					await new Promise((resolve) => setTimeout(resolve, 1000));
				} catch (error) {
					console.error(`Failed to delete message: ${error}`);
				}
			}

			await statusMessage.edit(
				Credits.Append(
					`🧹 Successfully deleted ${deletedCount} messages.`
				)
			);
		} catch (error) {
			console.error(`Error in clear command: ${error}`);
		}
	}
}
