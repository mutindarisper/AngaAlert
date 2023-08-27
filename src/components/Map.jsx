import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './Map.css'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const Map = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng] = useState(0.02);
    const [lat] = useState(37.9);
    const [zoom] = useState(6);
    // const [API_KEY] = useState('YOUR_MAPTILER_API_KEY_HERE');
    const zoomin = () => {
        map.current.setZoom(map.current.getZoom() + 0.5)
      }
      
      const zoomout = () => {
        map.current.setZoom(map.current.getZoom() - 1)
      }
      

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
    <> 
     {/* <div className="map-wrap"> */}
      <div ref={mapContainer} className="map" />
      <div className="gas_container">
        
           <button className="btn" type="button">
  <p className="gasses">CO</p>
  <div id="container-stars">
    <div id="stars"></div>
  </div>

  <div id="glow">
    <div className="circle"></div>
    <div className="circle"></div>
  </div>
</button>

            <button className="btn" type="button">
  <p className="gasses">NO2</p>
  <div id="container-stars">
    <div id="stars"></div>
  </div>

  <div id="glow">
    <div className="circle"></div>
    <div className="circle"></div>
  </div>
</button>

           <button className="btn" type="button">
  <p className="gasses">Ozone</p>
  <div id="container-stars">
    <div id="stars"></div>
  </div>

  <div id="glow">
    <div className="circle"></div>
    <div className="circle"></div>
  </div>
</button>

           <button className="btn" type="button">
  <p className="gasses">PM 10</p>
  <div id="container-stars">
    <div id="stars"></div>
  </div>

  <div id="glow">
    <div className="circle"></div>
    <div className="circle"></div>
  </div>
</button>

      <button className="btn" type="button">
  <p className="gasses">PM 2.5</p>
  <div id="container-stars">
    <div id="stars"></div>
  </div>

  <div id="glow">
    <div className="circle"></div>
    <div className="circle"></div>
  </div>
</button>

      <button className="btn" type="button">
  <p className="gasses">S02</p>
  <div id="container-stars">
    <div id="stars"></div>
  </div>

  <div id="glow">
    <div className="circle"></div>
    <div className="circle"></div>
  </div>
</button>

     <div className="mapcontrols">
        <AddIcon onClick={zoomin} />
        <div className='separate' style={{width:'30px', border:' grey 1px solid'}}>
        </div>
        <RemoveIcon onClick={zoomout}/>
       
     </div>

      </div>
      
    {/* //</div> */}
    </>
   
  )
}

export default Map