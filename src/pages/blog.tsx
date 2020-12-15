import Layout from "components/Layout";
import Posts from "components/Posts";
import React from "react";
import SEO from "components/SEO";

const BlogPage: React.FC = () => {
  return (
    <Layout>
      <SEO title="Blog" />
      <Posts />
    </Layout>
  );
};

export default BlogPage;
