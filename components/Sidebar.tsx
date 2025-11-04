import React from 'react';

interface SidebarProps {
    activeView: string;
    setActiveView: (view: any) => void;
}

const NavItem: React.FC<{ iconClass: string; label: string; view: string; activeView: string; onClick: (view: any) => void; }> = ({ iconClass, label, view, activeView, onClick }) => {
    const isActive = activeView === view;
    return (
        <a
            href="#"
            onClick={(e) => { e.preventDefault(); onClick(view); }}
            className={`flex items-center px-6 py-3 text-lg transition-colors duration-200 ${isActive ? 'bg-brand-gold text-white' : 'text-gray-200 hover:bg-brand-gold/50 hover:text-white'}`}
        >
            <i className={`w-6 text-center ${iconClass}`}></i>
            <span className="mx-4">{label}</span>
        </a>
    );
};


const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
    return (
        <div className="hidden md:flex flex-col w-64 bg-brand-primary">
            <div className="flex items-center justify-center h-20 shadow-md bg-white">
                <h1 className="text-3xl font-bold text-brand-primary">Refrimix</h1>
            </div>
            <div className="flex flex-col justify-between flex-1 mt-6">
                <nav>
                    <NavItem iconClass="fas fa-tachometer-alt" label="Dashboard" view="Dashboard" activeView={activeView} onClick={setActiveView} />
                    <NavItem iconClass="fas fa-bullhorn" label="Leads" view="Leads" activeView={activeView} onClick={setActiveView} />
                    <NavItem iconClass="fas fa-users" label="Clientes" view="Clientes" activeView={activeView} onClick={setActiveView} />
                    <NavItem iconClass="fas fa-calendar-alt" label="Agenda" view="Agenda" activeView={activeView} onClick={setActiveView} />
                    <NavItem iconClass="fas fa-clipboard-list" label="Ordens de Serviço" view="OS" activeView={activeView} onClick={setActiveView} />
                    <NavItem iconClass="fas fa-file-contract" label="Contratos" view="Contratos" activeView={activeView} onClick={setActiveView} />
                    <NavItem iconClass="fas fa-helmet-safety" label="Equipes" view="Equipes" activeView={activeView} onClick={setActiveView} />
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
