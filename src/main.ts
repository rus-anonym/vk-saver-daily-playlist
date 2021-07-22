import fs from "fs";
import { API } from "vk-io";

import config from "./DB/config.json";

import getUserLoginPassword from "./lib/getUserLoginPassword";
import getUserToken from "./lib/getUserToken";

getUserLoginPassword();

(async function main() {
	const token = await getUserToken().catch((error) => {
		if (error.code === "USERNAME_OR_PASSWORD_IS_INCORRECT") {
			config.login = "";
			config.password = "";
			fs.writeFileSync(
				"./src/DB/config.json",
				JSON.stringify(config, null, "\t"),
			);
			console.error(`Логин или пароль неверен`);
			process.exit();
		} else {
			throw error;
		}
	});
	console.log(`Токен получен`);
	console.log(`Получаю плейлист на сегодня...`);
	const api = new API({
		token,
		apiVersion: "5.157",
	});
})();
