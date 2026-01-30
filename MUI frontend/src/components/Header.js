import logo from './images/accenture_dark.png'
import './header.css'
import { Link } from 'react-router-dom';
function Header() {

    return (
        <Link to="/">
            <header className='App-header'>
                <img src={logo} className="App-logo" alt="logo" />
                <span className='Header-title'>Data Migration Tool</span>
            </header>
        </Link>
    );
}
export default Header;