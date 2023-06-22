import React, { useState } from 'react';
import axios from 'axios';
import './APIIntegration.css'

const APIIntegration = () => {
  // State for weather API
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [weatherError, setWeatherError] = useState(null);

  // State for GitHub API
  const [username, setUsername] = useState('');
  const [repoData, setRepoData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [repoError, setRepoError] = useState(null);

  const weatherAPIKey = '5e4a844ae02f3660b993c6f3daa63e04'; 
  const githubAPIKey = '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' ; 

  // Fetch weather data from OpenWeatherMap API
  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherAPIKey}`
      );
      setWeatherData(response.data);
      setWeatherError(null);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherData(null);
      setWeatherError('An error occurred while fetching weather data.');
    }
  };

  // Fetch repository data from GitHub API
  const fetchRepoData = async () => {
    try {
      const response = await axios.get(
        `https://api.github.com/users/${username}/repos`,
        {
          headers: {
            Authorization: `Bearer ${githubAPIKey}`,
          },
        }
      );

      axios
      .get(`https://api.github.com/users/${username}`)
      .then((response) => {
        setProfileData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
      setRepoData(response.data);
      setRepoError(null);
    } catch (error) {
      console.error('Error fetching repository data:', error);
      setRepoData(null);
      setRepoError('An error occurred while fetching repository data.');
    }
  };

  const handleWeatherSearch = () => {
    if (city.trim() !== '') {
      fetchWeatherData();
    } else {
      setWeatherError('Please enter a valid city name.');
    }
  };

  const handleRepoSearch = () => {
    if (username.trim() !== '') {
      fetchRepoData();
    } else {
      setRepoError('Please enter a valid GitHub username.');
    }
  };

  const convertKelvinToCelsius = (temperature) => {
    return Math.round(temperature - 273.15);
  };

  return (
    <div className="container">
      <h1>Weather API</h1>
      <h3>Enter City Name to Search their Weather Status.</h3>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city name"
      />
      <button onClick={handleWeatherSearch}>Search Weather</button>
      {weatherError && <p>{weatherError}</p>}
      {weatherData && (
        <div>
          <h3>Weather in {weatherData.name}</h3>
          <p>Temperature: {convertKelvinToCelsius(weatherData.main.temp)} °C</p>
          <p>Description: {weatherData.weather[0].description}</p>
          <p>Humidity: {weatherData.main.humidity}%</p>

        </div>
      )}

      <h1>GitHub API</h1>
      <h3>Enter GitHub Username to Search Their Repositories.</h3>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter GitHub username"
      />
      <button onClick={handleRepoSearch}>Search Repositories</button>
      {repoError && <p>{repoError}</p>}
      {repoData && (
        <div className="Card">
            <div className="card-body">
          <h3 className="card-title">Repositories for {username}</h3>
          
          {repoData.length > 0 ? (
            <ul className="card-text">
              {repoData.map((repo) => (
                <li key={repo.id}>{repo.name}</li>
              ))}
            </ul>
            
            
          ) : (
            <p>No repositories found.</p>
          )}
          {profileData && (
        <div>
          <div >
            <h3>Profile Information for {username}</h3>
            <p>Login: {profileData.login}</p>
            <p>Name: {profileData.name}</p>
            <p>Location: {profileData.location}</p>
            <p>Public Repositories: {profileData.public_repos}</p>
            <p>Followers: {profileData.followers}</p>
            <p>Following: {profileData.following}</p>
          </div>
        </div>
      )}
          </div>
        </div>
      )}
    </div>
  );
};

export default APIIntegration;
