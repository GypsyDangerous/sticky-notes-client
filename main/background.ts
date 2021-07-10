import { app, ipcMain, shell } from "electron";
import serve from "electron-serve";

import { baseUrl, createWindow, isProd } from "./helpers";
import { sendMessageToWindow } from "./helpers/sendMessage";

if (isProd) {
	serve({ directory: "app" });
} else {
	app.setPath("userData", `${app.getPath("userData")} (development)`);
}

const startMainWindow = () => {
	const mainWindow = createWindow(isProd ? "main" : Math.random() + "", {
		width: 320,
		height: 650,
	});

	mainWindow.loadURL(baseUrl("main"));
	mainWindow.on("focus", () => sendMessageToWindow("focus", true, mainWindow));
	mainWindow.on("blur", () => sendMessageToWindow("focus", false, mainWindow));

	ipcMain.on("setAlwaysOnTop", (event, alwaysOnTop: boolean) => {
		mainWindow.setAlwaysOnTop(alwaysOnTop);
	});
};

(async () => {
	await app.whenReady();

	app.on("web-contents-created", (e, contents) => {
		contents.on("will-navigate", (event, url) => {
			if (url.includes("localhost")) return;
			event.preventDefault();
			shell.openExternal(url);
			console.log("blocked navigate:", url);
		});
		contents.on("new-window", (event, url) => {
			if (url.includes("localhost")) return;
			event.preventDefault();
			shell.openExternal(url);
			console.log("blocked window:", url);
		});
	});

	startMainWindow();
})();

app.on("window-all-closed", () => {
	app.quit();
});
