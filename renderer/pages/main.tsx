import React from "react";
import { TextInputContainer } from "../styles/input.style";
import { Main } from "../styles/main.style";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import styled from "styled-components";
import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { ipcRenderer } from "electron";
import { Note } from "../models/note.model";

const NotesQuery = gql`
	query {
		notes {
			text
			rawText
			backgroundColor
			id
			lastedEdited
			updatedAt
		}
	}
`;

const HeaderContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const NoteButton = styled.button`
	background: none;
	outline: none;
	border: none;
	padding: 0.75rem;
	border-top: ${(props: { color }) => `3px solid ${props.color}`};
	width: 100%;
	text-align: left;
	color: white;
	font-size: 0.75rem;
	background: var(--background-light-gray);
	padding-top: 0.3rem;
`;

const NoteList = styled.ul`
	margin-top: 0.75rem !important;
	display: flex;
	flex-direction: column;
	gap: 1rem;
`;

const NoteHeader = styled.div`
	width: 100%;
	text-align: right;
	color: ${(props: { color }) => `${props.color}`};
	font-size: 0.6rem;
`;

const NotesHeader = styled.div`
	position: sticky;
	top: 0;
	background: var(--background-dark-gray);
	z-index: 100;
	height: fit-content;
`;

const MainComponent = () => {
	const [searchValue, setSearchValue] = useState("");

	const { loading, error, data } = useQuery<{ notes: Note[] }>(NotesQuery);

	return (
		<Main>
			<NotesHeader>
				<HeaderContainer>
					<h1>Sticky Notes</h1>
					<AddIcon />
				</HeaderContainer>
				<TextInputContainer>
					<input
						type="text"
						value={searchValue}
						placeholder="Search..."
						onChange={e => setSearchValue(e.target.value)}
					/>
					<SearchIcon />
				</TextInputContainer>
			</NotesHeader>
			<NoteList>
				{data?.notes?.map((note: Note) => (
					<li>
						<NoteButton
							color={note.backgroundColor}
							onClick={() => {
								ipcRenderer.send("open note", note.id);
							}}
						>
							<NoteHeader color={note.backgroundColor}>
								{new Date(+note.updatedAt).toLocaleTimeString()}
							</NoteHeader>
							<div>{note.text.trim().length ? note.text : "Take a note..."}</div>
						</NoteButton>
					</li>
				))}
			</NoteList>
		</Main>
	);
};

export default MainComponent;
