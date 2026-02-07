import React from 'react';
import { useEditor } from '../context/EditorContext';
import Button from '../../../components/ui/Button';
import { Type, Wand2, Plus, Variable, Layers } from 'lucide-react';

const EditorSidebar = () => {
  const { 
    selectedId, updateCurrentConfig, texts, addElement, handleOverlayChange, handleGenerate, isLoading
  } = useEditor();

  const config = texts.find(t => t.id === selectedId);

  return (
    <div className="w-full h-full flex flex-col p-5 gap-6 bg-white overflow-y-auto">
      {/* Botões de Adicionar */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Adicionar Elementos</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="text-[11px] h-9" onClick={() => addElement('fixed')}>
            <Type size={14} /> Texto
          </Button>
          <div className="relative group">
            <Button variant="outline" className="text-[11px] h-9 w-full">
              <Variable size={14} /> Variável
            </Button>
            <div className="absolute hidden group-hover:flex flex-col bg-white border border-border shadow-xl rounded-lg w-full z-20">
              {['nome', 'data'].map(v => (
                <button key={v} onClick={() => addElement('variable', v)} className="p-2 text-xs hover:bg-primary-light text-left">{v}</button>
              ))}
              <label className="p-2 text-xs hover:bg-primary-light cursor-pointer">
                Overlay (Img)
                <input type="file" hidden onChange={handleOverlayChange} />
              </label>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Editor de Propriedades */}
      {selectedId && (
        <div className="space-y-4 animate-in slide-in-from-right-2 duration-200">
           <h3 className="text-[10px] font-black text-primary uppercase tracking-widest">Propriedades</h3>
           <div>
              <label className="text-[10px] font-bold text-gray-500 mb-1 block">Conteúdo</label>
              <input 
                type="text" 
                value={config?.text || ''} 
                onChange={(e) => updateCurrentConfig('text', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
              />
           </div>
           <div>
              <label className="text-[10px] font-bold text-gray-500 mb-1 block">Cor do Texto</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={config?.fill || '#000000'} 
                  onChange={(e) => updateCurrentConfig('fill', e.target.value)}
                  className="w-12 h-10 border-none bg-transparent cursor-pointer"
                />
                <input 
                  type="text" 
                  value={config?.fill || '#000000'} 
                  onChange={(e) => updateCurrentConfig('fill', e.target.value)}
                  className="flex-1 px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono"
                />
              </div>
           </div>
        </div>
      )}

      {/* Botão de Ação Principal */}
      <div className="mt-auto">
        <Button 
          className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex gap-2"
          onClick={handleGenerate}
          disabled={isLoading}
        >
          {isLoading ? "Gerando..." : <><Wand2 size={20} /> Gerar Resultado</>}
        </Button>
      </div>
    </div>
  );
};

export default EditorSidebar;