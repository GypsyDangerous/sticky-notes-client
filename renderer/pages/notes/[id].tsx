import "quill/dist/quill.snow.css"; // Add css for snow theme
import { useQuill } from "react-quilljs";
import { useEffect } from "react";
import styled from "styled-components";
import chroma from "chroma-js";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { debounce } from "lodash";
import { useCallback } from "react";

const NoteQuery = gql`
	query getNote($id: ID!) {
		note(id: $id) {
			rawText
			text
		}
	}
`;

const NoteMutation = gql`
	mutation updateNote($id: ID!, $text: String!, $rawText: String!) {
		updateNote(id: $id, text: $text, rawText: $rawText) {
			text
			rawText
		}
	}
`;

const QuillContainer = styled.div`
	height: calc(100vh - 30px);
	width: 100vw;
	display: flex;
	flex-direction: column-reverse;
	&,
	*,
	*:before {
		color: ${(props: { backgroundColor: string }) =>
			chroma(props.backgroundColor).luminance() > 0.5 ? "black" : "white"} !important;
	}
	div {
		border: none !important;
	}
	background: ${(props: { backgroundColor: string }) => props.backgroundColor};
`;

const Note = () => {
	const theme = "snow";
	// const theme = 'bubble';

	const router = useRouter();

	const { id } = router.query;

	const { loading, error, data } = useQuery(NoteQuery, {
		variables: { id: id || "no id" },
	});

	const [updateNote] = useMutation(NoteMutation);

	const options = [
		"bold",
		"italic",
		"underline",
		"strike",
		"list",
		"blockquote",
		"code-block",
		{ list: "ordered" },
		{ list: "bullet" },
	];
	const modules = {
		toolbar: options,
	};

	const placeholder = "Take a Note...";

	const formats = options;
	const { quill, quillRef } = useQuill({ theme, modules, formats, placeholder });
	useEffect(() => {
		if (data && quill) {
			quill.setContents([{ insert: "\n" }]);
			quill.clipboard.dangerouslyPasteHTML(data.note.rawText);
		}
	}, [data, quill]);

	const onChange = useCallback(
		debounce((delta, prev) => {
			if (!id) return;
			const editor = document.getElementsByClassName("ql-editor")[0] as HTMLElement;
			updateNote({ variables: { id, rawText: editor.innerHTML, text: editor.innerText } });
		}, 1000),
		[id, router.query, router]
	);

	useEffect(() => {
		if (quill) {
			quill.on("text-change", onChange);
			return () => {
				quill.off("text-change", onChange);
			};
		}
	}, [quill]);

	return (
		<QuillContainer backgroundColor="#FFFF88">
			<div id="quill-editor" ref={quillRef} />
		</QuillContainer>
	);
};

export default Note;
