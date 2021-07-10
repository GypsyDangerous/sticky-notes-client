import React from "react";
import { TextInputContainer } from "../styles/input.style";
import { Main } from "../styles/main.style";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import styled from "styled-components";

const HeaderContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`

const MainComponent = () => {
	return (
		<Main>
			<HeaderContainer>
				<h1>Sticky Notes</h1>
				<AddIcon />
			</HeaderContainer>
			<TextInputContainer>
				<input />
				<SearchIcon />
			</TextInputContainer>
		</Main>
	);
};

export default MainComponent;
