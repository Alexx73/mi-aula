import { HashRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Inicio from './pages/Inicio';
import Alphabet from './pages/Alphabet';
import Personal from './pages/PersonalInformation';


import NavBar from './components/NavBar';
import NavBar2 from './components/NavBar2';

function App() {
  return (
    <HashRouter>
      <NavBar/>
      <div className="pt-20 px-4 dark:bg-gray-900 min-h-screen dark:text-white">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/alphabet" element={<Alphabet />} />
          <Route path="/questions" element={<Personal />} />
          {/* <Route path="/about" element={<About />} /> */}
        </Routes>
       </div>
    </HashRouter>
  );
}

export default App;
