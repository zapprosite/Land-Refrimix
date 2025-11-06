import React from 'react';

interface PortfolioItem {
  src: string;
  alt: string;
  title: string;
  brand: string;
}

const portfolioItems: PortfolioItem[] = [
  {
    src: 'https://www.daikin.com.br/-/media/images/products/vrv/vrv-s-com-seer-elevado/overview/vrv-s-com-seer-elevado.png',
    alt: 'Unidade condensadora Daikin VRV S de alta eficiência',
    title: 'VRV S High-Efficiency',
    brand: 'Daikin',
  },
  {
    src: 'https://br.mitsubishielectric.com/pt/products-solutions/air-conditioning/images/img-key-visual-city-multi.png',
    alt: 'Sistema Mitsubishi Electric City Multi VRF',
    title: 'City Multi VRF',
    brand: 'Mitsubishi Electric',
  },
  {
    src: 'https://www.lg.com/br/business/images/ar-condicionado/md07530999/gallery/medium01.jpg',
    alt: 'Unidade externa LG Multi V 5',
    title: 'Multi V 5',
    brand: 'LG',
  },
  {
    src: 'https://www.daikin.com.br/-/media/images/products/multi-split-advance/unidades-internas/unidade-interna-hi-wall-advance.png',
    alt: 'Unidade interna high-wall Daikin Advance',
    title: 'High-Wall Advance',
    brand: 'Daikin',
  },
  {
    src: 'https://www.daikin.eu/content/dam/product-images/FTXF-F/FTXF-F_3D_view_01.png',
    alt: 'Unidade interna Daikin FTXF-F high-wall',
    title: 'High-Wall FTXF-F',
    brand: 'Daikin Europe',
  },
  {
    src: 'https://www.systemair.com/globalassets/products-new/air-distribution-products/diffusers/slot-diffusers/nova-l/nova-l_1.png',
    alt: 'Difusor linear Systemair NOVA-L',
    title: 'Difusor Linear',
    brand: 'Systemair',
  },
];

const Portfolio: React.FC = () => {
  return (
    <section id="portfolio" className="py-20 bg-light-card dark:bg-dark-card">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Portfólio de Soluções</h2>
          <p className="text-lg text-light-fg/80 dark:text-dark-fg/80">
            Equipamentos de alta performance que integramos em nossos projetos.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.map((item, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-lg shadow-lg bg-light-bg dark:bg-dark-bg"
            >
              <img
                loading="lazy"
                src={item.src}
                alt={item.alt}
                className="w-full h-64 object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-4 bg-light-card dark:bg-dark-card/50">
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-brand-gold">{item.brand}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
