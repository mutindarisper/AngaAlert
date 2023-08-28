import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './Map.css'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from 'axios'

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





 map.current.on('load', async () => {
        // Add a geojson point source.
        // Heatmap layers also work with a vector tile source.
        const response = await axios.get('https://api.ambeedata.com/latest/by-country-code?countryCode=KE&x-api-key=100185d0ef77f44a0e3f2608acf2516bd6ff0a6a97232bbe0a76b986b7c123cf')
        console.log(response.data)
        var dataset = response.data
        let mygeojson = {"type": "FeatureCollection", "features": []}

        for (var i = 0; i < dataset.stations.length; i++) {
            var feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        dataset.stations[i].lng,
                        dataset.stations[i].lat
                    ]
                },
                "properties": {
                    "title": dataset.stations[i].city,
                    "description": dataset.stations[i].countryCode
                }
            }
            mygeojson.features.push(feature)
        }
        console.log(mygeojson, 'mygeojson')
        // map.current.addSource('mygeojson', {
        //     "type": "geojson",
        //     "data": mygeojson
        // });
     
        // for (let i = 0; i < dataset.stations.length; i++) {
        //   let coordinate = [parseFloat(dataset.stations[0].lng), parseFloat(dataset.stations[0].lat)];
        //   // let coordinate = [parseFloat(dataset.stations[0].lng), parseFloat(dataset.stations[0].lat)];
        //   // let properties = point;
        //    console.log(coordinate);
        // }
                    
          // let feature = {"type": "Feature", "geometry": {"type": "Point", "coordinates": coordinate}, "properties": properties}
          // mygeojson.features.push(feature);
     
        // map.addSource('airquality', {
        //     'type': 'geojson',
        //     'data':
        //         'https://api.ambeedata.com/latest/by-country-code?countryCode=KE&x-api-key=100185d0ef77f44a0e3f2608acf2516bd6ff0a6a97232bbe0a76b986b7c123cf'
        // });

        // map.addLayer(
        //     {
        //         'id': 'airquality-heat',
        //         'type': 'heatmap',
        //         'source': 'airquality',
        //         'maxzoom': 9,
        //         'paint': {
        //             // Increase the heatmap weight based on frequency and property magnitude
        //             'heatmap-weight': [
        //                 'interpolate',
        //                 ['linear'],
        //                 ['get', 'mag'],
        //                 0,
        //                 0,
        //                 6,
        //                 1
        //             ],
        //             // Increase the heatmap color weight weight by zoom level
        //             // heatmap-intensity is a multiplier on top of heatmap-weight
        //             'heatmap-intensity': [
        //                 'interpolate',
        //                 ['linear'],
        //                 ['zoom'],
        //                 0,
        //                 1,
        //                 9,
        //                 3
        //             ],
        //             // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
        //             // Begin color ramp at 0-stop with a 0-transparancy color
        //             // to create a blur-like effect.
        //             'heatmap-color': [
        //                 'interpolate',
        //                 ['linear'],
        //                 ['heatmap-density'],
        //                 0,
        //                 'rgba(33,102,172,0)',
        //                 0.2,
        //                 'rgb(103,169,207)',
        //                 0.4,
        //                 'rgb(209,229,240)',
        //                 0.6,
        //                 'rgb(253,219,199)',
        //                 0.8,
        //                 'rgb(239,138,98)',
        //                 1,
        //                 'rgb(178,24,43)'
        //             ],
        //             // Adjust the heatmap radius by zoom level
        //             'heatmap-radius': [
        //                 'interpolate',
        //                 ['linear'],
        //                 ['zoom'],
        //                 0,
        //                 2,
        //                 9,
        //                 20
        //             ],
        //             // Transition from heatmap to circle layer by zoom level
        //             'heatmap-opacity': [
        //                 'interpolate',
        //                 ['linear'],
        //                 ['zoom'],
        //                 7,
        //                 1,
        //                 9,
        //                 0
        //             ]
        //         }
        //     },
        //     'waterway'
        // );

        // map.addLayer(
        //     {
        //         'id': 'earthquakes-point',
        //         'type': 'circle',
        //         'source': 'earthquakes',
        //         'minzoom': 7,
        //         'paint': {
        //             // Size circle radius by earthquake magnitude and zoom level
        //             'circle-radius': [
        //                 'interpolate',
        //                 ['linear'],
        //                 ['zoom'],
        //                 7,
        //                 ['interpolate', ['linear'], ['get', 'mag'], 1, 1, 6, 4],
        //                 16,
        //                 ['interpolate', ['linear'], ['get', 'mag'], 1, 5, 6, 50]
        //             ],
        //             // Color circle by earthquake magnitude
        //             'circle-color': [
        //                 'interpolate',
        //                 ['linear'],
        //                 ['get', 'mag'],
        //                 1,
        //                 'rgba(33,102,172,0)',
        //                 2,
        //                 'rgb(103,169,207)',
        //                 3,
        //                 'rgb(209,229,240)',
        //                 4,
        //                 'rgb(253,219,199)',
        //                 5,
        //                 'rgb(239,138,98)',
        //                 6,
        //                 'rgb(178,24,43)'
        //             ],
        //             'circle-stroke-color': 'white',
        //             'circle-stroke-width': 1,
        //             // Transition from heatmap to circle layer by zoom level
        //             'circle-opacity': [
        //                 'interpolate',
        //                 ['linear'],
        //                 ['zoom'],
        //                 7,
        //                 0,
        //                 8,
        //                 1
        //             ]
        //         }
        //     },
        //     'waterway'
        // );
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