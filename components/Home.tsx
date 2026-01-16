import React from 'react';
import Hero from './Hero';
import Gallery from './Gallery';
import About from './About';
import Contact from './Contact';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <Gallery />
      <About />
      <Contact />
    </>
  );
};

export default Home;