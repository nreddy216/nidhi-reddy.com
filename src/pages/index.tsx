import React from 'react';

import Layout from 'components/Layout';
import SEO from 'components/SEO';
import HeroBanner from 'components/HeroBanner';
import Services from 'components/Services';
import Testimonials from 'components/Testimonials';
import Experience from 'components/Experience';
import Projects from 'components/Projects';
import TitleSection from 'components/ui/TitleSection';
import Container from 'components/ui/Container';
import Button from 'components/ui/Button';

const IndexPage: React.FC = () => {
  return (
    <Layout>
      <SEO title="Nidhi Reddy, Freelance Web Developer" />
      <HeroBanner />
      <hr />
      <Container section>
        <TitleSection title="projects" subtitle="featured" center />
        <Projects filteredTags={["Work", "NotWork"]} featured showTags wide />
        {/* <Button>
          View more projects
          <Link></Link>
        </Button> */}
      </Container>
    </Layout>
  );
};

export default IndexPage;
