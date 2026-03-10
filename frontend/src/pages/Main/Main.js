import React, { useEffect, useState, useRef } from "react";
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

import './Main.css'

export default function Main() {

  const [isVisibleButton, setIsVisibleButton] = useState(true);
  const [IsTranslating, setIsTranslating] = useState(false);
  const [translatedLetters, setTranslatedLetters] = useState("");


  const videoRef = useRef(null);
  const cameraRef = useRef(null);
  const handsRef = useRef(null);
  const lastRequest = useRef(0);
  const numSequence = useRef(0);
  const currentLetter = useRef(null)

  useEffect(() => {
    handsRef.current = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    });
    handsRef.current.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7
    });

    handsRef.current.onResults(async (results) => {
      if (!IsTranslating) return;

      const now = Date.now();
      if (now - lastRequest.current < 300) return;
      lastRequest.current = now;

      if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) return;

      const hand = results.multiHandLandmarks[0];
      let x = [];
      let y = [];
      let data = [];

      hand.forEach(point => {
        x.push(point.x);
        y.push(point.y);
      })

      const minX = Math.min(...x);
      const maxX = Math.max(...x);
      const minY = Math.min(...y);
      const maxY = Math.max(...y);

      hand.forEach(point => {
        data.push((point.x - minX) / (maxX - minX));
        data.push((point.y - minY) / (maxY - minY));
      });
      if (data.length !== 42) return;

      try {
        let response = await fetch("http://localhost:8080/predict", {
          method: "POST",
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({data: data})
        })
        if (!response.ok) return;

        let result = await response.json();
        if (result.confidence < 0.3) return;

        if (currentLetter.current === null) currentLetter.current = result.letter;
        if (result.letter === currentLetter.current) {
          numSequence.current += 1;
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
        alert("erro:" + e);
      }
    });

  }, [IsTranslating]);

  // python -m uvicorn predict:app --reload --port 8080
  // lembrar colocar isTransalitng
  const startVideo = async () => {
    try{
      setIsVisibleButton(false);
      setIsTranslating(true);

      cameraRef.current = new Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current && videoRef.current.readyState >= 2) {
            await handsRef.current.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480
      });
      cameraRef.current.start();
    } catch (e) {
      console.log("erro: " + e)
    }
  }

  return(
    <div className="homePage">
      <div className="intro-text">
        <h1 className="title">Tradutor Libras</h1>
        <h3 className="subtitle">
          Um tradutor simples e eficiente para tradução em libras em tempo real
        </h3>
      </div>

      <div className="translator">
        <div className="screen-translator">
          {isVisibleButton &&
            <button className="button-video" onClick={() => startVideo()}>Começar tradução</button>
          }
          <video ref={videoRef} autoPlay playsInline style={{ width: "640px", transform: "scaleX(-1)" }}></video>
        </div>
        <div className="text-options">
          <div className="translated-letters">
            {translatedLetters}
          </div>
          {!isVisibleButton &&
            <div className="button-text-options">
              <button className="button-space" onClick={() => setTranslatedLetters(translatedLetters + " ")}>_</button>
              <button className="button-remove" onClick={() => setTranslatedLetters(translatedLetters.slice(0, -1))}>-</button>
              <button className="button-delete" onClick={() => setTranslatedLetters("")}>X</button>
            </div>
          }
        </div>
      </div>
    </div>
  )
}
