import React from 'react';

import Layout from 'components/Layout';
import SEO from 'components/SEO';
import Projects from 'components/Projects';
import Container from 'components/ui/Container';
import TitleSection from 'components/ui/TitleSection';

const ProjectPage: React.FC = () => {
  return (
    <Layout>
      <SEO title="Projects" />
      <Container section>
        <TitleSection title="Work" subtitle="Coding, tech leading, motion design" center />
        <Projects filteredTags={["Work"]} showTags />
      </Container>
      <Container section>
        <TitleSection title="Not Work" subtitle="Experiments, art, animation, AR/VR" center />
        <Projects filteredTags={["NotWork"]} showTags />
      </Container>
    </Layout>
  );
};

export default ProjectPage;
