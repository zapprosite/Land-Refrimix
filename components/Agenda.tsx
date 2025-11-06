import React, { useState, useEffect } from 'react';
import { getAgendamentos } from '../services/api';
import { Agendamento, AgendamentoStatus } from '../types';

const statusColors: { [key in AgendamentoStatus]: string } = {
  [AgendamentoStatus.Agendado]: 'bg-blue-100 text-blue-800',
  [AgendamentoStatus.EmAndamento]: 'bg-yellow-100 text-yellow-800',
  [AgendamentoStatus.Concluido]: 'bg-green-100 text-green-800',
  [AgendamentoStatus.Cancelado]: 'bg-red-100 text-red-800',
};

const Agenda: React.FC = () => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgendamentos = async () => {
      try {
        setLoading(true);
        const data = await getAgendamentos();
        setAgendamentos(data);
        setError(null);
      } catch (err) {
        setError('Falha ao carregar a agenda.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAgendamentos();
  }, []);

  if (loading) return <div className="p-6">Carregando agenda...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-brand-primary mb-4">Agenda de Serviços</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-3">Cliente</th>
              <th className="p-3">Serviço</th>
              <th className="p-3">Janela de Atendimento</th>
              <th className="p-3">Técnico</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {agendamentos.map((ag) => (
              <tr key={ag.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{ag.cliente.nome}</td>
                <td className="p-3">{ag.servico}</td>
                <td className="p-3">
                  {formatDate(ag.janela_inicio)} - {formatDate(ag.janela_fim)}
                </td>
                <td className="p-3">{ag.tecnico.nome}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[ag.status]}`}
                  >
                    {ag.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Agenda;
