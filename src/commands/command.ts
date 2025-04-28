import Credits from "@Utils/Credits";

import type { Message } from "discord.js-selfbot-v13";

/**
 * Base class for command implementation
 * @class Command
 */
export default class Command {
	/** The Discord message that triggered this command */
	message: Message;
	/** The name of the command */
	name: string;
	/** List of parameters the command accepts */
	parameters: {
		name: string;
		type: string;
		description: string;
		required: boolean;
		default?: any;
	}[];
	/** Description of what the command does */
	description: string;
	/** Alternative command names that can trigger this command */
	aliases: string[];

	/**
	 * Creates a new Command instance
	 * @param {Message} message - The Discord message that triggered this command
	 * @param {Object} metadata - Command metadata
	 * @param {string} metadata.name - The name of the command
	 * @param {string[]} metadata.parameters - List of parameters the command accepts
	 * @param {string} metadata.description - Description of what the command does
	 * @param {string[]} metadata.aliases - Alternative command names
	 */
	constructor(
		message: Message,
		metadata: {
			name: string;
			parameters: {
				name: string;
				type: string;
				description: string;
				required: boolean;
				default?: any;
			}[];
			description: string;
			aliases: string[];
		}
	) {
		this.message = message;
		this.name = metadata.name;
		this.parameters = metadata.parameters;
		this.description = metadata.description;
		this.aliases = metadata.aliases;
	}

	/**
	 * Extracts command parameters from the message content and applies default values
	 * @returns {Promise<any[]>} Array of processed parameter values
	 */
	async getParameters(): Promise<any[] | null> {
		const content = this.message.content.split(" ");
		const rawParams = content.slice(1);
		const processedParams: any[] = [];

		if (rawParams.length !== this.parameters.length) {
			await this.message.channel.send(
				Credits.Append(
					`⚠️ You must provide the following parameters: ${this.parameters
						.map((p) => p.name)
						.join(", ")}.`
				)
			);

			return null;
		}

		for (let i = 0; i < this.parameters.length; i++) {
			const paramDef = this.parameters[i];
			const rawValue = rawParams[i];

			if (rawValue !== undefined) {
				switch (paramDef.type.toLowerCase()) {
					case "number":
						processedParams.push(Number(rawValue));
						break;
					case "boolean":
						processedParams.push(
							rawValue.toLowerCase() === "true" ||
								rawValue.toLowerCase() === "yes"
						);

						break;
					default:
						processedParams.push(rawValue);
				}
			} else if (paramDef.required) {
				this.message.channel.send(
					Credits.Append(
						`❌ Missing required parameter \`${paramDef.name}\``
					)
				);
				return null;
			} else if (paramDef.default !== undefined) {
				processedParams.push(paramDef.default);
			} else {
				processedParams.push(undefined);
			}
		}

		return processedParams;
	}
}
