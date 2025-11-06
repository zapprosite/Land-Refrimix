import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-primary text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-bold mb-2">Refrimix Tecnologia</h3>
            <p className="text-gray-300">Sua especialista em climatização de alto padrão.</p>
            <p className="text-gray-400 mt-4 text-sm">
              &copy; {new Date().getFullYear()} Refrimix. Todos os direitos reservados.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-3">Contato</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <i className="fas fa-map-marker-alt mr-2"></i>Av. Paulista, 1000 - São Paulo, SP
              </li>
              <li>
                <i className="fas fa-phone mr-2"></i>(11) 5555-1234
              </li>
              <li>
                <i className="fas fa-envelope mr-2"></i>contato@refrimix.com.br
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-3">Siga-nos</h4>
            <div className="flex space-x-4 justify-center md:justify-start">
              <a href="#" className="text-2xl hover:text-brand-gold transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-2xl hover:text-brand-gold transition-colors">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-2xl hover:text-brand-gold transition-colors">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
            <a href="#" className="text-sm text-gray-400 mt-4 inline-block hover:text-white">
              Política de Privacidade (LGPD)
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
