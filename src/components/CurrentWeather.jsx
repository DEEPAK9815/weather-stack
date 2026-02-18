import React from 'react';
import { Wind, Droplets, Gauge, Eye, Thermometer, MapPin } from 'lucide-react';
import WeatherCard from './WeatherCard';

const CurrentWeather = ({ data }) => {
    if (!data) return null;

    const { current, location } = data;

    return (
        <div className="weather-grid">
            <WeatherCard className="main-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem' }}>
                            <MapPin size={18} />
                            <span style={{ fontSize: '1.1rem' }}>{location.country}</span>
                        </div>
                        <h2 style={{ fontSize: '3rem', margin: 0, lineHeight: 1 }}>{location.name}</h2>
                        <p style={{ fontSize: '1.2rem', opacity: 0.8, marginTop: '0.5rem' }}>{location.localtime}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p className="subtitle" style={{ marginBottom: 0, fontSize: '1.5rem', color: '#fff' }}>{current.weather_descriptions[0]}</p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <h1 style={{ fontSize: '6rem', margin: 0, fontWeight: 200, lineHeight: 1 }}>{current.temperature}°</h1>

                    </div>
                    <img
                        src={current.weather_icons[0]}
                        alt={current.weather_descriptions[0]}
                        style={{ width: '128px', height: '128px', borderRadius: '16px', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.2))' }}
                    />
                </div>
                <div style={{ marginTop: '1rem', fontSize: '1.2rem', opacity: 0.8 }}>
                    Feels like <strong>{current.feelslike}°</strong>
                </div>
            </WeatherCard>

            <WeatherCard title="Current Details">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="weather-detail-item">
                        <Wind size={24} color="#4facfe" />
                        <div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Wind</div>
                            <div style={{ fontWeight: 600 }}>{current.wind_speed} km/h</div>
                        </div>
                    </div>
                    <div className="weather-detail-item">
                        <Droplets size={24} color="#4facfe" />
                        <div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Humidity</div>
                            <div style={{ fontWeight: 600 }}>{current.humidity}%</div>
                        </div>
                    </div>
                    <div className="weather-detail-item">
                        <Gauge size={24} color="#4facfe" />
                        <div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Pressure</div>
                            <div style={{ fontWeight: 600 }}>{current.pressure} mb</div>
                        </div>
                    </div>
                    <div className="weather-detail-item">
                        <Eye size={24} color="#4facfe" />
                        <div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Visibility</div>
                            <div style={{ fontWeight: 600 }}>{current.visibility} km</div>
                        </div>
                    </div>
                    <div className="weather-detail-item">
                        <Thermometer size={24} color="#4facfe" />
                        <div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>UV Index</div>
                            <div style={{ fontWeight: 600 }}>{current.uv_index}</div>
                        </div>
                    </div>
                    <div className="weather-detail-item">
                        <Wind size={24} color="#4facfe" style={{ transform: 'rotate(90deg)' }} />
                        <div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Direction</div>
                            <div style={{ fontWeight: 600 }}>{current.wind_dir}</div>
                        </div>
                    </div>
                </div>
            </WeatherCard>
        </div>
    );
};

export default CurrentWeather;
