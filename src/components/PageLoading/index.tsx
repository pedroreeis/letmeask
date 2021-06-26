import { BarLoader } from "react-spinners";

import logoImg from "../../assets/images/logo.svg";

import { Container, LogoIcon } from "./styles";

export const PageLoading: React.FC = () => (
	<Container>
		<LogoIcon src={logoImg} alt="Letmeask" />
		<BarLoader />
	</Container>
);