import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header.js"
import Footer from "./components/Footer/Footer.js"

import Main from "./pages/Main/Main.js";
import Reverse from "./pages/Reverse/Reverse.js";

export default function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<Main/>}/>
        <Route path="/reverse" element={<Reverse/>}/>
      </Routes>
      <Footer/>
    </Router>
  );
}
