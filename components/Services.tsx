
import React from 'react';

const ServiceCard: React.FC<{ icon: string; title: string; children: React.ReactNode; todo?: string }> = ({ icon, title, children, todo }) => (
     <div className="border border-light-border dark:border-dark-border p-8 rounded-lg">
        <div className="text-brand-primary dark:text-brand-gold text-4xl mb-4">
            <i className={`fas ${icon}`}></i>
        </div>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-light-fg/80 dark:text-dark-fg/80 mb-4">{children}</p>
        {todo && <p className="text-sm text-gray-500 italic">{todo}</p>}
    </div>
);

const Services: React.FC = () => {
    return (
        <section id="servicos" className="py-20 bg-light-bg dark:bg-dark-bg">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                     <h2 className="text-3xl md:text-4xl font-bold mb-2">Serviços Especializados</h2>
                     <p className="text-lg text-light-fg/80 dark:text-dark-fg/80">Soluções completas, do projeto à manutenção.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <ServiceCard icon="fa-clipboard-check" title="PMOC e Manutenção">
                        Planos de Manutenção, Operação e Controle para garantir a qualidade do ar e a eficiência do seu sistema de climatização, em conformidade com a legislação.
                   </ServiceCard>
                   <ServiceCard icon="fa-file-signature" title="Laudos e ART" todo="// TODO: Integrar Drive para upload de fotos e assinatura digital">
                        Emissão de laudos técnicos detalhados com fotos e assinatura digital, além de Anotação de Responsabilidade Técnica (ART) para todos os serviços.
                   </ServiceCard>
                   <ServiceCard icon="fa-drafting-compass" title="Projetos e Consultoria">
                        Desenvolvimento de projetos de climatização personalizados, focados em eficiência energética e adequação arquitetônica para sistemas VRV/VRF.
                   </ServiceCard>
                   <ServiceCard icon="fa-file-pdf" title="Propostas em PDF" todo="// TODO: Integrar função para gerar e enviar propostas PDF">
                        Receba propostas técnicas e comerciais detalhadas em formato PDF, com clareza e profissionalismo, diretamente no seu e-mail.
                   </ServiceCard>
                </div>
            </div>
        </section>
    );
};

export default Services;
