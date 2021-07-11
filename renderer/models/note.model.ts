export interface NoteWindowOptions {
	opacity: number;
	clickThrough: boolean;
	alwaysOnTop: boolean;
}

export interface Note {
	rawText: string;
	text: string;
	windowOptions: NoteWindowOptions;
	backgroundColor: string;
	owner: string;
	lastEdited: number;
	id: string;
	updatedAt: string
}