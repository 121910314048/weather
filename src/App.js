import logo from './logo.svg';
import './App.css';
import {WeatherWidget} from './components/WeatherWidget';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <WeatherWidget />
      </header>
    </div>
  );
}

export default App;
