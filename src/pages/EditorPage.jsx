import React from 'react';
import EditorCanvas from '../features/editor/components/EditorCanvas';
import EditorSidebar from '../features/editor/components/EditorSidebar';

const EditorPage = () => {
  return (
    <div className="flex h-full w-full overflow-hidden bg-white dark:bg-slate-900 transition-colors">
      
      {/* CANVAS (Ocupa o espaço restante) */}
      <div className="flex-1 h-full relative overflow-hidden z-0">
        <EditorCanvas />
      </div>

      {/* SIDEBAR DIREITA (Largura fixa e proibida de encolher) */}
      <div className="w-[320px] min-w-[320px] max-w-[320px] flex-shrink-0 h-full z-20 border-l border-border bg-white dark:bg-slate-900 shadow-2xl transition-colors">
        <EditorSidebar />
      </div>

    </div>
  );
};

export default EditorPage;