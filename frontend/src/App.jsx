import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogSig from './logsign';
import Dash from './dash';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogSig />} />
        <Route path="/dash" element={<Dash />} />
      </Routes>
    </Router>
  );
}
