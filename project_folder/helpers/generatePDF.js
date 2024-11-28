const puppeteer = require("puppeteer");
const tmp = require("tmp");
const fs = require("fs");
const env_config = require("../helpers/env/env_config");
const path = require("path");
let chromium_temp = null;
let data_browser = {};
if (env_config.APP_AREA === "DOCKER") {
	data_browser = {
		headless: "new",
		args: ["--no-sandbox", "--disabled-setuid-sandbox", "--disable-gpu"],
		executablePath: "/app/chrome/linux-116.0.5793.0/chrome-linux64/chrome",
		dumpio: true,
	};
} else if (env_config.APP_AREA === "WIN") {
	// "C:/Program Files/Google/Chrome/Application/chrome.exe"
	data_browser = {
		headless: "new",
		args: ["--no-sandbox", "--disabled-setuid-sandbox", "--disable-gpu"],
		executablePath: "C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe",
		dumpio: true,
	};
} else {
	data_browser = {
		headless: "new",
		args: ["--no-sandbox", "--disabled-setuid-sandbox", "--disable-gpu"],
		executablePath: "/usr/bin/chromium-browser",
		dumpio: true,
	};
}

const generatePDF = async ({ html = "", is_save = false, file_name = null, customCSS = undefined, typeCSS = undefined, locationCSS = undefined, landscape = false, size = "A4" }) => {
	const tmpDir = tmp.dirSync({ unsafeCleanup: true });
	let browser;
	let page;

	try {
		if (env_config.APP_AREA === "PM2") {
			chromium_temp = `/tmp/snap-private-tmp/snap.chromium/tmp/`;
		}

		// Get the last folder name
		const lastFolderName = path.basename(tmpDir.name);
		if (chromium_temp) {
			chromium_temp += lastFolderName;
		}

		data_browser.userDataDir = tmpDir.name;
		browser = await puppeteer.launch(data_browser);
		page = await browser.newPage();

		await page.setContent(html);
		if (customCSS !== undefined) {
			if (typeCSS === "url") {
				// await page.addStyleTag({url: 'http://example.com/style.css'})s
				await page.addStyleTag({ url: locationCSS });
			}

			if (typeCSS === "path") {
				// await page.addStyleTag({path: 'style.css'})
				await page.addStyleTag({ path: locationCSS });
			}

			if (typeCSS === "content") {
				// await page.addStyleTag({content: '.body{background: red}'})
				await page.addStyleTag({ content: locationCSS });
			}
		}

		if (size === "A5") {
			await page.setViewport({ width: 595, height: 842 }); // A5 size in pixels (72 DPI)
		} else if (size === "A4") {
			await page.setViewport({ width: 595, height: 842 }); // A4 size in pixels (72 DPI)
		}

		let pdfBuffer = null;
		if (is_save === true || is_save === "true") {
			if (!fs.existsSync("./assets/rekonsiliasi/cppt")) {
				fs.mkdirSync("./assets/rekonsiliasi/cppt", { recursive: true });
			}
			pdfBuffer = await page.pdf({ path: "./assets/rekonsiliasi/cppt/" + file_name, printBackground: true, landscape: landscape });
			return "success";
		} else {
			pdfBuffer = await page.pdf({
				printBackground: true,
				landscape: landscape,
			});
			return pdfBuffer;
		}
	} catch (error) {
		console.error("Error generating PDF:", error); // Handle and log error
		// Optional: throw or return a specific error response
		throw new Error(`Failed to generate PDF: ${error.message}`);
	} finally {
		if (page) {
			await page.close();
		}
		if (browser) {
			await browser.close();
		}
		// Delay temp directory cleanup to ensure files are not in use
		setTimeout(() => {
			try {
				tmpDir.removeCallback();
				if (chromium_temp) {
					fs.rmSync(chromium_temp, { recursive: true, force: true });
				}
				chromium_temp = null;
			} catch (error) {
				chromium_temp = null;
				console.error("Error during temp cleanup:", error);
			}
		}, 2000); // Adjust the delay as needed
	}
};

module.exports = {
	generatePDF: generatePDF,
};
