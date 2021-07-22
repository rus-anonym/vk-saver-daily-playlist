import fs from "fs";
import { API } from "vk-io";

import config from "./DB/config.json";

import getUserLoginPassword from "./lib/getUserLoginPassword";
import getUserToken from "./lib/getUserToken";
import getDailyPlaylist from "./lib/getDailyPlaylist";

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
		apiHeaders: {
			"User-Agent": "VKAndroidApp/6.00-0000",
		},
	});
	const playlist = await getDailyPlaylist(api);
	console.log(`Плейлист найден`);
	console.log(`Добавляю плейлист...`);
	const [owner_id, playlist_id] = playlist.split("_");
	const response = await api.call("audio.savePlaylistAsCopy", {
		owner_id,
		playlist_id,
	});
	console.log(`Добавил плейлист ${response.title}`);
	console.log(
		`URL: https://vk.com/music/playlist/${response.owner_id}_${response.id}_${response.access_key}`,
	);
	process.exit();
})();
