import React, { useState } from 'react';
import axios from 'axios';
import { Calendar, Thermometer, Wind, Droplets } from 'lucide-react';
import WeatherCard from './WeatherCard';

const HistoricalWeather = ({ location }) => {
    const [date, setDate] = useState('');
    const [historicalData, setHistoricalData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFetchHistorical = async () => {
        if (!date) {
            setError('Please select a date.');
            return;
        }

        setLoading(true);
        setError('');
        setHistoricalData(null);

        const apiKey = import.meta.env.VITE_WEATHERSTACK_API_KEY;
        const locationQuery = `${location.lat},${location.lon}`;

        try {
            const response = await axios.get(`http://api.weatherstack.com/historical`, {
                params: {
                    access_key: apiKey,
                    query: locationQuery,
                    historical_date: date,
                    units: 'm'
                }
            });

            if (response.data.error) {
                setError(response.data.error.info);
            } else {
                // The API returns historical data keyed by date, so we access it dynamically
                const dateKey = Object.keys(response.data.historical)[0];
                setHistoricalData(response.data.historical[dateKey]);
            }
        } catch (err) {
            setError('Failed to fetch historical data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="historical-container">
            <WeatherCard title="Historical Weather">
                <p>Search historical weather for: <strong>{location.name}, {location.country}</strong></p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center', marginTop: '1rem' }}>
                    <input
                        type="date"
                        className="glass-input"
                        style={{ maxWidth: '200px', margin: 0 }}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                    />
                    <button className="glass-button" onClick={handleFetchHistorical} disabled={loading}>
                        {loading ? 'Loading...' : 'Check Date'}
                    </button>
                </div>
                {error && <p style={{ color: '#ff6b6b', marginTop: '1rem' }}>{error}</p>}
            </WeatherCard>

            {historicalData && (
                <div className="weather-grid" style={{ marginTop: '2rem' }}>
                    <WeatherCard>
                        <h3>{historicalData.date}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                            <img
                                src={historicalData.hourly[0].weather_icons[0]}
                                alt="Weather Icon"
                                style={{ width: '64px', height: '64px', borderRadius: '8px' }}
                            />
                            <div>
                                <h2 style={{ margin: 0 }}>{historicalData.avgtemp}°C</h2>
                                <p style={{ margin: 0 }}>Min: {historicalData.mintemp}°C | Max: {historicalData.maxtemp}°C</p>
                            </div>
                        </div>
                    </WeatherCard>
                    <WeatherCard title="Day Details">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="weather-detail-item">
                                <Calendar size={20} />
                                <span>Dawn: {historicalData.astro.sunrise} / Dusk: {historicalData.astro.sunset}</span>
                            </div>
                            <div className="weather-detail-item">
                                <Thermometer size={20} />
                                <span>UV Index: {historicalData.uv_index}</span>
                            </div>
                        </div>
                    </WeatherCard>
                </div>
            )}
        </div>
    );
};

export default HistoricalWeather;
