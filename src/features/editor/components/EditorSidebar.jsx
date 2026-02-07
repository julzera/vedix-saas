import React, { useState } from 'react';
import { useEditor } from '../context/EditorContext';
import Button from '../../../components/ui/Button';
import { Variable, Image as ImageIcon, Trash2, Bold, Italic, Upload, Plus, ChevronDown, ChevronUp, Layers, Download, Code, X, Maximize2, Sparkles } from 'lucide-react';

const EditorSidebar = () => {
  const { 
    selectedId, updateCurrentConfig, texts, addElement, 
    handleOverlayChange, handleFileChange, file, 
    handleGenerate, isLoading, availableFonts, handleFontUpload,
    generatedImage, generateJSON
  } = useEditor();

  const config = texts.find(t => t.id === selectedId);
  const [inputText, setInputText] = useState(""); 
  const [showVarMenu, setShowVarMenu] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const toggleStyle = (type) => {
    if (!config) return;
    let current = config.fontStyle || 'normal';
    if (type === 'bold') current = current.includes('bold') ? current.replace('bold', '').trim() : `${current} bold`.trim();
    if (type === 'italic') current = current.includes('italic') ? current.replace('italic', '').trim() : `${current} italic`.trim();
    if (current === '') current = 'normal';
    updateCurrentConfig('fontStyle', current);
  };

  const copyJSON = () => {
      const json = generateJSON();
      navigator.clipboard.writeText(json);
      alert("JSON copiado!");
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.download = `vixel-arte-${Date.now()}.png`;
    link.href = generatedImage;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
        {/* CORREÇÃO: bg-white forçado para garantir o modo claro */}
        <div className="w-full h-full flex flex-col bg-white dark:bg-[#1E293B] border-l border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="p-5 flex-1 overflow-y-auto space-y-6 scrollbar-hide">
            
            {/* INSERIR */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Inserir Elementos</h3>

                <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-xl border border-gray-200 dark:border-slate-700">
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Novo Texto..." 
                            className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-primary transition-all dark:text-white"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => { if(e.key === 'Enter' && inputText) { addElement({ text: inputText, type: 'fixed' }); setInputText(""); } }}
                        />
                        <button 
                            disabled={!inputText}
                            onClick={() => { addElement({ text: inputText, type: 'fixed' }); setInputText(""); }}
                            className="bg-primary hover:bg-primary-dark text-white p-2 rounded-lg disabled:opacity-50"
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
                        <span className="flex items-center gap-2"><Variable size={16} className="text-primary"/> Variáveis & Overlay</span>
                        {showVarMenu ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                    </button>
                    
                    {showVarMenu && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-xl rounded-xl z-50 overflow-hidden p-1">
                            {['nome', 'data'].map(v => (
                                <button key={v} onClick={() => { addElement({ text: `{${v}}`, type: 'variable', fill: '#E940AA' }); setShowVarMenu(false); }} className="w-full text-left px-4 py-2 text-xs hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg">
                                    Inserir {`{${v}}`}
                                </button>
                            ))}
                            <div className="h-px bg-gray-100 dark:bg-slate-700 my-1"></div>
                            <div onClick={() => document.getElementById('overlay-upload').click()} className="w-full text-left px-4 py-2 text-xs hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 cursor-pointer flex items-center gap-2 rounded-lg">
                                <Layers size={12} className="text-primary"/> Adicionar Imagem Overlay
                            </div>
                            <input id="overlay-upload" type="file" hidden onChange={handleOverlayChange} accept="image/*" />
                        </div>
                    )}
                </div>

                <label className="flex items-center justify-center gap-2 w-full py-3 border border-dashed border-gray-300 dark:border-slate-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                    <ImageIcon size={14} className="text-gray-400"/>
                    <span className="text-xs text-gray-500 font-medium dark:text-gray-400">
                        {file ? "Trocar Imagem Base" : "Carregar Imagem Base"}
                    </span>
                    <input type="file" hidden onChange={handleFileChange} accept="image/*" />
                </label>
            </div>

            <hr className="border-gray-100 dark:border-slate-800" />

            {/* PROPRIEDADES */}
            {selectedId && config && (
            <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                <div className="flex justify-between items-center">
                    <h3 className="text-[10px] font-black text-primary uppercase tracking-widest">Editando</h3>
                    <button onClick={() => { const event = new KeyboardEvent('keydown', { key: 'Delete' }); window.dispatchEvent(event); }} className="text-red-400 hover:bg-red-50 p-1.5 rounded">
                        <Trash2 size={16} />
                    </button>
                </div>

                {selectedId !== 'overlay' ? (
                    <>
                        <input type="text" value={config.text} onChange={(e) => updateCurrentConfig('text', e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm outline-none dark:text-white" />
                        
                        <div className="flex gap-2">
                            <select value={config.fontFamily} onChange={(e) => updateCurrentConfig('fontFamily', e.target.value)} className="flex-1 px-2 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs outline-none dark:text-white cursor-pointer">
                                {availableFonts.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                            <label className="p-2 border border-gray-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800"><Upload size={14} className="text-gray-500"/><input type="file" hidden accept=".ttf,.otf,.woff" onChange={handleFontUpload} /></label>
                        </div>

                        <div className="flex items-center gap-2">
                            <input type="number" value={config.fontSize} onChange={(e) => updateCurrentConfig('fontSize', Number(e.target.value))} className="w-16 px-2 py-2 text-center text-xs border border-gray-200 dark:border-slate-700 rounded-lg bg-transparent dark:text-white outline-none" />
                            <div className="flex border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
                                <button onClick={() => toggleStyle('bold')} className={`p-2 ${config.fontStyle?.includes('bold') ? 'text-primary bg-primary/10' : 'text-gray-500'}`}><Bold size={14}/></button>
                                <button onClick={() => toggleStyle('italic')} className={`p-2 ${config.fontStyle?.includes('italic') ? 'text-primary bg-primary/10' : 'text-gray-500'}`}><Italic size={14}/></button>
                            </div>
                            <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 cursor-pointer shadow-sm ml-auto">
                                <input type="color" value={config.fill} onChange={(e) => updateCurrentConfig('fill', e.target.value)} className="absolute -top-2 -left-2 w-14 h-14 p-0 border-0 cursor-pointer" />
                            </div>
                        </div>
                    </>
                ) : <p className="text-xs text-center text-gray-400">Edite o overlay no quadro.</p>}
            </div>
            )}

            {/* ÁREA DE RESULTADO (Novo Design Clean) */}
            {generatedImage && (
                <div className="mt-auto animate-in slide-in-from-bottom-4">
                    <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles size={14} className="text-green-500"/>
                            <h3 className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Resultado Pronto</h3>
                        </div>
                        
                        {/* CARD SEM BORDA EXTRA */}
                        <div className="bg-transparent rounded-xl overflow-hidden shadow-sm">
                            <div className="relative group cursor-pointer overflow-hidden rounded-xl border border-gray-200 dark:border-slate-600" onClick={() => setShowPreviewModal(true)}>
                                <img src={generatedImage} alt="Final" className="w-full h-auto object-cover bg-white dark:bg-slate-900" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Maximize2 className="text-white drop-shadow-md" size={24} />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 mt-3">
                                <Button onClick={downloadImage} className="text-[11px] h-9 px-0 bg-green-500 hover:bg-green-600 text-white border-none shadow-md">
                                    <Download size={14} className="mr-1"/> Baixar
                                </Button>
                                <Button variant="outline" onClick={copyJSON} className="text-[11px] h-9 px-0 bg-white dark:bg-slate-700 hover:bg-gray-50 border-gray-200">
                                    <Code size={14} className="mr-1"/> JSON
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

        <div className="p-5 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-[#1E293B]">
            <Button onClick={handleGenerate} disabled={isLoading} className="w-full bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20 h-12 text-sm font-bold">
            {isLoading ? "Processando..." : "Gerar"}
            </Button>
        </div>
        </div>

        {/* MODAL PREVIEW */}
        {showPreviewModal && (
            <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200" onClick={() => setShowPreviewModal(false)}>
                <div className="relative max-w-5xl w-full max-h-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setShowPreviewModal(false)} className="absolute -top-12 right-0 text-white/70 hover:text-white p-2">
                        <X size={32}/>
                    </button>
                    
                    <img src={generatedImage} className="max-w-full max-h-[80vh] rounded-lg shadow-2xl border border-white/10 bg-[#0F172A]" />
                    
                    <div className="flex gap-4 mt-6">
                        <button onClick={downloadImage} className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-bold shadow-xl hover:scale-105 transition-transform flex items-center gap-2">
                            <Download size={20}/> Baixar Imagem
                        </button>
                        <button onClick={copyJSON} className="bg-white hover:bg-gray-100 text-slate-900 px-8 py-3 rounded-full font-bold shadow-xl hover:scale-105 transition-transform flex items-center gap-2">
                            <Code size={20}/> Copiar Código JSON
                        </button>
                    </div>
                </div>
            </div>
        )}
    </>
  );
};

export default EditorSidebar;