// App.js
import React, { useState } from 'react';

function App() {
  // State to track the text
  const [text, setText] = useState("Hello, welcome to React!");

  // Event handler to update the state
  const changeText = () => {
    setText("You've clicked the button!");
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>{text}</h1>
      <button onClick={changeText} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Click Me
      </button>
    </div>
  );
}

export default App;
