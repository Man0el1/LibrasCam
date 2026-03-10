import React from "react";
import { useState, useEffect } from "react";
import './Header.css'

export default function Header() {

  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuth(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
    window.location.href = "/";
  }

  return(
    <div className="header">
      <ul className="navbar">
        <>
          <li className="nav-item">
            <a className="nav-link" href="/">Home</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/reserva">Reservar</a>
          </li>
        </>
        {isAuth ? (
          <>
            <li className="nav-item">
              <a className="nav-link" href="/perfil">Perfil</a>
            </li>
            <li className="nav-item">
              <button className="nav-link" onClick={handleLogout}>
                Sair
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item">
              <a className="nav-link" href="/login">Entrar</a>
            </li>
          </>
        )}
      </ul>
    </div>
  )
}