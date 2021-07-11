import React from "react";
import { TextInputContainer } from "../styles/input.style";
import { Main } from "../styles/main.style";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import styled from "styled-components";
import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { ipcRenderer } from "electron";

const NotesQuery = gql`
	query {
		notes {
			text
			rawText
			backgroundColor
			id
		}
	}
`;

const HeaderContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const MainComponent = () => {
	const [searchValue, setSearchValue] = useState("");

	const { loading, error, data } = useQuery(NotesQuery);

	console.log(
		data?.notes?.map(note => {
			<li>{note.text}</li>;
		})
	);

	return (
		<Main>
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
			<ul>
				{data?.notes?.map(note => (
					<li>
						<button
							onClick={() => {
								ipcRenderer.send("open note", note.id);
							}}
						>
							{note.text}
						</button>
					</li>
				))}
			</ul>
		</Main>
	);
};

export default MainComponent;
