import React, { useState } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';
import CurrentWeather from './components/CurrentWeather';
import HistoricalWeather from './components/HistoricalWeather';
import MarineWeather from './components/MarineWeather';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('current');

  const fetchWeather = async (e) => {
    e.preventDefault();
    if (!city) return;

    setLoading(true);
    setError('');
    setWeatherData(null);
    setActiveTab('current'); // Reset to current on new search

    const apiKey = import.meta.env.VITE_WEATHERSTACK_API_KEY;

    try {
      const response = await axios.get(`http://api.weatherstack.com/current`, {
        params: {
          access_key: apiKey,
          query: city,
        }
      });

      if (response.data.error) {
        setError(response.data.error.info);
      } else {
        setWeatherData(response.data);
      }
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="app-container">
      <header>
        <h1>WeatherStack</h1>
        <p className="subtitle">Real-time World Weather, Historical & Marine Data</p>
      </header>

      <form onSubmit={fetchWeather} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input
          type="text"
          className="glass-input"
          placeholder="Enter city name (e.g., New York, London)..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit" className="glass-button" disabled={loading}>
          {loading ? 'Searching...' : <><Search size={18} style={{ marginRight: '8px' }} /> Search Weather</>}
        </button>
      </form>

      {error && (
        <div className="glass-panel" style={{ color: '#ff6b6b', marginTop: '1rem' }}>
          {error}
        </div>
      )}

      {weatherData && (
        <>
          <div className="tabs">
            <button
              className={`glass-button ${activeTab === 'current' ? 'active' : ''}`}
              onClick={() => handleTabChange('current')}
            >
              Current
            </button>
            <button
              className={`glass-button ${activeTab === 'historical' ? 'active' : ''}`}
              onClick={() => handleTabChange('historical')}
            >
              Historical
            </button>
            <button
              className={`glass-button ${activeTab === 'marine' ? 'active' : ''}`}
              onClick={() => handleTabChange('marine')}
            >
              Marine
            </button>
          </div>

          <main style={{ width: '100%', maxWidth: '1000px' }}>
            {activeTab === 'current' && <CurrentWeather data={weatherData} />}

            {activeTab === 'historical' && (
              <HistoricalWeather
                location={{
                  name: weatherData.location.name,
                  country: weatherData.location.country,
                  lat: weatherData.location.lat,
                  lon: weatherData.location.lon
                }}
              />
            )}

            {activeTab === 'marine' && (
              <MarineWeather
                location={{
                  name: weatherData.location.name,
                  lat: weatherData.location.lat,
                  lon: weatherData.location.lon
                }}
              />
            )}
          </main>
        </>
      )}
    </div>
  );
}

export default App;
