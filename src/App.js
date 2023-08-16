
import './App.css';
import Editor from './components/Editor';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

function App() {
  return (
    <Router>

      <Routes>
        <Route path='/' element={<Navigate replace to={`/docs/${uuidv4()}`} />} />
        <Route path='/docs/:id' element={<Editor />} />
      </Routes>
    </Router>
  );
}

export default App;
