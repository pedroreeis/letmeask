import { useTheme } from '../../hooks/useTheme';
import './styles.scss';

import btnImg from '../../assets/images/theme.svg'

export function ThemeSelector() {
  // eslint-disable-next-line
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="container1">
    <button onClick={toggleTheme}>
      <img src={btnImg} alt={theme}/>
    </button>
    </div>
  );
};
