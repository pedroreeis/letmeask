import  { BrowserRouter, Route, Switch } from 'react-router-dom'

import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { Room } from './pages/Room';
import { AdminRoom } from './pages/AdminRoom';
import { SignOut } from "./components/SignOut";

import { AuthContextProvider } from './contexts/AuthContext'
import { ThemeContextProvider } from './contexts/ThemeContext';
import ThemeSelector from './components/ThemeSelector';


function App() {
  return (
    <BrowserRouter>
      <ThemeContextProvider>
       <AuthContextProvider>
         <SignOut />
         <ThemeSelector />
        <Switch>
         <Route path="/" exact component={Home} />
         <Route path="/rooms/new" component={NewRoom} />
         <Route path="/rooms/:id" component={Room} />
         <Route path="/admin/rooms/:id" component={AdminRoom} />
        </Switch>
       </AuthContextProvider>
      </ThemeContextProvider>
    </BrowserRouter>
  );
}

export default App; 
