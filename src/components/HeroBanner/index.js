import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';

import Banner from 'components/ui/Banner';

const HeroBanner = () => {
  const { markdownRemark } = useStaticQuery(graphql`
    query {
      markdownRemark(frontmatter: { category: { eq: "hero banner" } }) {
        frontmatter {
          title
          subtitle
          content
        }
      }
    }
  `);

  const heroBanner = markdownRemark.frontmatter;

  return (
    <Banner
      title={heroBanner.title}
      subtitle={heroBanner.subtitle}
      content={heroBanner.content}
      linkTo={heroBanner.linkTo ? heroBanner.linkTo : null}
      linkText={heroBanner.linkText ? heroBanner.linkText : null}
    />
  );
};

HeroBanner.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  content: PropTypes.string,
  linkTo: PropTypes.string,
  linkText: PropTypes.string
};

export default HeroBanner;
