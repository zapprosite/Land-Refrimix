
import React, { useState, useEffect } from 'react';
import { getLeads, updateLeadStatus } from '../services/api';
import { Lead, LeadStatus } from '../types';

const Leads: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('');

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                setLoading(true);
                const data = await getLeads();
                setLeads(data);
                setError(null);
            } catch (err) {
                setError('Falha ao carregar os leads.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeads();
    }, []);

    const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
        try {
            const updatedLead = await updateLeadStatus(id, newStatus);
            setLeads(leads.map(lead => (lead.id === id ? updatedLead : lead)));
        } catch (err) {
            alert('Falha ao atualizar o status do lead.');
        }
    };
    
    const filteredLeads = leads.filter(lead =>
        lead.nome.toLowerCase().includes(filter.toLowerCase()) ||
        lead.email.toLowerCase().includes(filter.toLowerCase())
    );

    if (loading) return <div className="p-6">Carregando leads...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-brand-primary">Gerenciamento de Leads</h3>
                <input
                    type="text"
                    placeholder="Filtrar por nome ou email..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="p-2 border rounded-md"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-3">Nome</th>
                            <th className="p-3">Contato</th>
                            <th className="p-3">Origem</th>
                            <th className="p-3">Data</th>
                            <th className="p-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLeads.map(lead => (
                            <tr key={lead.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-medium">{lead.nome}</td>
                                <td className="p-3">
                                    <div>{lead.email}</div>
                                    <div className="text-sm text-gray-500">{lead.telefone}</div>
                                </td>
                                <td className="p-3">{lead.origem}</td>
                                <td className="p-3">{new Date(lead.created_at).toLocaleDateString()}</td>
                                <td className="p-3">
                                    <select 
                                        value={lead.status}
                                        onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                                        className="p-1 border rounded-md bg-gray-100"
                                    >
                                        {Object.values(LeadStatus).map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leads;
