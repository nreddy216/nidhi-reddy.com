import React from 'react';

import Layout from 'components/Layout';
import SEO from 'components/SEO';
import HeroBanner from 'components/HeroBanner';
import HeroAnimation from 'components/HeroAnimation';
import Projects from 'components/Projects';
import TitleSection from 'components/ui/TitleSection';
import Container from 'components/ui/Container';

const IndexPage: React.FC = () => {
  return (
    <Layout>
      <SEO title="Portfolio" />
      <HeroAnimation />
      <HeroBanner />
      <hr />
      <Container section>
        <TitleSection title="projects" subtitle="featured" center />
        <Projects filteredTags={["Work", "NotWork"]} featured showTags wide />
      </Container>
    </Layout>
  );
};

export default IndexPage;
