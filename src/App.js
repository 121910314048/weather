import "bootstrap\dist\css\bootstrap.css";
import './App.css';
import {WeatherWidget} from './components/WeatherWidget';

function App() {
  return (
    <div className="App">
    <img src='./bgimage.jpg'></img>
      <header className="App-header">
      <button type="button" className="btn btn-primary">Primary</button>
        <WeatherWidget />
      </header>
    </div>
  );
}

export default App;
