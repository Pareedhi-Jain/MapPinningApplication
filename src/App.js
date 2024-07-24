import * as React from 'react';
import { useState, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import 'mapbox-gl/dist/mapbox-gl.css'; // Ensure Mapbox CSS is imported
import StarIcon from '@mui/icons-material/Star';
import "./App.css";
import axios from "axios";
import { format } from 'timeago.js';
import Login from './Components/Login';
import Register from './Components/Register';


function App() {
  const myStorage = window.localStorage;
  const MAPBOX_TOKEN = 'pk.eyJ1IjoicGFyZWVkaGkiLCJhIjoiY2x5dnkzdmFxMHFlOTJqczB3eG1vM2JqNiJ9.EMnrJl6AHRsm4Kc-p4MeDw'; // Replace with your actual token
  // const currentUsername = "Aditi";

  const [pins, setPins] = useState([]);
  const [currentUsername, setCurrentUsername] = useState(myStorage.getItem(myStorage));
  const [currentPlaceId, setCurrentPlaceId] = useState(null);//statehooks
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [viewport, setViewport] = useState({
    longitude: 2.2945, // Default longitude
    latitude: 48.8584, // Default latitude
    zoom: 8,
    width: '100vw',
    height: '100vh'
  });
  const [showPopup, setShowPopup] = useState(false); // Track which popup to show
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await axios.get("/pins");
        setPins(allPins.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id,lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
    setShowPopup(true);
  };

  const handleAddClick = (e) => {
    const longitude = e.lngLat.lng;
    const latitude = e.lngLat.lat;
    
    
    setNewPlace({
      lat: latitude,
      long: longitude,
      
    });
    setShowPopup(true);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUsername,
      title,
      desc,
      rating:rating,
      lat: newPlace.lat,
      long: newPlace.long,
    };
    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout =() =>{
    myStorage.removeItem("user");
    setCurrentUsername(null);

  }


  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Map
        {...viewport}
        mapboxAccessToken={MAPBOX_TOKEN}
        onMove={evt => setViewport(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onDblClick={handleAddClick}
        // transitionDuration="200"
      >
        {pins.map((p) => (
          <React.Fragment key={p._id}>
            <Marker key={p._id} longitude={p.long} latitude={p.lat} offsetLeft={-3.5 * viewport.zoom}
              offsetTop={-7 * viewport.zoom}anchor="bottom">
              <AddLocationAltIcon 
                style={{ fontSize: `${viewport.zoom * 10}px`,color:
                currentUsername === p.username ? "tomato" : "slateblue",cursor:"pointer" }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
                transitionDuration="200"
              />
            </Marker>

            {p._id === currentPlaceId && showPopup && (
              <Popup
                longitude={p.long}
                latitude={p.lat}
                anchor="left"
                onClose={() => setShowPopup(false)}
                closeOnClick={false}
              >
                <div className="card">
                  <label>Place</label>
                  <h3 className="place"><b>{p.title}</b></h3>
                  <label>Review</label>
                  <p className='desc'>{p.desc}</p>
                  <label>Rating</label>
                  <div className='stars'>
                    {Array(p.rating).fill(<StarIcon className="star"/>)}
                  </div>
                  <label>Information</label>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                    <span className="username">Created by<b>{p.username}</b></span>
                    <span className='date'>{format(p.createdAt)}</span>  
                  
                  </div>
                </div>
              </Popup>
            )}
          </React.Fragment>
        ))}
        {newPlace&&showPopup&&(
          <Popup
                  longitude={newPlace.long}
                  latitude={newPlace.lat}
                  anchor="left"
                  onClose={() => setNewPlace(false)}
                  closeOnClick={false}
                >
                  <div>
                    <form onSubmit={handleSubmit}>
                    
                        <label>Title</label>
                        <input placeholder ="Enter a title" autoFocus onChange={(e) => setTitle(e.target.value)}/>
                        <label>Review</label>
                        <textarea
                        placeholder="Say us something about this place."onChange={(e) => setDesc(e.target.value)}/>
                        <label>Rating</label>
                        <select onChange={(e) => setRating(e.target.value)}>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                        <button className='submitbutton' type="submit">Add Pin</button>

                  </form>
                </div>
                  
                </Popup>
        )}
        {currentUsername ? (<button className="button logout" onClick={handleLogout}>Log out</button>):(
        <div className='buttons'>
        <button className="button login" onClick={()=> setShowLogin(true)}>Log In</button>
        <button className="button register" onClick={()=> setShowRegister(true)}>Register</button>
        </div>)}
        {showRegister &&<Register setShowRegister={setShowRegister}/>}
        {showLogin &&<Login setShowLogin={setShowLogin}myStorage={myStorage}setCurrentUsername={setCurrentUsername}/>}
      </Map>
    </div>
  );
}

export default App;
