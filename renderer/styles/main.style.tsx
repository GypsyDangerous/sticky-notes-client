import styled from "styled-components";
import { motion } from "framer-motion";


export const Main = styled(motion.main)`
	display: flex;
	padding: 1rem;
	padding-top: 0;
	flex-direction: column;
	overflow: auto;
	max-height: calc(100vh - 30px);
`;
