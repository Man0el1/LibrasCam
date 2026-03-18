import React, { useEffect, useState, useRef } from "react";

import './Reverse.css'

export default function Reverse() {

  const [formText, setFormText] = useState("");
  const [textTranslation, setTextTranslation] = useState();

  const posicoes = {
    a: "0px 0px",
    b: "-100px 0px"
    //..
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const text = formText.replace(/^[a-zA-Z\s]+$/, '');

      return (
        text.split("").map((letra, i) => {
          <div key={i} className="letter" style={{ backgroundPosition: posicoes[letra] }}/>
        })
      )

    } catch (e) {
      console.log("Erro: " + e)
    }
  };

  return(
    <div className="homePage">
      <div className="intro-text">
        <h1 className="title">Tradutor Alfabeto Libras</h1>
        <h3 className="subtitle">
          Um tradutor simples e eficiente para tradução do alfabeto em libras
        </h3>
      </div>

      <div className="translator">
        <form className='form-translator' onSubmit={handleSubmit}>
          <label htmlFor="text">Insira o texto a ser traduzido</label>
          <input value={formText} onChange={(e) => setFormText(e.target.value)} id='text' name='text' className='input' type='text' />
          <input className='submit' type='submit' value='Traduzir'/>
        </form>
        <div className="results"> {textTranslation} </div>
      </div>
      <div className="how-to-use">
        <h2>Como usar</h2>
        <ol>
          <li>Escreva o que deseja traduzir para libras.</li>
          <li>Mostre o sinal de Libras para a câmera.</li>
          <li>As letras reconhecidas aparecerão ao lado.</li>
          <li>Use os botões para editar o texto.</li>
        </ol>
      </div>
    </div>
  )
}
