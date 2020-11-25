import React from "react";
import { useStaticQuery, graphql } from "gatsby";

import * as Styled from "./styles";

const NameOnPath = () => {
  const { markdownRemark } = useStaticQuery(graphql`
    query {
      markdownRemark(frontmatter: { category: { eq: "hero banner" } }) {
        frontmatter {
          title
        }
      }
    }
  `);

  const title = markdownRemark.frontmatter.title;

  return <Styled.Name>{title}</Styled.Name>;
};

export default NameOnPath;
