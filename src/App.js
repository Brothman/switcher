import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import Button from './components/Button/button';
import io from 'socket.io-client';

function App() {
  const [ channels, setChannels ] = useState([]);
  const [activeButton, setActiveButton] = useState(null);
  const socket = io('http://localhost:8080');

  socket.on('newActiveChannel', ({ activeChannel }) => setActiveButton(activeChannel));


  useEffect(function fetchChannels() {
    axios.get('/api/fetchChannels').then(response => {
      setChannels(response.data.activeChannels);
      setActiveButton(response.data.activeChannel);
    })
    .catch(error => {
        console.error(error);
    });
  }, []);
  //empty brackets semantically [no dependencies] implies to only run when 
  //component first appears, and when component is about to disappear.
  //we do this so we can get live data

  function createButtons() {
    return channels.map((channel, index) => {
      return <Button activeButton={activeButton} 
                     key={index} 
                     channel={channel} />
    });
  }

  return (
    <div className="App">
      <div className="buttonsContainer">
        { createButtons() }
      </div>
    </div>
  );
}

export default App;
