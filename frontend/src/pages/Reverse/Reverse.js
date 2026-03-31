import React, { useEffect, useState, useRef } from "react";

import './Reverse.css'

export default function Reverse() {

  const [formText, setFormText] = useState("");
  const [textTranslation, setTextTranslation] = useState();

  const posicoes = {};
  const letras = "abcdefghijklmnopqrstuvwxyz-";
  for (let i = 0; i < letras.length; i++) {
    const x = (i % 9) * 150;
    const y = Math.floor(i / 9) * 225;
    posicoes[letras[i]] = `${-x}px ${-y}px`;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const text = formText.replace(/[^a-zA-Z\s]/g, '').toLowerCase();

      const resultado = (
        <div className="letter-comp">
          {text.split("").map((letra, i) => {
            if (letra === " ") letra = "-";

            return (
              <div key={i}>
                <div
                  className="letter"
                  style={{ backgroundPosition: posicoes[letra] }}
                />
                <div className="word">
                  {letra === "-" ? "_" : letra}
                </div>
              </div>
            );
          })}
        </div>
      );
      setTextTranslation(resultado);

    } catch (e) {
      console.log("Erro: " + e);
    }
  };

  return(
    <div className="homePage">
      <div className="intro-text-reverse">
        <h1 className="title">Tradutor Alfabeto Libras</h1>
        <h3 className="subtitle">
          Um tradutor simples e eficiente para tradução do alfabeto em libras
        </h3>
      </div>

      <div className="reverse-translator">
        <form className='form-translator' onSubmit={handleSubmit}>
          <label htmlFor="text">Insira o texto a ser traduzido</label>
          <input value={formText} onChange={(e) => setFormText(e.target.value)} maxLength={500} id='text' name='text' className='input' type='text' />
          <input className='submit' type='submit' value='Traduzir'/>
        </form>
        <div className="reverse-results"> {textTranslation} </div>
      </div>
    </div>
  )
}
