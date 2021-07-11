import { app, ipcMain, shell } from "electron";
import serve from "electron-serve";

import { baseUrl, createWindow, isProd } from "./helpers";
import { sendMessageToWindow } from "./helpers/sendMessage";

if (isProd) {
	serve({ directory: "app" });
} else {
	app.setPath("userData", `${app.getPath("userData")} (development)`);
}
let mainWindow: Electron.BrowserWindow;
const startMainWindow = () => {
	mainWindow = createWindow(isProd ? "main" : Math.random() + "", {
		width: 320,
		height: 650,
		minWidth: 320,
		minHeight: 650,
	});

	mainWindow.loadURL(baseUrl());
	mainWindow.on("focus", () => sendMessageToWindow("focus", true, mainWindow));
	mainWindow.on("blur", () => sendMessageToWindow("focus", false, mainWindow));

	ipcMain.on("setAlwaysOnTop", (event, alwaysOnTop: boolean) => {
		mainWindow.setAlwaysOnTop(alwaysOnTop);
	});
};

const noteWindows: { [id: string]: Electron.BrowserWindow } = {};
const openNoteWindow = (id: string, opener: string) => {
	let window = noteWindows[id];
	if (window) {
		if (window.isMinimized()) window.restore();
		window.focus();
		return;
	}
	const openerWindow = noteWindows[opener] || mainWindow;
	const [x, y] = openerWindow.getPosition();
	const [width] = openerWindow.getSize();
	window = createWindow(id, {
		height: 300,
		width: 300,
		minHeight: 300,
		minWidth: 300,
		x: x + width + 25,
		y,
	});
	noteWindows[id] = window;
	window.loadURL(baseUrl(`notes/${id}`));
	window.on("close", () => (noteWindows[id] = null));
};

ipcMain.on("open note", (event, id, opener) => {
	openNoteWindow(id, opener);
});

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
