import React, { useState } from 'react';
import axios from 'axios';
import './APIIntegration.css';

const APIIntegration = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [repoData, setRepoData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);

  const weatherAPIKey = '5e4a844ae02f3660b993c6f3daa63e04';
  const githubAPIKey = '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';

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=${weatherAPIKey}`
      );
      setWeatherData(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherData(null);
      setError('An error occurred while fetching weather data.');
    }
  };

  const fetchRepoData = async () => {
    try {
      const response = await axios.get(
        `https://api.github.com/users/${searchQuery}/repos`,
        {
          headers: {
            Authorization: `Bearer ${githubAPIKey}`,
          },
        }
      );
      setRepoData(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching repository data:', error);
      setRepoData(null);
      setError('An error occurred while fetching repository data.');
    }
  };

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(
        `https://api.github.com/users/${searchQuery}`
      );
      setProfileData(response.data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setProfileData(null);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      fetchWeatherData();
      fetchRepoData();
      fetchProfileData();
    } else {
      setError('Please enter a valid city or GitHub username.');
    }
  };

  const convertKelvinToCelsius = (temperature) => {
    return Math.round(temperature - 273.15);
  };

  return (
    <div className="container">
      <h1>API Integration</h1>
      <h3>Search Weather or GitHub Repositories</h3>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Enter city name or GitHub username"
      />
      <button onClick={handleSearch}>Search</button>
      {error && <p>{error}</p>}

      {weatherData && (
        <div>
          <h3>Weather in {weatherData.name}</h3>
          <p>Temperature: {convertKelvinToCelsius(weatherData.main.temp)} °C</p>
          <p>Description: {weatherData.weather[0].description}</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
        </div>
      )}

      {repoData && (
        <div className="Card">
          <div className="card-body">
            <h3 className="card-title">Repositories for {searchQuery}</h3>

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
                <div>
                  <h3>Profile Information for {searchQuery}</h3>
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
