import { MarkdownView } from "obsidian";

export interface TranslationService {
	/**
	 *
	 * @public
	 * @param lang Target language
	 * @param text Text to be translated
	 **/
	translate(lang: string, text: string): Promise<string>;
}
