import * as Styled from "./styles";

import { graphql, useStaticQuery } from "gatsby";

import Container from "components/ui/Container";
import FormatHtml from "components/utils/FormatHtml";
import PropTypes from "prop-types";
import React from "react";

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
      <Styled.Title>
        <Styled.CurvedPath
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          version="1.1"
          viewBox="0 60 600 180"
        >
          <defs>
            <path d="M 50 50 Q 300 300 550 50" id="curved-path"></path>
            <linearGradient id="curved-path-gradient">
              <stop offset="5%" stop-color="#48bb78" />
              <stop offset="95%" stop-color="#3c366b" />
            </linearGradient>
          </defs>
          <Styled.CurvedText>
            <textPath role="h1" startOffset="162" xlinkHref="#curved-path">
              {title} (ni-thee)
            </textPath>
          </Styled.CurvedText>
        </Styled.CurvedPath>
      </Styled.Title>
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
