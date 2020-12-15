import ContactInfo from "components/ContactInfo";
import Layout from "components/Layout";
import React from "react";
import SEO from "components/SEO";

const ContactPage: React.FC = () => {
  return (
    <Layout>
      <SEO title="Contact" />
      <ContactInfo as="a" />
    </Layout>
  );
};

export default ContactPage;
