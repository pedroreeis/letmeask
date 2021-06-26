import { VscSignOut } from "react-icons/vsc";
import styled from "styled-components";

export const Container = styled.button`
	position: fixed;
	top: 1.5rem;
	right: 1.5rem;
	background: transparent;
	cursor: pointer;
	z-index: 50;
	border-radius: 8px;
`;

export const SignOutIcon = styled(VscSignOut)`
	font-size: 2.5rem;
	color: #835afd;
`;