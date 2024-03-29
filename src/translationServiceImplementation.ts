import { Notice } from "obsidian";
import API_TYPES from "./apiTypes";
import LanguageTranslator from "./main";
import { getTextAzure, getTextLibreTranslate } from "./translation";
import { TranslationService } from "./translationService";

const AZURE_AUTH_URL =
	"https://func-lang-translator-auth.azurewebsites.net/api/AuthToken";

const AZURE_BUILTIN_KEY = "0bb27e8d40864db0a9854d8793e4fbb7";

export class TranslationServiceImplementation implements TranslationService {
	plugin: LanguageTranslator;

	constructor(plugin: LanguageTranslator) {
		this.plugin = plugin;
	}

	getBuiltinAzureToken = async () => {
		try {
			// const response = await fetch(AZURE_AUTH_URL);
			return AZURE_BUILTIN_KEY;
			// return await response.text();
		} catch (err) {
			console.log(err);
			new Notice(err.message);
		}
	};

	async translate(lang: string, text: string) {
		let result = "";
		switch (Number(this.plugin.settings.apiType.value)) {
			case API_TYPES.Builtin:
				let token = await this.getBuiltinAzureToken();
				result = await getTextAzure(
					text,
					lang,
					"westeurope",
					token,
					this.plugin.settings.translateApiUrl
				);
				break;
			case API_TYPES.Azure:
				result = await getTextAzure(
					text,
					lang,
					this.plugin.settings.region.code,
					this.plugin.settings.token,
					this.plugin.settings.translateApiUrl
				);
				break;
			case API_TYPES.LibreTranslate:
				result = await getTextLibreTranslate(
					text,
					lang,
					this.plugin.settings.token,
					this.plugin.settings.translateApiUrl
				);
				break;
		}
		return result;
	}
}
