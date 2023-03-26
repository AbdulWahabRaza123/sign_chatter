import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
function App() {
  return (
    <>
    {/* <head>
    <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests"/>
    <script type="text/javascript" src="http://www.turnjs.com/lib/turn.min.js "></script>
    </head> */}
      <Routes>
        <Route exact path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
