import React, { useState } from 'react';
import MoonAnimation from './components/MoonAnimation';
import CustomAlbum from './components/CustomAlbum';
import './App.css';

function App() {
  const [showAlbum, setShowAlbum] = useState(false);

  return (
    <div className="App">
      {!showAlbum ? (
        <MoonAnimation onMoonClick={() => setShowAlbum(true)} />
      ) : (
        <CustomAlbum />
      )}
    </div>
  );
}

export default App;