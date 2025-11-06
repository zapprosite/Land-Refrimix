import React from 'react';
import Header from './Header';
import Hero from './Hero';
import Benefits from './Benefits';
import Portfolio from './Portfolio';
import Services from './Services';
import Contact from './Contact';
import Footer from './Footer';
import Chatbot from './Chatbot';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <Hero />
        <Benefits />
        <Portfolio />
        <Services />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default LandingPage;
