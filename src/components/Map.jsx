import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './Map.css'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from 'axios'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import { toast } from 'react-toastify'
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { toast } from 'react-toastify';
import { MapLibreSearchControl } from "@stadiamaps/maplibre-search-box";
import "@stadiamaps/maplibre-search-box/dist/style.css";
import ReactSpeedometer from "react-d3-speedometer";
import { width } from '@mui/system';
// import GaugeChart from './charts/GaugeChart';


const Map = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const latitude = useRef(null);
    const longitude = useRef(null);
    const city = useRef(null);
    const air_quality_index = useRef(null);
    const colour = useRef(null);
    const category = useRef(null);
    const parameter_ref = useRef(null);
    const [lng] = useState(-1.26);
    const [lat] = useState(36.8);
    const [zoom] = useState(2);
    const [placename, setPlacename] = useState(null)
    const [index, setIndex] = useState(null)
    // const [level, setLevel] = useState(null)
    const [aqiclass, setAqiClass] = useState('')
    const [color, setcolor] = useState(null)
    const [pollutant, setPollutant] = useState(null)
    const [parameter, setParameter] = useState(null)
    const [API_KEY] = useState('100185d0ef77f44a0e3f2608acf2516bd6ff0a6a97232bbe0a76b986b7c123cf');
    const params = ['CO', 'NO2',  'SO2', 'Ozone', 'PM 2.5', 'PM 10']
    const aqi_classes = ['Good', 'Moderate', 'Unhealthy for Sensitive Groups', 'Unhealthy', 'Very Unhealthy', 'Hazardous'] //'Unhealthy for Sensitive Groups'
    const aqi_colours = ["#94fe83", "#ffe606", "#f09642", "#f54646", "#f026d0", "#644508"]
    const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
    const zoomin = () => {
        map.current.setZoom(map.current.getZoom() + 0.5)
      }
      
      const zoomout = () => {
        map.current.setZoom(map.current.getZoom() - 1)
      }

      const addNO2Layer = async () => {
        
        setParameter(parameter_ref.current)
        console.log(parameter_ref.current, 'clicked parameter')
        // console.log(parameter, 'second parameter')
        if(parameter_ref.current != null) {

          // map.current.removeLayer('wms-test-layer')
          // map.current.removeSource('wms-test-layer')

          try {

            if (map.current.getLayer('wms-test-layer')) {
              map.current.removeLayer('wms-test-layer');
            }
            if (map.current.getSource('wms-test-source')) {
              map.current.removeSource('wms-test-source');
  
            }
  
  
           
  
         await map.current.addSource('wms-test-source', {
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
                  'raster-opacity': 0.3
                }
            },
            //'aeroway_fill'
        );
            
          } catch (error) {
            toast.error('Requested data is not available', { position: toast.POSITION.TOP_CENTER })
            console.error(error);
            
          }
           


          
        }

      }

      // const fetchAirQuality = async () => { 
      //   const response = await axios.get(`https://api.ambeedata.com/latest/by-lat-lng?lat=${latitude.current}&lng=${longitude.current}&x-api-key=${API_KEY}`)
      //   console.log(response.data)
      //   // var dataset = response.data
      //   // let mygeojson = {"type": "FeatureCollection", "features": []}
      // }
      

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
    const control = new MapLibreSearchControl({
      useMapFocusPoint: true,
      onResultSelected: async (feature) => 
      { console.log(feature)
        latitude.current = feature.geometry.coordinates[1]
        longitude.current = feature.geometry.coordinates[0]

        const response = await axios.get(`https://api.ambeedata.com/latest/by-lat-lng?lat=${latitude.current}&lng=${longitude.current}&x-api-key=${API_KEY}`)
        const airvisual_response = await axios.get(`https://api.airvisual.com/v2/nearest_city?lat=${latitude.current}&lon=${longitude.current}&key=3c715335-77ae-4e5d-9141-02781f31f9d9`)
        console.log(response.data.stations)
        console.log(airvisual_response.data.data.current, 'air visual data')
        // console.log(response.data.stations[0].lat, response.data.stations[0].lng, 'coords')

         city.current = response.data.stations[0].city
         setPlacename(response.data.stations[0].city)


         setPollutant(airvisual_response.data.data.current.pollution.mainus)
         console.log(pollutant, 'polutant')


         air_quality_index.current = airvisual_response.data.data.current.pollution.aqius
        //  setIndex(response.data.stations[0].AQI)
         setIndex(air_quality_index.current )
        // category.current = response.data.stations[0].aqiInfo.category

        console.log(air_quality_index.current, 'AQI') //
        


        const circleMarkerData = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [feature.geometry.coordinates[0], feature.geometry.coordinates[1]],
              },
              properties: {
                title: 'My CircleMarker',
                aqi_count:air_quality_index.current
              },
            },
          ],
        };



        
        if (map.current.getLayer('circle-marker-layer')) {
          map.current.removeLayer('circle-marker-layer');
        }
        if (map.current.getLayer('text-label-layer')) {
          map.current.removeLayer('text-label-layer');
        }
        if (map.current.getSource('circle-marker-source')) {
          map.current.removeSource('circle-marker-source');

        }
        if (map.current.getSource('text-label-layer')) {
          map.current.removeSource('text-label-layer');

        }

          // Add a source with your CircleMarker data
  map.current.addSource('circle-marker-source', {
    type: 'geojson',
    data: circleMarkerData,
  });

  
const classRules = () =>  {
  
  if(air_quality_index.current <= 50) {
    category.current = 'Good'
    colour.current = "#94fe83"
    setcolor(colour.current)
   return setAqiClass(category.current)

  } else if (air_quality_index.current >= 51 && air_quality_index.current <= 100) {
    category.current = 'Moderate'
    colour.current = "#ffe606"
    setcolor(colour.current)
    return setAqiClass(category.current)

  }
  else if (air_quality_index.current >= 101 && air_quality_index.current <= 150) {
    category.current = 'Unhealthy for Sensitive Groups'
    colour.current = "#f09642"
    setcolor(colour.current)
    return setAqiClass(category.current)

  }
  else if (air_quality_index.current >= 151 && air_quality_index.current <= 200) {
    category.current = 'Unhealthy'
    colour.current = "#f54646"
    setcolor(colour.current)
   return setAqiClass(category.current)

  }
  else if(air_quality_index.current >= 201 && air_quality_index.current <= 300) {
    category.current = 'Very Unhealthy'
    colour.current = "#f026d0"
    setcolor(colour.current)
    return setAqiClass(category.current)

  }
  else if(air_quality_index.current > 300) {
    category.current = 'Harzardous'
    colour.current = "#644508"
    setcolor(colour.current)
    setAqiClass(category.current)

  } else{
    return setAqiClass('unknown')
  }


}
classRules()

// Add a layer for the CircleMarker
map.current.addLayer({
  id: 'circle-marker-layer',
  type: 'circle',
  source: 'circle-marker-source',
  paint: {
    'circle-radius': air_quality_index.current / 2,
    'circle-color':colour.current ,
    'circle-opacity':.8 ,
    
  }
  
});

const popup = new maplibregl.Popup({
  closeButton: false, // Display a close button or not
  closeOnClick: false, // Close the popup when the map is clicked
}).setHTML(`<strong>Concentrations</strong>
<br> <strong>Nitrogen dioxide: ${response.data.stations[0].NO2}</strong>
 <br> <strong> Sulphur dioxide: ${response.data.stations[0].SO2}</strong>
 <br> <strong> Carbon Monoxide: ${response.data.stations[0].CO}</strong>
 <br> <strong> Ozone: ${response.data.stations[0].OZONE}</strong>
 <br> <strong> PM 10: ${response.data.stations[0].PM10}</strong>
 <br> <strong> PM 2.5: ${response.data.stations[0].PM25}</strong>`); // Set the popup content


// Add a SymbolLayer for the text label
map.current.addLayer({
  id: 'text-label-layer',
  type: 'symbol',
  source: {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates:  [feature.geometry.coordinates[0], feature.geometry.coordinates[1]],
      },
      properties: {
        label: air_quality_index.current, // Your label content (e.g., a number)
      },
    },
  },
  layout: {
    'text-field': ['get', 'label'],
    'text-size': 14,
    // 'text-offset': [0, -15], // Adjust this value to position the label relative to the circle
    'text-anchor': 'top',
  },
  paint: {
    'text-color': 'black',
  },
});

 // Create a marker and bind the popup
//  const marker = new maplibregl.Marker()
//  .setLngLat( [feature.geometry.coordinates[0], feature.geometry.coordinates[1]])
//  .addTo(map.current)
//  .setPopup(popup);

//decided to remove the marker for now

      
      } 
      
    });
    map.current.addControl(control, "top-right"
    //  onResultSelected: true
);







      
      }, [ lng, lat, zoom, aqiclass]);
  return (
    <> 
     {/* <div className="map-wrap"> */}
      <div ref={mapContainer} className="map" />
      <div className="gas_container">
        



{
  params.map((param) => 

  <button className="btn" type="button"  key={param}  onClick={ () => {parameter_ref.current = param; addNO2Layer()}}>
  <p className="gasses"  
 
  
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

      </div>

      <div className="" >
      <ToastContainer />
    </div>

      <div className="mapcontrols">
        <AddIcon onClick={zoomin} />
        <div className='separate' style={{width:'30px', border:' grey 1px solid'}}>
        </div>
        <RemoveIcon onClick={zoomout}/>
       
     </div>






<div className="classes_container">
  {
    aqi_classes.map((class_item, index) => (
      <div key={index} className='class_item' style={{backgroundColor: aqi_colours[index]}}>{class_item}</div>
    ))
  }
</div>


<div className="item-container">
      {items.map((item, index) => (
        <div key={index} className="item" >
          {item}
        </div>
      ))}
    </div>
     






      {/* add stats panel */}
    {
      index != null ? 
      <>

<div className="stats_panel">
      
      <div className="aqi_info">
      <p className="placename">{placename}</p>
      <br />

      <p className="air">Air Quality Index</p>
      <p className="index">{index}</p>
      <br />
      <div className="leves" style={{display:'flex', flexDirection:'row'}}>
      <p className="level">Pollution Level: <span className='level2'>{ aqiclass}</span> </p>
      <p className="pollutant">Main Pollutant: {pollutant}</p>
      </div>
      </div>

      <div className="chart_container">
      {/* <h2>Gauge Chart Example</h2> */}
      <ReactSpeedometer
        value={index} // Set the value you want to display on the gauge
        minValue={0} // Minimum value for the gauge
        maxValue={400} // Maximum value for the gauge
        width={300} // Width of the gauge chart
        height={200} // Height of the gauge chart
        needleColor="red" // Color of the needle
        textColor='#fff'
        labelFontSize='16px'
        customSegmentStops={[0, 50, 100, 150, 200, 300, 400]}
        segmentColors={["#94fe83", "#ffe606", "#f09642", "#f54646", "#f026d0", "#644508"]}
        // customSegmentLabels={[
        //   {
        //     text: "Good",
        //     position: "INSIDE",
        //     color: "#555",
        //   },
        //   {
        //     text: "Moderate",
        //     position: "INSIDE",
        //     color: "#555",
        //   },
        //   {
        //     text: "Unhealthy for Sensitive Groups",
        //     position: "INSIDE",
        //     color: "#555",
        //     // fontSize: "19px",
        //   },
        //   {
        //     text: "Unhealthy",
        //     position: "INSIDE",
        //     color: "#555",
        //   },
        //   {
        //     text: "Very Unhealthy",
        //     position: "INSIDE",
        //     color: "#555",
        //   },
        //   {
        //     text: "Hazardous",
        //     position: "INSIDE",
        //     color: "#555",
        //   },
        // ]}
      />
      </div>
      
      
    
      </div>






      </>
  
      : ''
    }

 
    
    </>
   
  )
}

export default Map