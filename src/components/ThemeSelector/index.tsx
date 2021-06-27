import { useTheme } from '../../hooks/useTheme';
import './styles.scss';

import btnImg from '../../assets/images/theme.svg'

function ThemeSelector() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="container">
    <button onClick={toggleTheme}>
      <img src={btnImg} alt={`Alterar Tema: ${theme}`}/>
    </button>
    </div>
  );
};

export default ThemeSelector;
