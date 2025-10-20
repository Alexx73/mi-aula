import { HashRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Inicio from './pages/Inicio';
import Alphabet from './pages/Alphabet';
import Personal from './pages/PersonalInformation';
import Jobs from './pages/Jobs';
import PersonalQuestions from './pages/PersonalQuestions';
import Family from './pages/Family';


import NavBar from './components/NavBar';
import NavBar2 from './components/NavBar2';

function App() {
  return (
    <HashRouter>
      <NavBar/>
      <div className="pt-20 px-4 dark:bg-gray-800 min-h-screen dark:text-white">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/alphabet" element={<Alphabet />} />
          <Route path="/questions" element={<PersonalQuestions />} />
          <Route path="/family" element={<Family />} />
          <Route path="/jobs" element={<Jobs />} />
        </Routes>
       </div>
    </HashRouter>
  );
}

export default App;
