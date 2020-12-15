import Container from "components/ui/Container";
import FormatHtml from "components/utils/FormatHtml";
import PropTypes from "prop-types";
import React from "react";
import SEO from "components/SEO";
import TitleSection from "components/ui/TitleSection";

const Post = ({ title, html, date }) => (
  <Container section>
    <SEO title={title} />
    <TitleSection title={date} subtitle={title} />
    <FormatHtml content={html} />
  </Container>
);

Post.propTypes = {
  title: PropTypes.string.isRequired,
  html: PropTypes.any.isRequired,
  date: PropTypes.string.isRequired,
};

export default Post;
