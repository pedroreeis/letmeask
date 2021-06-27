import { useAuth } from "../../hooks/useAuth";

import { SignOutIcon } from './styles'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss'
import { Dropdown } from 'react-bootstrap'

export const SignOut: React.FC = () => {
	const { user, signOut } = useAuth();

	if (!user) {
		return <></>;
	}

	return (
		<Dropdown aria-label="Menu" className="position">
			<Dropdown.Toggle variant="undefined" id="dropdown-basic">
				<SignOutIcon />
			</Dropdown.Toggle>

			<Dropdown.Menu>
				<Dropdown.Item onClick={signOut}>Log Out</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	);
};