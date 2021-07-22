import fs from "fs";
import readline from "readline-sync";
import config from "../DB/config.json";

export default () => {
	if (!config.login) {
		config.login = readline.question(`Введите логин: `);
	}

	if (!config.password) {
		config.password = readline.question(`Введите пароль: `, {
			hideEchoBack: true,
		});
	}

	fs.writeFileSync("./src/DB/config.json", JSON.stringify(config, null, "\t"));
};
