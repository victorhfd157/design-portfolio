import React from 'react';
import HeroLab from './HeroLab';
import Gallery from './Gallery';
import About from './About';
import Contact from './Contact';

const Home: React.FC = () => {
  return (
    <>
      <HeroLab />
      <Gallery />
      <About />
      <Contact />
    </>
  );
};

export default Home;