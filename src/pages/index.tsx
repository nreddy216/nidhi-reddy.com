import React from 'react';

import Layout from 'components/Layout';
import SEO from 'components/SEO';
import HeroBanner from 'components/HeroBanner';
import Services from 'components/Services';
import Testimonials from 'components/Testimonials';
import Experience from 'components/Experience';
import Projects from 'components/Projects';

const IndexPage: React.FC = () => {
  return (
    <Layout>
      <SEO title="About Me" />
      <HeroBanner />
      {/* <Services /> */}
      {/* <Experience /> */}
      <hr />
      {/* <Testimonials /> */}
      <Projects featured />
    </Layout>
  );
};

export default IndexPage;
