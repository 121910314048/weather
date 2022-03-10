import { useEffect, useState, useLayoutEffect } from "react";
import axios from "axios";
import {SpinnerWidget} from "../SpinnerWidget";
import WeatherSVG from "../WeatherSVG/WeatherSVG";
import NoLocAccess from "../NoLocAccess/NoLocAccess";
import "./WeatherWidget.css";

const formatURL = (lat, long) => {
  // api call:
  // api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
  const API_ENDPOINT = "https://api.openweathermap.org/data/2.5/weather?units=metric";
  const API_KEY = "d347af1c43167e54f44b2baa2cf7a293";

  console.log(`${API_ENDPOINT + `&lat=${lat}&lon=${long}&appid=${API_KEY}`}`)
  return API_ENDPOINT + `&lat=${lat}&lon=${long}&appid=${API_KEY}`;
};

const formatStatusDesc = (str) => {
  const lower = str.toLowerCase();
  return str.charAt(0).toUpperCase() + lower.slice(1);
};

const WeatherWidget = (props) => {
  const [hasLocationAccess, setHasLocationAccess] = useState(null);
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
  const [weatherInfo, setWeatherInfo] = useState({
    location: null,
   // status: null,
    statusDescription: null,
    temp: null,
   // humidity: null,
    //windspeed: null,
  });
  const [loading, setLoading] = useState(false);

  const fetchInfo = async (lat, lon) => {
    console.log("lat: ", lat, ", lon: ", lon);
    return new Promise((resolve) => {
      axios.get(formatURL(lat, lon))
      .then((response) => {
        const data = response.data;
        resolve({
          location: data.name,
          //status: data.weather[0].main,
          statusDescription: formatStatusDesc(data.weather[0].description),
          temp: data.main.temp,
         // humidity: data.main.humidity,
          //windspeed: data.wind.speed,
        });
      });
    })
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((queryResponse) => {
          if (queryResponse.state === "granted") {
            navigator.geolocation.watchPosition((pos) => {
              console.log(pos);
              setCoordinates({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude
              });
              setHasLocationAccess(true);
              setLoading(true);
              fetchInfo(pos.coords.latitude, pos.coords.longitude)
              .then((data) => {
                setWeatherInfo(data);
                setLoading(false);
              });
            });
          }
          else if (queryResponse.state === "prompt") {
            const options = {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0
            }
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                setCoordinates({
                  latitude: pos.coords.latitude,
                  longitude: pos.coords.longitude
                });
                setHasLocationAccess(true);
                setLoading(true);
                fetchInfo(pos.coords.latitude, pos.coords.longitude)
                .then((data) => {
                  setWeatherInfo(data);
                  setLoading(false);
                });
              },
              (err) => {
                console.warn(`ERROR(${err.code}): ${err.msg}`);
                setHasLocationAccess(false);
              },
              options
            );
          }
          else if (queryResponse.state === "denied") {
            setHasLocationAccess(false);
          }
        })
    }
    else {
      // Geo Location Navigator not supported
    }
  }, []);
   return(
    <>
      {hasLocationAccess
        ? <>
            
              <div className="status">
                <span className="status__title">{weatherInfo.status}</span>
                <span className="status__desc">{weatherInfo.statusDescription}</span>
              </div>
              <div className="others">
                <div className="temperature">
                  <span>Temperature: </span>
                  <code>{weatherInfo.temp} °Celcius</code>
                </div>
               <div className="card">
              <div className="location">
                <span>{weatherInfo.location}</span>
              </div>
              </div>
            </div>
          </>
        : <NoLocAccess />
      }
      <WeatherSVG />
    </>
  );
};

export default WeatherWidget;