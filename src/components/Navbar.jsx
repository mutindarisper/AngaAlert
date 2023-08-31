import React from 'react'
import './Navbar.css';
import AirIcon from '@mui/icons-material/Air';

const Navbar = () => {
    const date = new Date();
    var daylist = ["Sunday","Monday","Tuesday","Wednesday ","Thursday","Friday","Saturday"];
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  let day = date.getDay();
  var today_date = date.getDate()
  let month = date.getMonth();
  let year = date.getFullYear();
  return (
    <div className="heading">
        <div className="air" >
            
        <AirIcon 
        // fontSize="large"
        style={{marginLeft:'-1.5vw', marginTop:'0.9vh',height:'75px', width:'150px'}}
        />
            
        </div>
       
    <span>AngaAlert</span>
    <br />
    <p className='tagline'>Providing Realtime Air Quality data around the World</p>

    {/* <input type="text" name="" id="city" placeholder='Search City...' /> */}
    <p className="date"> {`${daylist[day]} ${today_date} ${monthNames[month]} ${year}`}</p>
    </div>
  )
}

export default Navbar