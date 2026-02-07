import React from 'react';
import { EditorProvider } from '../features/editor/context/EditorContext';
import EditorCanvas from '../features/editor/components/EditorCanvas';
import EditorSidebar from '../features/editor/components/EditorSidebar';

const EditorPage = () => {
  return (
    <EditorProvider>
      <div className="flex h-full w-full overflow-hidden bg-white dark:bg-slate-900 transition-colors">
        
        {/* LADO ESQUERDO / CENTRO - O EDITOR */}
        <div className="flex-1 h-full relative z-0">
          <EditorCanvas />
        </div>

        {/* LADO DIREITO - BARRA DE CONTROLE (TRAVADA EM 320PX) */}
        <div className="w-[320px] min-w-[320px] h-full z-10 border-l border-border bg-white dark:bg-slate-900 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)] transition-colors">
          <EditorSidebar />
        </div>

      </div>
    </EditorProvider>
  );
};

export default EditorPage;