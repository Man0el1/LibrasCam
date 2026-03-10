import React, { useEffect, useState, useRef } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

import './Main.css'

export default function Main() {

  const [isVisibleButton, setIsVisibleButton] = useState(true);
  const [IsTranslating, setIsTranslating] = useState(false)

  const videoRef = useRef(null);
  const lastRequest = useRef(0);

  const startVideo = async () => {
    setIsVisibleButton(false);
    setIsTranslating(true);
  }

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    });
    hands.setOptions({
      maxNumHands: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7
    });

    hands.onResults(async (results) => {
      if (!IsTranslating) return;

      const now = Date.now();
      if (now - lastRequest.current < 100) return;
      lastRequest.current = now;

      if (results.multiHandLandmarks) {

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

        try {
          let response = await fetch("http://localhost:8080/predict", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
          })
          if (!response.ok) return;

          let result = await response.json();
          console.log(result.letter);
          console.log(result.confidence);
        } catch (e) {
          alert("erro:" + e);
        }
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await hands.send({image: videoRef.current});
      },
      width: 640,
      height: 480
    });
    camera.start();

  }, []);

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
          <div className="translated-words">
          </div>
        </div>
      </div>
    </div>
  )
}
