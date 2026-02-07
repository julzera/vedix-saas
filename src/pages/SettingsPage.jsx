import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { User, Globe, Shield } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in zoom-in-95 duration-300">
      <h2 className="text-2xl font-bold text-gray-800">Configurações</h2>
      
      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <Globe className="text-primary" />
          <h3 className="font-bold">Conexão API</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Endpoint da VPS</label>
            <input 
              type="text" 
              defaultValue="https://api.limonixdigital.com"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-mono text-sm"
            />
          </div>
          <Button variant="primary">Salvar Endpoint</Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-6">
          <Shield className="text-primary" />
          <h3 className="font-bold">Segurança</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">Seu token de acesso expira em 30 dias.</p>
        <Button variant="outline">Renovar Chave de API</Button>
      </Card>
    </div>
  );
};

export default SettingsPage;