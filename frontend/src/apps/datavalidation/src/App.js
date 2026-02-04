import './App.css';
import Dbconnection from './components/dbconnection';
import {Route,Routes} from 'react-router-dom';
import ResultPage from './components/results';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Dbconnection />} />
        <Route path="/results" element={<ResultPage />} />
      </Routes>
    </div>
  );
}

export default App;
