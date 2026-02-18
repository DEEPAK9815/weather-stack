import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Waves, Anchor, Compass, Clock } from 'lucide-react';
import WeatherCard from './WeatherCard';

const MarineWeather = ({ location }) => {
    const [marineData, setMarineData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMarineData = async () => {
            setLoading(true);
            setError('');
            const apiKey = import.meta.env.VITE_WEATHERSTACK_API_KEY;
            // Marine API requires lat/lon
            const query = `${location.lat},${location.lon}`;

            try {
                const response = await axios.get(`http://api.weatherstack.com/marine`, {
                    params: {
                        access_key: apiKey,
                        query: query,
                        units: 'm',
                        hourly: 1
                    }
                });

                if (response.data.error) {
                    // Some plans might not support marine data, handle gracefully
                    setError(response.data.error.info || "Marine data is not available on your current plan.");
                } else {
                    // Get today's forecast
                    const todayKey = Object.keys(response.data.forecast)[0];
                    setMarineData(response.data.forecast[todayKey]);
                }

            } catch (err) {
                setError('Failed to fetch marine data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (location) {
            fetchMarineData();
        }
    }, [location]);

    if (loading) return <div className="loader"></div>;

    if (error) {
        return (
            <WeatherCard>
                <p style={{ color: '#ff6b6b' }}>{error}</p>
            </WeatherCard>
        );
    }

    if (!marineData) return null;

    const currentHour = marineData.hourly[0]; // Simplified for demo, ideally match closest hour

    return (
        <div className="marine-container">
            <h2>Marine Weather for {location.name}</h2>
            <div className="weather-grid">
                <WeatherCard title="Sea Conditions">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="weather-detail-item">
                            <Waves size={20} />
                            <span>Swell Height: {currentHour.swell_height} m</span>
                        </div>
                        <div className="weather-detail-item">
                            <Compass size={20} />
                            <span>Swell Dir: {currentHour.swell_dir_16_point} ({currentHour.swell_dir}°)</span>
                        </div>
                        <div className="weather-detail-item">
                            <Clock size={20} />
                            <span>Swell Period: {currentHour.swell_period_secs}s</span>
                        </div>
                        <div className="weather-detail-item">
                            <Anchor size={20} />
                            <span>Water Temp: {currentHour.water_temp}°C</span>
                        </div>
                    </div>
                </WeatherCard>

                <WeatherCard title="Tides">
                    {marineData.tides && marineData.tides.length > 0 ? (
                        <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
                            {marineData.tides.map((tide, index) => (
                                <li key={index} style={{ marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                                    <strong>{tide.tide_type}</strong>: {tide.tideTime} ({tide.tideHeight_mt}m)
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No tide data available.</p>
                    )}
                </WeatherCard>
            </div>
        </div>
    );
};

export default MarineWeather;
