import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import logo from './bgimage.jpg';
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
