import chalk from "chalk";

/**
 * The `Logs` class provides utility functions for logging messages to the console.
 */
export default class Logs {
	/*
	 * Log an informational message to the console.
	 * @param message - The message to log.
	 */
	static Info(message: any): void {
		console.log(
			chalk.hex("#d6af42")(this.formatConsoleDate(new Date())) +
				chalk.cyan("[INFO] ") +
				message
		);
	}

	/*
	 * Log an error message to the console.
	 * @param message - The error message to log.
	 */
	static Error(message: any): void {
		console.error(
			chalk.hex("#d6af42")(this.formatConsoleDate(new Date())) +
				chalk.red("[ERROR] ") +
				message
		);
	}

	/*
	 * Log a success message to the console.
	 * @param message - The success message to log.
	 */
	static Success(message: any): void {
		console.log(
			chalk.hex("#d6af42")(this.formatConsoleDate(new Date())) +
				chalk.green("[SUCCESS] ") +
				message
		);
	}

	/*
	 * Log a warning message to the console.
	 * @param message - The warning message to log.
	 */
	static Warning(message: any): void {
		console.log(
			chalk.hex("#d6af42")(this.formatConsoleDate(new Date())) +
				chalk.yellow("[WARNING] ") +
				message
		);
	}

	/*
	 * Format a Date object as a string for console output.
	 * @param date - The Date object to format.
	 * @returns The formatted date string.
	 */
	static formatConsoleDate(date: Date): string {
		const hour = date.getHours();
		const minutes = date.getMinutes();
		const seconds = date.getSeconds();
		const milliseconds = date.getMilliseconds();

		return (
			"[" +
			(hour < 10 ? "0" + hour : hour) +
			":" +
			(minutes < 10 ? "0" + minutes : minutes) +
			":" +
			(seconds < 10 ? "0" + seconds : seconds) +
			"." +
			("00" + milliseconds).slice(-3) +
			"] "
		);
	}
}
