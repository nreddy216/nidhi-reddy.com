import React from "react";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";

import Banner from "components/ui/Banner";
import Container from "components/ui/Container";
import FormatHtml from "components/utils/FormatHtml";

import * as Styled from "./styles";

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

  const { title, subtitle, content } = markdownRemark.frontmatter;

  return (
    <Container>
      {/* <Styled.Title>
        {title}
        <br />
        (nid-thee)
        <br />
      </Styled.Title> */}
      <Styled.SubTitle>
      {title}
      </Styled.SubTitle>
      <Styled.SubTitle>
        <FormatHtml content={subtitle} />
      </Styled.SubTitle>
      <Styled.Content>
        <FormatHtml content={content} />
      </Styled.Content>
    </Container>
  );
};

HeroBanner.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  content: PropTypes.string,
  linkTo: PropTypes.string,
  linkText: PropTypes.string,
};

export default HeroBanner;
