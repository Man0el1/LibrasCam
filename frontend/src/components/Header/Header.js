import React from "react";
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import './Header.css'

export default function Header() {

  const [mainpage, setMainpage] = useState(true);
  const [open, setOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/") setMainpage(false);
  }, [location]);

  return(
    <div className="header">
      <ul className="navbar">
        <li className="nav-item">
          <a className="nav-link" href="https://portfolio-manoelg.vercel.app/">Feito por Manoel</a>
        </li>
        <li className="nav-item">
          {mainpage && <a className="nav-link" href="/reverse">Texto p/ Libras</a>}
          {!mainpage && <a className="nav-link" href="/">Libras p/ Texto</a>}
        </li>
        <li className="nav-item">
          <div className="dropdown">
            <button onClick={() => setOpen(!open)}>Codigo fonte</button>
            {open && (
              <div className="menu">
                <div>
                  <a href="https://github.com/Man0el1/LibrasCam">Site</a>
                </div>
                <div>
                  <a href="https://github.com/Man0el1/tradutor-libras">IA</a>
                </div>
              </div>
            )}
          </div>
        </li>
      </ul>
    </div>
  )
}
