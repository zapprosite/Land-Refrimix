import React from 'react';

const Hero: React.FC = () => {
  const heroImageUrl =
    'https://www.daikin.com.br/-/media/images/products/vrv/vrv-inova/banner/banner-hero-vrv-inova-1600x640.jpg';

  return (
    <section
      id="hero"
      className="relative h-[80vh] min-h-[500px] flex items-center justify-center text-center text-white"
      style={{
        backgroundImage: `url(${heroImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-brand-black opacity-60"></div>
      <div className="relative z-10 p-6">
        <h2 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-lg">
          A Vanguarda em Climatização <span className="text-brand-gold">VRV/VRF</span>
        </h2>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 drop-shadow-md">
          Projetos residenciais e comerciais de alto padrão com a máxima eficiência, conforto e
          tecnologia.
        </p>
        <a
          href="#contato"
          className="bg-brand-gold text-brand-black font-bold py-3 px-8 rounded-lg text-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105"
        >
          Solicite uma Proposta
        </a>
      </div>
    </section>
  );
};

export default Hero;
