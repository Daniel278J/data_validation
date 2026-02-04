import './App.css';
import AppRemediation from './components/apprem'
import { Routes, Route } from 'react-router-dom';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<AppRemediation />} />
      </Routes>
    </div>
  );
}

export default App;
