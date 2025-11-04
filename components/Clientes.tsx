
import React, { useState, useEffect } from 'react';
import { getClientes } from '../services/api';
import { Cliente } from '../types';

const Clientes: React.FC = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                setLoading(true);
                const data = await getClientes();
                setClientes(data);
                setError(null);
            } catch (err) {
                setError('Falha ao carregar os clientes.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchClientes();
    }, []);

    if (loading) return <div className="p-6">Carregando clientes...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-brand-primary mb-4">Lista de Clientes</h3>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-3">Nome</th>
                            <th className="p-3">Documento</th>
                            <th className="p-3">Endereço</th>
                            <th className="p-3">Contato Principal</th>
                            <th className="p-3">Tags</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map(cliente => (
                            <tr key={cliente.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-medium">{cliente.nome}</td>
                                <td className="p-3">{cliente.doc}</td>
                                <td className="p-3">{cliente.endereco}</td>
                                <td className="p-3">
                                    <div>{cliente.contato.nome}</div>
                                    <div className="text-sm text-gray-500">{cliente.contato.email}</div>
                                </td>
                                <td className="p-3">
                                    {cliente.tags.map(tag => (
                                        <span key={tag} className="bg-brand-gold/20 text-brand-primary text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Clientes;
