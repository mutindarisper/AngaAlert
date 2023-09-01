import React from "react";
import ReactSpeedometer from "react-d3-speedometer";

const GaugeChart = () => {
  return (
    <div>
      <h2>Gauge Chart Example</h2>
      <ReactSpeedometer
        value={50} // Set the value you want to display on the gauge
        minValue={0} // Minimum value for the gauge
        maxValue={100} // Maximum value for the gauge
        width={300} // Width of the gauge chart
        height={200} // Height of the gauge chart
        needleColor="red" // Color of the needle
      />
    </div>
  );
};

export default GaugeChart;
