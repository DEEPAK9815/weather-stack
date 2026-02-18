import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Waves, Anchor, Compass, Clock, Droplets, Wind } from 'lucide-react';
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
                    setError(response.data.error.info || "Marine data is not available on your current plan.");
                } else {
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
                <div style={{ color: '#ff6b6b', textAlign: 'center' }}>
                    <Waves size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <p>{error}</p>
                </div>
            </WeatherCard>
        );
    }

    if (!marineData) return null;

    const currentHour = marineData.hourly[0];

    return (
        <div className="marine-container">
            <div style={{ textAlign: 'left', marginBottom: '2rem', paddingLeft: '1rem' }}>
                <h2 style={{ fontSize: '2.5rem', margin: 0 }}>Marine Conditions</h2>
                <p style={{ opacity: 0.7, margin: 0 }}>{location.name}</p>
            </div>

            <div className="weather-grid">
                <WeatherCard title="Sea State">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="weather-detail-item">
                            <Waves size={32} color="#4facfe" />
                            <div>
                                <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Swell Height</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{currentHour.swell_height} m</div>
                            </div>
                        </div>
                        <div className="weather-detail-item">
                            <Clock size={32} color="#4facfe" />
                            <div>
                                <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Swell Period</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{currentHour.swell_period_secs} s</div>
                            </div>
                        </div>
                        <div className="weather-detail-item">
                            <Compass size={32} color="#4facfe" />
                            <div>
                                <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Swell Dir</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{currentHour.swell_dir_16_point}</div>
                            </div>
                        </div>
                        <div className="weather-detail-item">
                            <Droplets size={32} color="#4facfe" />
                            <div>
                                <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Water Temp</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{currentHour.water_temp}°C</div>
                            </div>
                        </div>
                    </div>
                </WeatherCard>

                <WeatherCard title="Tides & Wind">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1rem', opacity: 0.7, marginBottom: '0.5rem' }}>Tide Schedule</h3>
                            {marineData.tides && marineData.tides.length > 0 ? (
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {marineData.tides.map((tide, index) => (
                                        <li key={index} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            padding: '0.8rem',
                                            marginBottom: '0.5rem',
                                            background: 'rgba(255,255,255,0.05)',
                                            borderRadius: '8px'
                                        }}>
                                            <span style={{ fontWeight: 600, color: tide.tide_type === 'HIGH' ? '#ff9a9e' : '#a18cd1' }}>{tide.tide_type}</span>
                                            <span>{tide.tideTime}</span>
                                            <span style={{ opacity: 0.7 }}>{tide.tideHeight_mt}m</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p style={{ opacity: 0.5 }}>No tide data available.</p>
                            )}
                        </div>

                        <div className="weather-detail-item" style={{ marginTop: 'auto' }}>
                            <Wind size={24} color="#4facfe" />
                            <div>
                                <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Wind Wave Height</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{currentHour.wind_wave_height} m</div>
                            </div>
                        </div>
                    </div>
                </WeatherCard>
            </div>
        </div>
    );
};

export default MarineWeather;
