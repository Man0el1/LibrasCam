import React from "react";
import { useState, useEffect } from "react";
import './Header.css'

export default function Header() {

  useEffect(() => {
    const token = localStorage.getItem("token");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  return(
    <div className="header">
      <ul className="navbar">
        <li className="nav-item">
          <a className="nav-link" href="/reserva">Traduzir frase em libras</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/login">Manoel :D</a>
        </li>
      </ul>
    </div>
  )
}
