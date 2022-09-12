import { App, PluginSettingTab, Setting, TextAreaComponent } from "obsidian";
import ApiEntry from "./apiEntry";
import API_TYPES from "./apiTypes";
import API_URLS from "./apiUrls";
import langCodes from "./langCodes";
import LanguageTranslator from "./main";

const apiEntries: Array<ApiEntry> = [
	{
		text: "Builtin",
		value: "0",
	},
	{
		text: "Azure",
		value: "1",
	},
	{
		text: "LibreTranslate",
		value: "2",
	},
];

export default class LanguageTranslatorSettingsTab extends PluginSettingTab {
	plugin: LanguageTranslator;
	apiUrlTextSetting: TextAreaComponent;

	constructor(app: App, plugin: LanguageTranslator) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let { containerEl } = this;

		containerEl.empty();
		containerEl.createEl("h2", { text: "Language Translator Settings" });

		new Setting(containerEl)
			.setName("Target Language")
			.setDesc(
				"Set the translation target language (automatically detects source language)"
			)
			.addDropdown((dropDown) => {
				langCodes.forEach((el) => {
					dropDown.addOption(el.code, el.text);
				});
				dropDown.onChange(async (value) => {
					this.plugin.settings.targetLanguage = langCodes.find(
						(l) => l.code == value
					);
					await this.plugin.saveSettings();
				});
				dropDown.setValue(this.plugin.settings.targetLanguage.code);
			});

		new Setting(containerEl)
			.setName("Translator API Type")
			.setDesc("Set preferred API")
			.addDropdown((dropDown) => {
				apiEntries.forEach((el) => {
					dropDown.addOption(el.value, el.text);
				});
				dropDown.onChange(async (value) => {
					this.plugin.settings.apiType = apiEntries.find(
						(a) => a.value == value
					);
					switch (Number(value)) {
						case API_TYPES.Builtin:
						case API_TYPES.Azure:
							this.plugin.settings.translateApiUrl =
								API_URLS.AZURE_TRANSLATE_API_URL;
							this.apiUrlTextSetting.setValue(
								API_URLS.AZURE_TRANSLATE_API_URL
							);
							break;
						case API_TYPES.LibreTranslate:
							this.plugin.settings.translateApiUrl =
								API_URLS.LIBRE_TRANSLATE_API_URL;
							this.apiUrlTextSetting.setValue(
								API_URLS.LIBRE_TRANSLATE_API_URL
							);
							break;
						default:
							this.plugin.settings.translateApiUrl =
								API_URLS.AZURE_TRANSLATE_API_URL;
							this.apiUrlTextSetting.setValue(
								API_URLS.AZURE_TRANSLATE_API_URL
							);
							break;
					}
					await this.plugin.saveSettings();
				});
				dropDown.setValue(this.plugin.settings.apiType.value);
			});

		new Setting(containerEl).setName("API Url").addTextArea((text) => {
			text.setPlaceholder("Enter url")
				.setValue(this.plugin.settings.translateApiUrl)
				.onChange(async (value) => {
					console.log("New api url: " + value);
					this.plugin.settings.translateApiUrl = value;
					await this.plugin.saveSettings();
				});
			text.setValue(this.plugin.settings.translateApiUrl);
			text.inputEl.setAttr("rows", 4);
			text.inputEl.addClass("settings_area");
			this.apiUrlTextSetting = text;
		});

		new Setting(containerEl).setName("API Token").addText((text) => {
			text.setPlaceholder("Enter token")
				.setValue(this.plugin.settings.token)
				.onChange(async (value) => {
					this.plugin.settings.token = value;
					await this.plugin.saveSettings();
				});
			text.setValue(this.plugin.settings.token);
		});
	}
}
