import Container from "components/ui/Container";
import Layout from "components/Layout";
import Projects from "components/Projects";
import React from "react";
import SEO from "components/SEO";
import TitleSection from "components/ui/TitleSection";

const ProjectPage: React.FC = () => {
  return (
    <Layout>
      <SEO title="Projects" />
      <Container section>
        <TitleSection
          title="Work"
          subtitle="coding | designing | leading"
          center
        />
        <Projects filteredTags={["Work"]} showTags />
      </Container>
      <Container section>
        <TitleSection
          title="Not Work"
          subtitle="creative experimenting | ar/vr | art"
          center
        />
        <Projects filteredTags={["NotWork"]} showTags />
      </Container>
    </Layout>
  );
};

export default ProjectPage;
