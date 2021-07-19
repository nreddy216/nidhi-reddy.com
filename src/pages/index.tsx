import Container from "components/ui/Container";
import HeroAnimation from "components/HeroAnimation";
import HeroBanner from "components/HeroBanner";
import Layout from "components/Layout";
import Projects from "components/Projects";
import React from "react";
import SEO from "components/SEO";
import TitleSection from "components/ui/TitleSection";

const IndexPage: React.FC = () => {
  return (
    <Layout>
      <SEO />
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
