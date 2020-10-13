import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
// import Img from 'gatsby-image';
// import Link from 'gatsby-link';
// import { motion } from 'framer-motion';
// import FormatHtml from 'components/utils/FormatHtml';
// import BlogPost from 'components/'

import Container from 'components/ui/Container';
import TitleSection from 'components/ui/TitleSection';
import Post from 'components/Post';

import * as Styled from './styles';

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
        filter: { frontmatter: { category: { eq: "blog" }, published: { eq: true } } }
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

  // const sectionTitle = markdownRemark.frontmatter;
  const posts = allMarkdownRemark.edges;

  return (
    <Container section>
      {/* <TitleSection title={sectionTitle.title} subtitle={sectionTitle.subtitle} center /> */}
      <Styled.Posts>
        {posts.map((item) => {
          const {
            id,
            fields: { slug },
            frontmatter: { title, cover, description, date, tags },
            html
          } = item.node;

          return (
            <Post key={id} title={title} date={date} html={html} />
          );
        })}
      </Styled.Posts>
    </Container>
  );
};

export default Posts;
