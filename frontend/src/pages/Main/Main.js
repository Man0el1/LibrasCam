import React, { useEffect, useState, useRef } from "react";
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

import { LuSpace } from "react-icons/lu";
import { FaPause } from "react-icons/fa";
import { FaBackspace } from "react-icons/fa";

import './Main.css'

export default function Main() {

  const [isVisibleButton, setIsVisibleButton] = useState(true);
  const [translatedLetters, setTranslatedLetters] = useState("");
  const [letterDiv, setLetterDiv] = useState("");
  const [confidenceDiv, setConfidenceDiv] = useState("");


  const videoLocRef = useRef(null);
  const cameraRef = useRef(null);
  const handsRef = useRef(null);
  const lastRequest = useRef(0);
  const numSequence = useRef(0);
  const currentLetter = useRef(null);
  const isTranslatingRef = useRef(false);
  const isProcessing = useRef(false);

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7
    });

    hands.onResults(async (results) => {

      if (!isTranslatingRef.current) return;

      const now = Date.now();
      if (now - lastRequest.current < 300) return;
      lastRequest.current = now;

      if (!results.multiHandLandmarks?.length) return;

      const hand = results.multiHandLandmarks[0];

      let x = [];
      let y = [];
      let data = [];

      hand.forEach(point => {
        x.push(point.x);
        y.push(point.y);
      });

      const minX = Math.min(...x);
      const maxX = Math.max(...x);
      const minY = Math.min(...y);
      const maxY = Math.max(...y);

      const width = maxX - minX || 1;
      const height = maxY - minY || 1;

      hand.forEach(point => {
        data.push((point.x - minX) / width);
        data.push((point.y - minY) / height);
      });

      if (data.length !== 42) return;

      try {
        const response = await fetch("https://tradutor-libras-site-production.up.railway.app/predict", {
          method: "POST",
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ data })
        });

        if (!response.ok) return;

        const result = await response.json();
        setConfidenceDiv(result.confidence);
        setLetterDiv(result.letter);

        if (result.confidence < 0.3) return;

        if (currentLetter.current === null)
          currentLetter.current = result.letter;

        if (result.letter === currentLetter.current) {
          numSequence.current++;
        } else {
          currentLetter.current = result.letter;
          numSequence.current = 1;
        }

        if (numSequence.current >= 5) {
          setTranslatedLetters(prev => prev + result.letter);
          numSequence.current = 0;
          currentLetter.current = null;
        }

      } catch (e) {
        console.error(e);
      }
    });
    handsRef.current = hands;
  }, []);

  const startVideo = async () => {
    try {

      setIsVisibleButton(false);
      isTranslatingRef.current = true;

      cameraRef.current = new Camera(videoLocRef.current, {
        onFrame: async () => {

          if (!isTranslatingRef.current) return;
          if (isProcessing.current) return;

          if (
            videoLocRef.current &&
            videoLocRef.current.readyState >= 2 &&
            handsRef.current
          ) {

            isProcessing.current = true;

            try {
              await handsRef.current.send({ image: videoLocRef.current });
            } catch (e) {
              console.error(e);
            }

            isProcessing.current = false;
          }

        },
        width: 640,
        height: 480
      });

      cameraRef.current.start();

    } catch (e) {
      console.log("erro: " + e);
    }
  };

  const stopVideo = async () => {
    setIsVisibleButton(true);
    isTranslatingRef.current = false;

    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }
  }

  return(
    <div className="homePage">
      <div className="intro-text">
        <h1 className="title">Tradutor Alfabeto Libras</h1>
        <h3 className="subtitle">
          Um tradutor simples e eficiente para tradução do alfabeto em libras em tempo real
        </h3>
      </div>

      <div className="translator">
        <div className="prediction-box">
          <div className="letter-predicted">{letterDiv}</div>
          <div className="confidence-letter">{Math.round(confidenceDiv * 100)}%</div>
        </div>
        <div className="screen-translator">
          {isVisibleButton &&
            <button className="button-video" onClick={() => startVideo()}>Começar tradução</button>
          }
          {!isVisibleButton &&
            <button className="button-pause-video" onClick={() => stopVideo()}><FaPause /></button>
          }
          <video ref={videoLocRef} autoPlay playsInline className="video-location"></video>
        </div>
        <div className="text-options">
          <div className="translated-letters">
            {translatedLetters}
          </div>
          <div className="button-text-options">
            <button className="button-space" onClick={() => setTranslatedLetters(translatedLetters + " ")}><LuSpace /></button>
            <button className="button-remove" onClick={() => setTranslatedLetters(translatedLetters.slice(0, -1))}><FaBackspace /></button>
            <button className="button-delete" onClick={() => setTranslatedLetters("")}>X</button>
          </div>
        </div>
      </div>
      <div className="how-to-use">
        <h2>Como usar</h2>
        <ol>
          <li>Clique em "Começar tradução".</li>
          <li>Mostre o sinal de Libras para a câmera.</li>
          <li>As letras reconhecidas aparecerão ao lado.</li>
          <li>Use os botões para editar o texto.</li>
        </ol>
      </div>
    </div>
  )
}
