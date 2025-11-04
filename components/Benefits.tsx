
import React from 'react';

const BenefitCard: React.FC<{ icon: string; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-light-card dark:bg-dark-card p-8 rounded-lg shadow-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
        <div className="text-brand-gold text-5xl mb-4">
            <i className={`fas ${icon}`}></i>
        </div>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-light-fg/80 dark:text-dark-fg/80">{children}</p>
    </div>
);


const Benefits: React.FC = () => {
    return (
        <section id="beneficios" className="py-20 bg-light-bg dark:bg-dark-bg">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                     <h2 className="text-3xl md:text-4xl font-bold mb-2">Por que escolher a Refrimix?</h2>
                     <p className="text-lg text-light-fg/80 dark:text-dark-fg/80">Entregamos mais do que ar condicionado, proporcionamos bem-estar.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <BenefitCard icon="fa-cogs" title="Tecnologia de Ponta">
                        Trabalhamos com os sistemas VRV/VRF mais avançados do mercado, garantindo performance e controle total do seu ambiente.
                    </BenefitCard>
                    <BenefitCard icon="fa-leaf" title="Eficiência Energética">
                        Nossas soluções são projetadas para reduzir o consumo de energia, gerando economia e sustentabilidade para seu projeto.
                    </BenefitCard>
                    <BenefitCard icon="fa-shield-alt" title="Confiabilidade e PMOC">
                        Equipe certificada e planos de manutenção (PMOC) que asseguram a longevidade e a qualidade do ar em seus equipamentos.
                    </BenefitCard>
                </div>
            </div>
        </section>
    );
};

export default Benefits;
