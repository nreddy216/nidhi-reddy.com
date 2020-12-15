import * as Styled from "./styles";

import { graphql, useStaticQuery } from "gatsby";

import Container from "components/ui/Container";
import Post from "components/Post";
import React from "react";

const Posts = () => {
  const { markdownRemark, allMarkdownRemark } = useStaticQuery(graphql`
    query {
      markdownRemark(frontmatter: { category: { eq: "blog section" } }) {
        frontmatter {
          title
          subtitle
        }
      }
      allMarkdownRemark(
        filter: {
          frontmatter: { category: { eq: "blog" }, published: { eq: true } }
        }
        sort: { fields: frontmatter___date, order: DESC }
      ) {
        edges {
          node {
            id
            html
            fields {
              slug
            }
            frontmatter {
              title
              description
              date(formatString: "MMM DD, YYYY")
              tags
              cover {
                childImageSharp {
                  fluid(maxWidth: 800) {
                    ...GatsbyImageSharpFluid
                  }
                }
              }
            }
          }
        }
      }
    }
  `);

  const posts = allMarkdownRemark.edges;

  return (
    <Container section>
      <Styled.Posts>
        {posts.map((item) => {
          const {
            id,
            fields: { slug },
            frontmatter: { title, cover, description, date, tags },
            html,
          } = item.node;

          return (
            <div key={id}>
              <Post title={title} date={date} html={html} />
              <Styled.Tags>
                {tags.map((item) => (
                  <Styled.Tag key={item}>{item}</Styled.Tag>
                ))}
              </Styled.Tags>
            </div>
          );
        })}
      </Styled.Posts>
    </Container>
  );
};

export default Posts;
