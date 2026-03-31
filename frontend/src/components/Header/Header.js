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

        <div className="nav-left">
          <li className="nav-item nav-item-left">
            {mainpage && <a className="nav-link" href="/reverse">Texto p/ Libras</a>}
            {!mainpage && <a className="nav-link" href="/">Libras p/ Texto</a>}
          </li>
        </div>

        <div className="nav-right">
          <li className="nav-item">
            <a className="nav-link" href="https://portfolio-manoelg.vercel.app/">
              Feito por Manoel
            </a>
          </li>

          <li className="nav-item">
            <div className="dropdown">
              <button onClick={() => setOpen(!open)}>Codigo fonte</button>
              {open && (
                <div className="menu">
                  <a href="https://github.com/Man0el1/LibrasCam">
                    <div>• Site</div>
                  </a>
                  <a href="https://github.com/Man0el1/tradutor-libras">
                    <div>• IA</div>
                  </a>
                </div>
              )}
            </div>
          </li>
        </div>
      </ul>
    </div>
  )
}
