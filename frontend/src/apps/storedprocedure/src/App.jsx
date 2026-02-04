import { Routes, Route } from 'react-router-dom';
import TranslatorUI from './components/TranslatorUI';
import DBConfigPage from './components/DBConfigPage';

function App() {
  return (
      <Routes>
        <Route path="/" element={<DBConfigPage />} />
        <Route path="translator" element={<TranslatorUI />} />
      </Routes>
  );
}

export default App;