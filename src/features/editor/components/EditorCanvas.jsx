import React, { useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Text, Transformer } from 'react-konva';
import { useEditor } from '../context/EditorContext';
import { Upload, Plus } from 'lucide-react';

const EditorCanvas = () => {
  const {
    scale, position, setPosition, imageObj, overlayObj,
    texts, selectedId, setSelectedId, handleWheel, handleFileChange,
    stageRef, trRef, aspectRatio, setAspectRatio
  } = useEditor();

  useEffect(() => {
    if (selectedId && trRef.current) {
      const stage = stageRef.current;
      if(selectedId === 'overlay') {
          const overlayNode = stage.findOne('.overlayObj');
          if (overlayNode) {
              trRef.current.nodes([overlayNode]);
              trRef.current.getLayer().batchDraw();
          }
      } else {
          const node = stage.findOne('#' + selectedId);
          if (node) {
            trRef.current.nodes([node]);
            trRef.current.getLayer().batchDraw();
          }
      }
    } else if (trRef.current) {
      trRef.current.nodes([]);
    }
  }, [selectedId, texts, overlayObj]);

  return (
    // CORREÇÃO: bg-slate-50 (Cinza muito claro) para Light Mode, Azul escuro para Dark
    <div className="flex flex-col flex-1 h-full w-full overflow-hidden relative bg-slate-50 dark:bg-[#0F172A] transition-colors duration-200">
      
      {/* TOOLBAR: bg-white forçado */}
      <div className="h-14 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] flex items-center justify-center gap-4 px-4 shadow-sm z-30 transition-colors">
        <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Proporção:</span>
        {['1:1', '4:5', '9:16'].map(ratio => (
          <button 
            key={ratio}
            onClick={() => setAspectRatio(ratio)}
            className={`px-4 py-1 text-xs font-bold rounded-full transition-all ${aspectRatio === ratio ? 'bg-primary text-white shadow-md' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700 dark:text-gray-400'}`}
          >
            {ratio}
          </button>
        ))}
      </div>

      {/* ÁREA DO CANVAS */}
      <div 
        className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing bg-slate-50 dark:bg-[#0F172A]"
        style={{
            backgroundImage: 'radial-gradient(var(--dot-color) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            '--dot-color': 'rgba(0, 0, 0, 0.1)' // Bolinhas cinzas suaves
        }}
      >
        {!imageObj && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-50 pointer-events-none">
                <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-2xl border border-dashed border-gray-300 dark:border-slate-700 text-center pointer-events-auto max-w-sm w-full mx-4 transition-colors">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                        <Upload size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Novo Projeto</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Comece carregando a imagem base</p>
                    
                    <label className="flex items-center justify-center w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold cursor-pointer transition-transform active:scale-95 shadow-lg shadow-primary/25 gap-2">
                        <Plus size={20} />
                        Carregar Imagem
                        <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                    </label>
                </div>
            </div>
        )}

        <Stage
          ref={stageRef}
          width={window.innerWidth} 
          height={window.innerHeight}
          scaleX={scale}
          scaleY={scale}
          x={position.x}
          y={position.y}
          draggable
          onDragEnd={(e) => {
            if (e.target === stageRef.current) {
                setPosition({ x: e.target.x(), y: e.target.y() });
            }
          }}
          onWheel={handleWheel}
          onMouseDown={(e) => {
            if (e.target === e.target.getStage()) setSelectedId(null);
          }}
        >
          <Layer>
            {imageObj && (
              <KonvaImage 
                image={imageObj} 
                x={0} y={0} 
                width={aspectRatio === '1:1' ? 600 : aspectRatio === '4:5' ? 600 : 337} 
                height={aspectRatio === '1:1' ? 600 : aspectRatio === '4:5' ? 750 : 600} 
                shadowBlur={50} shadowColor="black" shadowOpacity={0.2}
                listening={false} 
              />
            )}

            {overlayObj && (
              <KonvaImage 
                name="overlayObj"
                image={overlayObj} 
                x={50} y={50} width={150} height={150} 
                draggable 
                onClick={(e) => { e.cancelBubble = true; setSelectedId('overlay'); }}
                onTap={(e) => { e.cancelBubble = true; setSelectedId('overlay'); }}
              />
            )}

            {texts.map((t) => (
              <Text
                key={t.id}
                id={t.id}
                {...t}
                draggable
                onClick={(e) => { e.cancelBubble = true; setSelectedId(t.id); }}
                onTap={(e) => { e.cancelBubble = true; setSelectedId(t.id); }}
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

        <div className="absolute bottom-6 right-6 px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur border border-gray-200 dark:border-slate-700 rounded-full text-xs font-bold text-gray-600 dark:text-gray-300 shadow-lg pointer-events-none z-40 transition-colors">
           Zoom: {Math.round(scale * 100)}%
        </div>
      </div>
    </div>
  );
};

export default EditorCanvas;