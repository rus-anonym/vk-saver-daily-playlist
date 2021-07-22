import readline from "readline-sync";
import { CallbackService } from "vk-io";
import {
	DirectAuthorization,
	officialAppCredentials,
} from "@vk-io/authorization";
import { login, password } from "../DB/config.json";

const callbackService = new CallbackService();

callbackService.onTwoFactor((payload, retry) => {
	const key = readline.questionInt(`Введите код 2FA: `);
	retry(key as unknown as string);
});

export default async () => {
	const direct = new DirectAuthorization({
		callbackService,
		apiVersion: "5.157",
		scope: "audio",
		...officialAppCredentials.android,
		login,
		password,
	});
	const response = await direct.run();
	return response.token;
};
