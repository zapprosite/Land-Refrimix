import React from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Leads from './Leads';
import Clientes from './Clientes';
import Agenda from './Agenda';
import { useAuth } from '../contexts/AuthContext';

const DashboardLayout: React.FC = () => {
    const [activeView, setActiveView] = React.useState('Dashboard');
    const { user, signOut } = useAuth();

    const renderView = () => {
        switch (activeView) {
            case 'Dashboard': return <Dashboard />;
            case 'Leads': return <Leads />;
            case 'Clientes': return <Clientes />;
            case 'Agenda': return <Agenda />;
            case 'OS': 
            case 'Contratos':
            case 'Equipes':
                return <div className="p-6 bg-white rounded-lg shadow-md">Funcionalidade de <strong>{activeView}</strong> a ser implementada.</div>;
            default: return <Dashboard />;
        }
    };
    
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar activeView={activeView} setActiveView={setActiveView} />
            <div className="flex flex-col flex-1 overflow-y-auto">
                <header className="flex items-center justify-between p-6 bg-white border-b sticky top-0 z-10">
                    <h2 className="text-2xl font-semibold text-brand-primary">{activeView}</h2>
                    <div className="flex items-center">
                        <span className="mr-4 text-gray-600">Olá, <span className="font-medium">{user?.user_metadata.full_name || user?.email}</span></span>
                        <button 
                            onClick={signOut}
                            className="bg-brand-gold text-white font-bold py-2 px-4 rounded-md hover:bg-brand-primary transition-colors"
                        >
                            Sair
                        </button>
                    </div>
                </header>
                <main className="p-6">
                    {renderView()}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
