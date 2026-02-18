import React, { useState } from 'react';
import { Calendar, Thermometer, Sun, Moon } from 'lucide-react';
import WeatherCard from './WeatherCard';
import { fetchWithFallback } from '../utils/api';

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
            const data = await fetchWithFallback(`http://api.weatherstack.com/historical`, {
                params: {
                    access_key: apiKey,
                    query: locationQuery,
                    historical_date: date,
                    units: 'm'
                }
            });

            if (data.error) {
                setError(data.error.info);
            } else {
                const dateKey = Object.keys(data.historical)[0];
                setHistoricalData(data.historical[dateKey]);
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
            <WeatherCard title="Historical Data Archive">
                <p style={{ marginBottom: '1.5rem', opacity: 0.8 }}>
                    Explore past weather conditions for <strong>{location.name}, {location.country}</strong>
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                        type="date"
                        className="glass-input"
                        style={{ maxWidth: '200px', margin: 0, colorScheme: 'dark' }}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                    />
                    <button className="glass-button" onClick={handleFetchHistorical} disabled={loading}>
                        {loading ? 'Retrieving Data...' : 'Check History'}
                    </button>
                </div>
                {error && <div style={{ color: '#ff6b6b', marginTop: '1rem', padding: '0.5rem', background: 'rgba(255,0,0,0.1)', borderRadius: '8px' }}>{error}</div>}
            </WeatherCard>

            {historicalData && (
                <div className="weather-grid" style={{ marginTop: '2rem' }}>
                    <WeatherCard>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#fff' }}>{historicalData.date}</h3>
                            <Calendar size={24} style={{ opacity: 0.7 }} />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', margin: '2rem 0' }}>
                            <img
                                src={historicalData.hourly[0].weather_icons[0]}
                                alt="Weather Icon"
                                style={{ width: '80px', height: '80px', borderRadius: '12px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}
                            />
                            <div>
                                <h2 style={{ margin: 0, fontSize: '4rem', fontWeight: 200, lineHeight: 1 }}>{historicalData.avgtemp}°</h2>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', opacity: 0.8 }}>
                                    <span>L: {historicalData.mintemp}°</span>
                                    <span>H: {historicalData.maxtemp}°</span>
                                </div>
                            </div>
                        </div>
                    </WeatherCard>

                    <WeatherCard title="Astronomical & Details">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="weather-detail-item">
                                <Sun size={24} color="#f6d365" />
                                <div>
                                    <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Sunrise</div>
                                    <div style={{ fontWeight: 600 }}>{historicalData.astro.sunrise}</div>
                                </div>
                            </div>
                            <div className="weather-detail-item">
                                <Moon size={24} color="#d4fc79" />
                                <div>
                                    <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Sunset</div>
                                    <div style={{ fontWeight: 600 }}>{historicalData.astro.sunset}</div>
                                </div>
                            </div>
                            <div className="weather-detail-item">
                                <Thermometer size={24} color="#4facfe" />
                                <div>
                                    <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>UV Index</div>
                                    <div style={{ fontWeight: 600 }}>{historicalData.uv_index}</div>
                                </div>
                            </div>
                            <div className="weather-detail-item">
                                <Moon size={24} style={{ opacity: 0.5 }} />
                                <div>
                                    <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Moon Phase</div>
                                    <div style={{ fontWeight: 600 }}>{historicalData.astro.moon_phase}</div>
                                </div>
                            </div>
                        </div>
                    </WeatherCard>
                </div>
            )}
        </div>
    );
};

export default HistoricalWeather;
