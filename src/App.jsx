import React, { useState } from 'react';
import axios from 'axios';
import { Search, CloudRain } from 'lucide-react';
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
    setActiveTab('current');

    const apiKey = import.meta.env.VITE_WEATHERSTACK_API_KEY;

    try {
      // Weatherstack Free Plan only supports HTTP.
      // If this app is served over HTTPS, the browser will block the request (Mixed Content).
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
      console.error(err);
      if (err.message === 'Network Error') {
        setError('Network Error. Note: Weatherstack Free API only supports HTTP. If you are on HTTPS, this request may be blocked.');
      } else {
        setError('Failed to fetch weather data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="app-container">
      <header style={{ marginTop: '4rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <CloudRain size={48} color="#fff" />
          <h1 className="text-gradient">WeatherStack</h1>
        </div>
        <p className="subtitle">Real-time World Weather, Historical & Marine Data</p>
      </header>

      <form onSubmit={fetchWeather} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
          <input
            type="text"
            className="glass-input"
            placeholder="Enter city name (e.g., New York, London)..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{ paddingRight: '3rem' }}
          />
          <Search
            size={20}
            style={{ position: 'absolute', right: '1.5rem', top: '1.2rem', color: 'rgba(255,255,255,0.5)' }}
          />
        </div>

        <button type="submit" className="glass-button" disabled={loading} style={{ minWidth: '150px' }}>
          {loading ? (
            'Searching...'
          ) : (
            'Get Weather'
          )}
        </button>
      </form>

      {error && (
        <div className="glass-panel" style={{ borderColor: '#ff6b6b', color: '#ff6b6b', marginTop: '1rem', maxWidth: '600px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {weatherData && (
        <div style={{ width: '100%', animation: 'fadeIn 0.5s ease' }}>
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

          <main style={{ width: '100%' }}>
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
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default App;
