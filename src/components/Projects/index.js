import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
import Link from 'gatsby-link';
import { motion } from 'framer-motion';

import Container from 'components/ui/Container';
import TitleSection from 'components/ui/TitleSection';

import * as Styled from './styles';

const Projects = ({ featured }) => {
  const { markdownRemark, allMarkdownRemark } = useStaticQuery(graphql`
    query {
      markdownRemark(frontmatter: { category: { eq: "projects" } }) {
        frontmatter {
          title_featured
          subtitle_featured
          title_all
          subtitle_all
        }
      }
      allMarkdownRemark(
        filter: { frontmatter: { category: { eq: "projects" }, published: { eq: true } } }
        sort: { fields: frontmatter___order, order: ASC }
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
              featured
              date
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

  const sectionTitle = markdownRemark.frontmatter;
  const projects = allMarkdownRemark.edges;

  return (
    <Container section>
      {featured ? <TitleSection title={sectionTitle.title_featured} subtitle={sectionTitle.subtitle_featured} center /> : <TitleSection title={sectionTitle.title_all} subtitle={sectionTitle.subtitle_all} center />}
      <Styled.Projects>
        {projects.filter(item => {
          if (featured) {
            return item.node.frontmatter.featured;
          } else {
            return true;
          }
        }).map((item) => {

          const {
            id,
            fields: { slug },
            frontmatter: { title, cover, description, date, tags }
          } = item.node;

          return (
            <Styled.Project key={id}>
              <Link to={slug}>
                <motion.div whileHover={{ scale: 1.05 }} whiletap={{ scale: 1 }}>
                  <Styled.Card>
                    <Styled.Image>
                      <Img fluid={cover.childImageSharp.fluid} alt={title} />
                    </Styled.Image>
                    <Styled.Content>
                      <Styled.Date>{date}</Styled.Date>
                      <Styled.Title>{title}</Styled.Title>
                      <Styled.Description>{description}</Styled.Description>
                    </Styled.Content>
                    <Styled.Tags>
                      {tags.map((item) => (
                        <Styled.Tag key={item}>{item}</Styled.Tag>
                      ))}
                    </Styled.Tags>
                  </Styled.Card>
                </motion.div>
              </Link>
            </Styled.Project>
          );
        })}
      </Styled.Projects>
    </Container>
  );
};

export default Projects;
