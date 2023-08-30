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
    const parameter_ref = useRef(null);
    const [lng] = useState(-1.26);
    const [lat] = useState(36.8);
    const [zoom] = useState(2);
    const [parameter, setParameter] = useState(null)
    const [API_KEY] = useState('100185d0ef77f44a0e3f2608acf2516bd6ff0a6a97232bbe0a76b986b7c123cf');
    const params = ['CO', 'NO2',  'SO2', 'Ozone', 'PM 2.5', 'PM 10']
    const zoomin = () => {
        map.current.setZoom(map.current.getZoom() + 0.5)
      }
      
      const zoomout = () => {
        map.current.setZoom(map.current.getZoom() - 1)
      }

      const addNO2Layer = () => {
        
        setParameter(parameter_ref.current)
        console.log(parameter_ref.current, 'clicked parameter')
        // console.log(parameter, 'second parameter')
        if(parameter_ref.current != null) {

          // map.current.removeLayer('wms-test-layer')
          // map.current.removeSource('wms-test-layer')
           


          if (map.current.getLayer('wms-test-layer')) {
            map.current.removeLayer('wms-test-layer');
          }
          if (map.current.getSource('wms-test-source')) {
            map.current.removeSource('wms-test-source');

          }


         

          map.current.addSource('wms-test-source', {
            'type': 'raster',
            // use the tiles option to specify a WMS tile source URL
            // https://maplibre.org/maplibre-style-spec/sources/
            'tiles': [
              `http://localhost:8005/geoserver/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&width=256&height=256&transparent=true&layers=realtime_air_quality:Global_${parameter_ref.current}`
            ],
            // 'tileSize': 256
        }); 
      

      
      map.current.addLayer(
          {
              'id': 'wms-test-layer',
              'type': 'raster',
              'source': 'wms-test-source',
              'paint': {
                'raster-opacity': 0.5
              }
          },
          //'aeroway_fill'
      );
        }

      }

      const addHeatMap = async () => {
        const response = await axios.get(`https://api.ambeedata.com/latest/by-country-code?countryCode=KE&x-api-key=${API_KEY}`)
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
                    "city": dataset.stations[i].city,
                    "country": dataset.stations[i].countryCode,
                    "AQI": dataset.stations[i].AQI,
                    "CO": dataset.stations[i].CO,
                    "N02": dataset.stations[i].NO2,
                    "Ozone": dataset.stations[i].OZONE,
                    "PM10": dataset.stations[i].PM10,
                    "PM25": dataset.stations[i].PM25,
                    "SO2": dataset.stations[i].SO2,
                   "aqiInfo": dataset.stations[i].aqiInfo,
                   "updatedAt": dataset.stations[i].updatedAt,
                }
            }
            mygeojson.features.push(feature)
        }
        console.log(mygeojson, 'mygeojson')
        map.current.addSource('mygeojson', {
            "type": "geojson",
            "data": mygeojson
        });



        map.current.addLayer(
            {
                'id': 'airquality-heat',
                'type': 'heatmap',
                'source': 'mygeojson',
                'maxzoom': 9,
                'paint': {
                    // Increase the heatmap weight based on frequency and property magnitude
                    'heatmap-weight': [
                        'interpolate',
                        ['linear'],
                        ['get', 'AQI'],
                        0,
                        0,
                        50,
                        1
                    ],
                    // Increase the heatmap color weight weight by zoom level
                    // heatmap-intensity is a multiplier on top of heatmap-weight
                    'heatmap-intensity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        0,
                        1,
                        9,
                        3
                    ],
                    // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                    // Begin color ramp at 0-stop with a 0-transparancy color
                    // to create a blur-like effect.
                    'heatmap-color': [
                        'interpolate',
                        ['linear'],
                        ['heatmap-density'],
                        0,
                        'rgba(33,102,172,0)',
                        0.2,
                        'rgb(103,169,207)',
                        0.4,
                        'rgb(209,229,240)',
                        0.6,
                        'rgb(253,219,199)',
                        0.8,
                        'rgb(239,138,98)',
                        1,
                        'rgb(178,24,43)'
                    ],
                    // Adjust the heatmap radius by zoom level
                    'heatmap-radius': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        0,
                        2,
                        9,
                        20
                    ],
                    // Transition from heatmap to circle layer by zoom level
                    'heatmap-opacity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        1,
                        9,
                        0
                    ]
                }
            },
           // 'waterway'
        );

        map.current.addLayer(
            {
                'id': 'airqiality-point',
                'type': 'circle',
                'source': 'mygeojson',
                'minzoom': 7,
                'paint': {
                    // Size circle radius by earthquake magnitude and zoom level
                    'circle-radius': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        ['interpolate', ['linear'], ['get', 'AQI'], 1, 1, 6, 4],
                        16,
                        ['interpolate', ['linear'], ['get', 'AQI'], 1, 5, 6, 50]
                    ],
                    // Color circle by earthquake magnitude
                    'circle-color': [
                        'interpolate',
                        ['linear'],
                        ['get', 'AQI'],
                        10,
                        'rgba(33,102,172,0)',
                        20,
                        'rgb(103,169,207)',
                        30,
                        'rgb(209,229,240)',
                        40,
                        'rgb(253,219,199)',
                        50,
                        'rgb(239,138,98)',
                        60,
                        'rgb(178,24,43)'
                    ],
                    'circle-stroke-color': 'white',
                    'circle-stroke-width': 1,
                    // Transition from heatmap to circle layer by zoom level
                    'circle-opacity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        0,
                        8,
                        1
                    ]
                }
            },
           // 'waterway'
        );
      
      
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
       
        
    });






      
      }, [ lng, lat, zoom]);
  return (
    <> 
     {/* <div className="map-wrap"> */}
      <div ref={mapContainer} className="map" />
      <div className="gas_container">
        



{
  params.map((param) => 

  <button className="btn" type="button"  key={param}>
  <p className="gasses"  
  onClick={ () => {parameter_ref.current = param; addNO2Layer()}}
  
  >{param}</p>
  <div id="container-stars">
    <div id="stars"></div>
  </div>

  <div id="glow">
    <div className="circle"></div>
    <div className="circle"></div>
  </div>
</button>

  )
}

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