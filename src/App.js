import './App.scss';
import ListContainer from './routes/ListContainer';
import StatsContainer from './routes/StatsContainer';
import GameDetailContainer from './routes/GameDetailContainer';
import SearchResultsContainer from './routes/SearchResultsContainer';
import NavBar from './components/NavBar';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <div className="container-xxl">
        <NavBar />
        <Routes>
            <Route path ='/' element={<ListContainer />} />
            <Route path ='stats' element={<StatsContainer />} />
            <Route path ='search/:string' element={<SearchResultsContainer />} />
            <Route path = 'game/:game' element={<GameDetailContainer />} />
        </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
