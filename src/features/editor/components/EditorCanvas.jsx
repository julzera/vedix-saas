import React, { useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Text, Transformer } from 'react-konva';
import { useEditor } from '../context/EditorContext';

const EditorCanvas = () => {
  const {
    stageSize, scale, position, setPosition, imageObj, overlayObj,
    texts, selectedId, setSelectedId, handleWheel,
    stageRef, trRef, aspectRatio, setAspectRatio
  } = useEditor();

  useEffect(() => {
    if (selectedId && trRef.current) {
      const stage = stageRef.current;
      const node = stage.findOne('#' + selectedId);
      if (node) {
        trRef.current.nodes([node]);
        trRef.current.getLayer().batchDraw();
      }
    } else if (trRef.current) {
      trRef.current.nodes([]);
    }
  }, [selectedId, texts]);

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden">
      {/* TOOLBAR SUPERIOR - Aspect Ratio */}
      <div className="h-14 border-b border-border bg-white dark:bg-slate-900 flex items-center justify-center gap-4 px-4 shadow-sm z-10 transition-colors">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Proporção:</span>
        {['1:1', '4:5', '9:16'].map(ratio => (
          <button 
            key={ratio}
            onClick={() => setAspectRatio(ratio)}
            className={`px-4 py-1 text-xs font-bold rounded-full transition-all ${aspectRatio === ratio ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 hover:bg-gray-200'}`}
          >
            {ratio}
          </button>
        ))}
      </div>

      {/* ÁREA DO CANVAS */}
      <div className="flex-1 bg-gray-50 dark:bg-slate-950 relative overflow-hidden cursor-grab active:cursor-grabbing transition-colors">
        <Stage
          ref={stageRef}
          // Agora usamos 100% do container pai disponível
          width={window.innerWidth - 580} // Desconto aproximado (Sidebar Left + Sidebar Right)
          height={window.innerHeight - 130}
          scaleX={scale}
          scaleY={scale}
          x={position.x}
          y={position.y}
          draggable
          onDragEnd={(e) => setPosition({ x: e.target.x(), y: e.target.y() })}
          onWheel={handleWheel}
          onMouseDown={(e) => { if (e.target === e.target.getStage()) setSelectedId(null); }}
        >
          <Layer>
            {/* Background do Canvas baseado no Aspect Ratio */}
            <KonvaImage 
               x={0} y={0} 
               width={600} 
               height={aspectRatio === '1:1' ? 600 : aspectRatio === '4:5' ? 750 : 1066} 
               fill="white" 
               shadowBlur={20} 
               shadowOpacity={0.1} 
            />
            
            {imageObj && (
              <KonvaImage image={imageObj} x={0} y={0} width={600} height={600} />
            )}

            {overlayObj && (
              <KonvaImage image={overlayObj} x={50} y={50} width={150} height={150} draggable />
            )}

            {texts.map((t) => (
              <Text
                key={t.id}
                id={t.id}
                {...t}
                draggable
                onClick={() => setSelectedId(t.id)}
                onTap={() => setSelectedId(t.id)}
                onDragEnd={(e) => {
                  const updated = texts.map(txt => txt.id === t.id ? {...txt, x: e.target.x(), y: e.target.y()} : txt);
                  // Opcional: Atualizar no context se quiser persistir
                }}
              />
            ))}

            <Transformer 
               ref={trRef} 
               rotateEnabled={true}
               enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
               boundBoxFunc={(oldBox, newBox) => newBox.width < 5 || newBox.height < 5 ? oldBox : newBox} 
            />
          </Layer>
        </Stage>

        {/* Zoom Indicator */}
        <div className="absolute bottom-6 right-6 px-3 py-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-border rounded-full text-[10px] font-bold text-gray-500 shadow-sm">
           Zoom: {Math.round(scale * 100)}%
        </div>
      </div>
    </div>
  );
};

export default EditorCanvas;