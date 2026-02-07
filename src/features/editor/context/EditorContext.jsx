import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const EditorContext = createContext();
const API_BASE = "https://api.limonixdigital.com";

export const EditorProvider = ({ children }) => {
  // --- ESTADOS ---
  const [file, setFile] = useState(null);
  const [imageObj, setImageObj] = useState(null);
  const [overlayObj, setOverlayObj] = useState(null);
  
  // Viewport (Inicia centralizado e não reseta ao trocar de aba)
  const [stageSize, setStageSize] = useState({ w: 800, h: 600 });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [aspectRatio, setAspectRatio] = useState('1:1');

  const [texts, setTexts] = useState([]); 
  
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [availableFonts, setAvailableFonts] = useState(['sans-serif', 'Arial', 'Times New Roman', 'Courier New']);

  const stageRef = useRef(null);
  const trRef = useRef(null);

  // --- PERSISTÊNCIA CRÍTICA ---
  useEffect(() => {
    // Só carrega a imagem se ela não existir no DOM mas o arquivo existir
    if (file && !imageObj) {
        const img = new window.Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => { 
            setImageObj(img); 
            // REMOVI O RESET DE POSIÇÃO AQUI. 
            // Isso garante que ao voltar do dashboard, a posição seja a última salva.
        };
    }
  }, [file, imageObj]);

  // Atalho Delete
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT') return; // Permite deletar texto dentro de inputs
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        if (selectedId === 'overlay') {
            setOverlayObj(null);
            setSelectedId(null);
        } else {
            setTexts(prev => prev.filter(t => t.id !== selectedId));
            setSelectedId(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId]);

  // --- AÇÕES ---

  const addElement = (elementConfig) => {
    const offset = texts.length * 15; // Cascata para não sobrepor exato
    let startX = 100;
    let startY = 100;

    // Tenta colocar no centro da visão atual
    if (stageRef.current) {
        const stage = stageRef.current;
        // Pega o centro visível considerando o Pan (x,y) e Zoom (scale) atual
        startX = (-stage.x() + (stage.width() / 2)) / scale;
        startY = (-stage.y() + (stage.height() / 2)) / scale;
    }

    const newEl = {
      id: `el-${Date.now()}`,
      x: startX + offset,
      y: startY + offset,
      fontSize: 50,
      fontFamily: 'sans-serif',
      fill: '#000000',
      fontStyle: 'normal',
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
            if(selectedId && selectedId !== 'overlay') updateCurrentConfig('fontFamily', fontName);
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
        try {
            const uri = stageRef.current.toDataURL({ pixelRatio: 2, mimeType: "image/png" });
            setGeneratedImage(uri);
        } catch (e) {
            console.error(e);
        } finally {
            setSelectedId(oldSelection);
            setIsLoading(false);
        }
    }, 100);
  };

  const generateJSON = () => {
    const data = {
        baseImage: file ? file.name : null,
        elements: texts.map(t => ({
            type: 'text',
            content: t.text,
            x: Math.round(t.x),
            y: Math.round(t.y),
            fontSize: t.fontSize,
            fontFamily: t.fontFamily,
            color: t.fill,
            style: t.fontStyle
        })),
        overlay: overlayObj ? { x: 50, y: 50 } : null
    };
    return JSON.stringify(data, null, 2);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const img = new window.Image();
      img.src = URL.createObjectURL(selectedFile);
      img.onload = () => { 
          setImageObj(img); 
          // AQUI SIM resetamos, pois é uma imagem nova
          setPosition({x:0, y:0}); 
          setScale(1); 
      };
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
      stageRef, trRef, addElement, updateCurrentConfig, handleWheel, handleFileChange, handleOverlayChange, 
      handleFontUpload, handleGenerate, generateJSON, API_BASE
    }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => useContext(EditorContext);