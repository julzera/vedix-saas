import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import axios from 'axios';

const EditorContext = createContext();
const API_BASE = "https://api.limonixdigital.com";

export const EditorProvider = ({ children }) => {
  const [file, setFile] = useState(null);
  const [imageObj, setImageObj] = useState(null);
  const [overlayObj, setOverlayObj] = useState(null);
  
  const [stageSize, setStageSize] = useState({ w: 800, h: 600 });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [aspectRatio, setAspectRatio] = useState('1:1');

  // INICIO VAZIO (Correção do pedido)
  const [texts, setTexts] = useState([]); 
  
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [availableFonts, setAvailableFonts] = useState(['sans-serif', 'Arial', 'Times New Roman', 'Courier New']);

  const stageRef = useRef(null);
  const trRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        setTexts(prev => prev.filter(t => t.id !== selectedId));
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId]);

  const addElement = (elementConfig) => {
    const stage = stageRef.current;
    let startX = 100;
    let startY = 100;
    
    if (stage) {
        // Centraliza na visão atual
        startX = (-stage.x() + stage.width() / 2) / scale;
        startY = (-stage.y() + stage.height() / 2) / scale;
    }

    const newEl = {
      id: `el-${Date.now()}`,
      x: startX,
      y: startY,
      fontSize: 50,
      fontFamily: 'sans-serif',
      fill: '#000000',
      fontStyle: 'normal', // Importante para evitar crash
      align: 'center',
      ...elementConfig 
    };

    setTexts(prev => [...prev, newEl]);
    setSelectedId(newEl.id);
  };

  const updateCurrentConfig = (key, value) => {
    setTexts(prev => prev.map(t => t.id === selectedId ? { ...t, [key]: value } : t));
  };

  const handleFontUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fontName = file.name.split('.')[0];
    const reader = new FileReader();
    reader.onload = async (event) => {
        try {
            const fontData = event.target.result;
            const fontFace = new FontFace(fontName, fontData);
            await fontFace.load();
            document.fonts.add(fontFace);
            setAvailableFonts(prev => [...prev, fontName]);
            if(selectedId) updateCurrentConfig('fontFamily', fontName);
        } catch (err) { console.error(err); }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleGenerate = async () => {
    if (!stageRef.current) return;
    setIsLoading(true);
    const oldSelection = selectedId;
    setSelectedId(null);
    setTimeout(() => {
        const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
        setGeneratedImage(uri);
        setSelectedId(oldSelection);
        setIsLoading(false);
    }, 100);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const img = new window.Image();
      img.src = URL.createObjectURL(selectedFile);
      img.onload = () => { setImageObj(img); setPosition({x:0, y:0}); setScale(1); };
    }
  };

  const handleOverlayChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const img = new window.Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => setOverlayObj(img);
    }
  };

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
    };
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    if (newScale < 0.1 || newScale > 10) return;
    setScale(newScale);
    setPosition({
      x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
    });
  };

  return (
    <EditorContext.Provider value={{
      file, setFile, imageObj, setImageObj, overlayObj, texts, setTexts,
      stageSize, setStageSize, scale, setScale, position, setPosition, aspectRatio, setAspectRatio,
      selectedId, setSelectedId, isLoading, setIsLoading, generatedImage, setGeneratedImage, availableFonts,
      stageRef, trRef, addElement, updateCurrentConfig, handleWheel, handleFileChange, handleOverlayChange, handleFontUpload, handleGenerate, API_BASE
    }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => useContext(EditorContext);