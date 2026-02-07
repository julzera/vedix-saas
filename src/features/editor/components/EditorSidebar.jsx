import React, { useState } from 'react';
import { useEditor } from '../context/EditorContext';
import Button from '../../../components/ui/Button';
import { Variable, Image as ImageIcon, Trash2, Bold, Italic, Upload, Plus, ChevronDown, ChevronUp } from 'lucide-react';

const EditorSidebar = () => {
  const { 
    selectedId, updateCurrentConfig, texts, addElement, 
    handleOverlayChange, handleFileChange, file, 
    handleGenerate, isLoading, availableFonts, handleFontUpload
  } = useEditor();

  const config = texts.find(t => t.id === selectedId);
  const [inputText, setInputText] = useState(""); 
  const [showVarMenu, setShowVarMenu] = useState(false);

  const toggleStyle = (type) => {
    if (!config) return;
    let current = config.fontStyle || 'normal';
    
    if (type === 'bold') {
        if (current.includes('bold')) current = current.replace('bold', '').trim();
        else current = `${current} bold`.trim();
    }
    if (type === 'italic') {
        if (current.includes('italic')) current = current.replace('italic', '').trim();
        else current = `${current} italic`.trim();
    }
    
    if (current === '') current = 'normal';
    updateCurrentConfig('fontStyle', current);
  };

  return (
    // ADICIONADO: Classes bg-surface dark:bg-surface para forçar cor correta
    <div className="w-full h-full flex flex-col bg-white dark:bg-[#1E293B] border-l border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="p-5 flex-1 overflow-y-auto space-y-6 scrollbar-hide">
        
        {/* === SEÇÃO INSERIR === */}
        <div className="space-y-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inserir</h3>

            <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-slate-700">
                <label className="text-xs font-semibold text-gray-500 mb-2 block">Novo Texto</label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        placeholder="Digite aqui..." 
                        className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-primary transition-all dark:text-white"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter' && inputText) {
                                addElement({ text: inputText, type: 'fixed' });
                                setInputText("");
                            }
                        }}
                    />
                    <button 
                        disabled={!inputText}
                        onClick={() => {
                            addElement({ text: inputText, type: 'fixed' });
                            setInputText("");
                        }}
                        className="bg-primary hover:bg-primary-dark text-white p-2 rounded-lg disabled:opacity-50 transition-colors"
                    >
                        <Plus size={18} />
                    </button>
                </div>
            </div>

            <div className="relative">
                <button 
                    onClick={() => setShowVarMenu(!showVarMenu)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium hover:border-primary transition-all dark:text-gray-200"
                >
                    <span className="flex items-center gap-2"><Variable size={16} className="text-primary"/> Variáveis</span>
                    {showVarMenu ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                </button>
                
                {showVarMenu && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-xl rounded-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                        {['nome', 'data', 'cupom'].map(v => (
                            <button 
                                key={v}
                                onClick={() => {
                                    addElement({ text: `{${v}}`, type: 'variable', fill: '#E940AA' });
                                    setShowVarMenu(false);
                                }}
                                className="w-full text-left px-4 py-3 text-xs hover:bg-primary/5 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 border-b border-gray-50 dark:border-slate-700 last:border-0"
                            >
                                {`{${v}}`}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <label className="flex items-center justify-center gap-2 w-full py-2 border border-dashed border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                <ImageIcon size={14} className="text-gray-400"/>
                <span className="text-xs text-gray-500 font-medium">Upload Imagem Base</span>
                <input type="file" hidden onChange={handleFileChange} accept="image/*" />
            </label>
        </div>

        <hr className="border-gray-100 dark:border-slate-700" />

        {/* === SEÇÃO PROPRIEDADES === */}
        {selectedId && config ? (
          <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
             <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black text-primary uppercase tracking-widest">Editando Texto</h3>
                <button 
                    onClick={() => {
                        const event = new KeyboardEvent('keydown', { key: 'Delete' });
                        window.dispatchEvent(event);
                    }} 
                    className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded transition-colors"
                >
                    <Trash2 size={16} />
                </button>
             </div>

             <div>
                <input 
                  type="text" 
                  value={config.text} 
                  onChange={(e) => updateCurrentConfig('text', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:border-primary outline-none transition-all dark:text-white"
                />
             </div>

             <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Tipografia</label>
                
                <div className="flex gap-2">
                    <select 
                        value={config.fontFamily} 
                        onChange={(e) => updateCurrentConfig('fontFamily', e.target.value)}
                        className="flex-1 px-2 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs outline-none dark:text-white"
                    >
                        {availableFonts.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <label className="p-2 border border-gray-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700" title="Upar Fonte">
                        <Upload size={14} className="text-gray-500"/>
                        <input type="file" hidden accept=".ttf,.otf,.woff" onChange={handleFontUpload} />
                    </label>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center border border-gray-200 dark:border-slate-700 rounded-lg w-20 overflow-hidden">
                        <input 
                            type="number" 
                            value={config.fontSize} 
                            onChange={(e) => updateCurrentConfig('fontSize', Number(e.target.value))}
                            className="w-full px-2 py-2 text-center text-xs outline-none bg-white dark:bg-slate-800 dark:text-white"
                        />
                    </div>

                    <div className="flex border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
                        {/* AQUI ESTAVA O ERRO DE TELA BRANCA: Adicionado ?. */}
                        <button 
                            onClick={() => toggleStyle('bold')}
                            className={`p-2 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${config.fontStyle?.includes('bold') ? 'bg-primary/10 text-primary' : 'text-gray-500'}`}
                        >
                            <Bold size={14}/>
                        </button>
                        <div className="w-px bg-gray-200 dark:bg-slate-700"></div>
                        <button 
                            onClick={() => toggleStyle('italic')}
                            className={`p-2 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${config.fontStyle?.includes('italic') ? 'bg-primary/10 text-primary' : 'text-gray-500'}`}
                        >
                            <Italic size={14}/>
                        </button>
                    </div>

                    <div className="flex-1 flex justify-end">
                        <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 cursor-pointer shadow-sm">
                            <input 
                                type="color" 
                                value={config.fill} 
                                onChange={(e) => updateCurrentConfig('fill', e.target.value)}
                                className="absolute -top-2 -left-2 w-14 h-14 p-0 border-0 cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
             </div>
          </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-40 text-gray-300 dark:text-slate-600 text-xs text-center border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-xl mt-4">
                <p>Selecione um elemento<br/>para editar</p>
            </div>
        )}
      </div>

      <div className="p-5 border-t border-border dark:border-gray-700 bg-white dark:bg-[#1E293B]">
        <Button onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? "..." : "Baixar Resultado"}
        </Button>
      </div>
    </div>
  );
};

export default EditorSidebar;