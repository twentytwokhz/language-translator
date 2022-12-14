export async function getTextLibreTranslate(
	text: string,
	lang: string,
	token: string,
	translateApiUrl: string
) {
	let res = "";
	const payload = JSON.stringify({
		q: text,
		source: "auto",
		target: lang,
		format: "text",
		api_key: token,
	});
	const myHeaders = new Headers({
		"Content-type": "application/json",
	});
	try {
		const response = await fetch(translateApiUrl, {
			method: "POST",
			body: payload,
			headers: myHeaders,
		});
		let jsonResponse = await response.json();
		res = jsonResponse.translatedText || jsonResponse.error;
	} catch (err) {
		console.error(err);
	}
	return res;
}

export async function getTextAzure(
	text: string,
	lang: string,
	token: string,
	translateApiUrl: string
) {
	let res = "";
	const payload = JSON.stringify([{ text: text }]);
	const myHeaders = new Headers({
		"Ocp-Apim-Subscription-Key": token,
		"Ocp-Apim-Subscription-Region": "WestEurope",
		"Content-type": "application/json",
	});
	try {
		const response = await fetch(`${translateApiUrl}&to=${lang}`, {
			method: "POST",
			body: payload,
			headers: myHeaders,
		});
		const json = await response.json();
		if (json.error) {
			res = json.error.message;
		}
		else {
			res = json[0].translations[0].text;
		}
	}
	catch (err) {
		console.error(err);
	}

	return res;
}
