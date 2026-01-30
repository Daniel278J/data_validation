import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Body from './components/Home';
import App1 from './apps/objvalidation/src/App';
import App2 from './apps/datavalidation/src/App';
import App3 from './apps/storedprocedure/src/App';
import App4 from './apps/appremidiation/src/App';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Body />} />
        <Route path="/objval/*" element={<App1 />} />
        <Route path="/dataval/*" element={<App2 />} />
        <Route path="/storedproc/*" element={<App3 />} />
        <Route path="/apprem/*" element={<App4 />} />
      </Routes>
    </Router>
  );
}

export default App;
