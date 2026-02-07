import React from 'react';
import Card from '../components/ui/Card';
import { LayoutDashboard, Zap, CreditCard, Clock } from 'lucide-react';

const DashboardPage = () => {
  const stats = [
    { label: 'Artes Geradas', value: '1.284', icon: Zap, color: 'text-purple-500' },
    { label: 'Créditos Restantes', value: '450', icon: CreditCard, color: 'text-pink-500' },
    { label: 'Tempo Médio', value: '2.4s', icon: Clock, color: 'text-blue-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Olá, Designer!</h2>
          <p className="text-gray-500">Aqui está o resumo da sua conta hoje.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="p-6 flex items-center gap-4">
            <div className={`p-3 rounded-2xl bg-gray-50 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-8">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <Clock size={20} className="text-primary" /> Histórico Recente
        </h3>
        <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
          Nenhuma geração encontrada nas últimas 24 horas.
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;