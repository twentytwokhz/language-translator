import { Editor, MarkdownView, Notice, Plugin } from "obsidian";

const TRANSLATE_API_URL = "https://api.cognitive.microsofttranslator.com";
const SUBSCRIPTION_KEY = "259c8c4e546e4170a9de7c9e67aa598e";
const MAX_CHARACTERS = 1000;

export default class LanguageTranslator extends Plugin {
	async onload() {
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: "language-translator-editor-command",
			name: "Insert translation",
			editorCallback: async (editor: Editor) => {
				let res = "[translation error]";
				try {
					const selection = editor.getSelection();
					if (selection.length > MAX_CHARACTERS) {
						new Notice(
							`Exceeded ${MAX_CHARACTERS} max characters!`
						);
						return;
					}
					let splittedText = selection.split(":");
					if (splittedText.length != 2) {
						new Notice("Incorrect format!");
						return;
					}
					const lang = splittedText[0];
					const textForTranslation = splittedText[1];

					const payload = JSON.stringify([
						{
							text: textForTranslation,
						},
					]);
					const myHeaders = new Headers({
						"Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY,
						"Ocp-Apim-Subscription-Region": "WestEurope",
						"Content-type": "application/json",
					});

					const response = await fetch(
						`${TRANSLATE_API_URL}/translate?api-version=3.0&to=${lang}`,
						{
							method: "POST",
							body: payload,
							headers: myHeaders,
						}
					);
					const json = await response.json();
					res = json[0].translations[0].text;
				} catch (err) {
					console.log(err);
					new Notice(err.message);
				}
				editor.replaceSelection(res);
			},
			hotkeys: [
				{
					modifiers: ["Ctrl", "Shift"],
					key: "R",
				},
			],
		});
	}
}
