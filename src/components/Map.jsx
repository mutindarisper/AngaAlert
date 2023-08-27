import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './Map.css'

const Map = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng] = useState(0.02);
    const [lat] = useState(37.9);
    const [zoom] = useState(6);
    // const [API_KEY] = useState('YOUR_MAPTILER_API_KEY_HERE');

    useEffect(() => {
        if (map.current) return; // stops map from intializing more than once
      
        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: 'https://api.maptiler.com/maps/basic-v2-dark/style.json?key=gDjHROdldKK6ldBgBl9v',
        //   `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`,
          center: [ lat,lng],
          zoom: zoom
        });
      
      }, [ lng, lat, zoom]);
  return (
    // <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    // </div>
  )
}

export default Map