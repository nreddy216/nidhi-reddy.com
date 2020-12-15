import Education from "components/Education";
import Experience from "components/Experience";
import Layout from "components/Layout";
import React from "react";
import SEO from "components/SEO";
import Skills from "components/Skills";

const ResumePage: React.FC = () => (
  <Layout>
    <SEO title="Resume" />
    <Experience />
    <hr />
    <Education />
    <hr />
    <Skills />
  </Layout>
);

export default ResumePage;
