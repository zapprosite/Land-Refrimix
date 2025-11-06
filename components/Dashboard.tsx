import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getDashboardStats, getLeadsByMonth } from '../services/api';

interface StatCardProps {
  iconClass: string;
  title: string;
  value: string | number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ iconClass, title, value, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
    <div className={`flex items-center justify-center h-16 w-16 rounded-full ${color}`}>
      <i className={`${iconClass} text-white text-3xl`}></i>
    </div>
    <div className="ml-6">
      <p className="text-lg font-semibold text-gray-700">{title}</p>
      <p className="text-3xl font-bold text-brand-primary">{value}</p>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    novosLeads: 0,
    osAbertas: 0,
    agendamentosHoje: 0,
    satisfacaoCliente: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, chartDataValue] = await Promise.all([
          getDashboardStats(),
          getLeadsByMonth(),
        ]);
        setStats(statsData);
        setChartData(chartDataValue);
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Carregando dashboard...</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          iconClass="fas fa-bullhorn"
          title="Novos Leads (Mês)"
          value={stats.novosLeads}
          color="bg-brand-gold"
        />
        <StatCard
          iconClass="fas fa-clipboard-list"
          title="OS em Aberto"
          value={stats.osAbertas}
          color="bg-brand-accent"
        />
        <StatCard
          iconClass="fas fa-calendar-check"
          title="Agendamentos Hoje"
          value={stats.agendamentosHoje}
          color="bg-brand-gold"
        />
        <StatCard
          iconClass="fas fa-smile"
          title="Satisfação Cliente"
          value={`${stats.satisfacaoCliente}%`}
          color="bg-brand-accent"
        />
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-brand-primary mb-4">Leads por Mês</h3>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip wrapperClassName="rounded-md shadow-lg" />
              <Legend />
              <Bar dataKey="leads" fill="#003A70" name="Novos Leads" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
