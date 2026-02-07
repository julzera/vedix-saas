import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import axios from 'axios';

const EditorContext = createContext();
const API_BASE = "https://api.limonixdigital.com";

export const EditorProvider = ({ children }) => {
  const [file, setFile] = useState(null);
  const [imageObj, setImageObj] = useState(null);
  const [overlayObj, setOverlayObj] = useState(null); // Nova variável Overlay (Imagem)
  
  const [stageSize, setStageSize] = useState({ w: 800, h: 600 });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [aspectRatio, setAspectRatio] = useState('1:1');

  // Sistema de Camadas Dinâmicas
  const [texts, setTexts] = useState([
    { id: 'txt-1', text: "Certificado para:", x: 50, y: 50, fontSize: 40, fontFamily: 'sans-serif', fill: '#000000', type: 'fixed' },
    { id: 'var-nome', text: "{nome}", x: 50, y: 150, fontSize: 60, fontFamily: 'sans-serif', fill: '#E940AA', type: 'variable' }
  ]);
  
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  const stageRef = useRef(null);
  const trRef = useRef(null);

  // Adicionar Texto ou Variável
  const addElement = (type, varName = '') => {
    const newEl = {
      id: `el-${Math.random()}`,
      text: varName ? `{${varName}}` : "Novo Texto",
      x: 100,
      y: 100,
      fontSize: 40,
      fontFamily: 'sans-serif',
      fill: '#000000',
      type: type // 'fixed' ou 'variable'
    };
    setTexts([...texts, newEl]);
    setSelectedId(newEl.id);
  };

  // Upload de Overlay
  const handleOverlayChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const img = new window.Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => setOverlayObj(img);
    }
  };

  const updateCurrentConfig = (key, value) => {
    setTexts(prev => prev.map(t => t.id === selectedId ? { ...t, [key]: value } : t));
  };

  // Zoom simplificado (apenas scroll)
  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const oldScale = scale;
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    setScale(Math.min(Math.max(newScale, 0.1), 10));
  };

  return (
    <EditorContext.Provider value={{
      file, setFile, imageObj, setImageObj, overlayObj, texts, setTexts,
      stageSize, setStageSize, scale, setScale, position, setPosition, aspectRatio, setAspectRatio,
      selectedId, setSelectedId, isLoading, setIsLoading, generatedImage, setGeneratedImage,
      stageRef, trRef, addElement, updateCurrentConfig, handleWheel, handleOverlayChange, API_BASE
    }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => useContext(EditorContext);