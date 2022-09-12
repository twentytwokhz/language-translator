import { Editor, Notice, Plugin } from "obsidian";
import LanguageCode from "./languageCode";
import API_TYPES from "./apiTypes";
import LanguageTranslatorSettingsTab from "./settingsTab";
import { getTextAzure, getTextLibreTranslate } from "./translation";
import API_URLS from "./apiUrls";
import ApiEntry from "./apiEntry";
import langCodes from "./langCodes";

const AZURE_AUTH_URL =
	"https://func-language-worker-auth.azurewebsites.net/api/GetAuthToken";
const MAX_CHARACTERS = 2000;

interface LanguageTranslatorSettings {
	targetLanguage: LanguageCode;
	apiType: ApiEntry;
	translateApiUrl: string;
	maxCharacters: number;
	token: string;
}

const DEFAULT_SETTINGS: LanguageTranslatorSettings = {
	targetLanguage: {
		text: "English",
		code: "en",
	},
	apiType: {
		text: "Builtin",
		value: "0",
	},
	translateApiUrl: API_URLS.AZURE_TRANSLATE_API_URL,
	maxCharacters: MAX_CHARACTERS,
	token: "",
};

export default class LanguageTranslator extends Plugin {
	settings: LanguageTranslatorSettings;

	onEditorCallback = async (editor: Editor) => {
		let res = "[translation error]";
		try {
			const selection = editor.getSelection();
			if (selection.length > this.settings.maxCharacters) {
				new Notice(
					`Exceeded ${this.settings.maxCharacters} max characters!`
				);
				return;
			}
			let textForTranslation = selection;
			let targetLang = this.settings.targetLanguage.code;

			let firstSemicolonIndex = textForTranslation.indexOf(":");
			if (firstSemicolonIndex != -1) {
				let potentialLangCode = textForTranslation.substring(
					0,
					firstSemicolonIndex
				);
				if (potentialLangCode) {
					let lc = langCodes.find((l) => l.code == potentialLangCode);
					if (lc) {
						targetLang = lc.code;
						textForTranslation = textForTranslation.substring(
							firstSemicolonIndex + 1
						);
					}
				}
			}
			//call the translation api to retrieve the string
			res = await this.getTranslation(targetLang, textForTranslation);
		} catch (err) {
			console.log(err);
			new Notice(err.message);
		}
		editor.replaceSelection(res);
	};

	async getTranslation(lang: string, text: string) {
		let result = "";
		switch (Number(this.settings.apiType.value)) {
			case API_TYPES.Builtin:
				let token = await this.getBuiltinAzureToken();
				result = await getTextAzure(
					text,
					lang,
					token,
					this.settings.translateApiUrl
				);
				break;
			case API_TYPES.Azure:
				result = await getTextAzure(
					text,
					lang,
					this.settings.token,
					this.settings.translateApiUrl
				);
				break;
			case API_TYPES.LibreTranslate:
				result = await getTextLibreTranslate(
					text,
					lang,
					this.settings.token,
					this.settings.translateApiUrl
				);
				break;
		}
		return result;
	}

	async onload() {
		await this.loadSettings();

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: "language-translator-editor-command",
			name: "Insert translation",
			editorCallback: this.onEditorCallback,
			hotkeys: [
				{
					modifiers: ["Ctrl", "Shift"],
					key: "R",
				},
			],
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new LanguageTranslatorSettingsTab(this.app, this));
	}

	getBuiltinAzureToken = async () => {
		try {
			const response = await fetch(AZURE_AUTH_URL);
			return await response.text();
		} catch (err) {
			console.log(err);
			new Notice(err.message);
		}
	};

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
