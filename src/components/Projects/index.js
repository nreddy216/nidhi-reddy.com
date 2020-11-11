import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import Img from "gatsby-image";
import Link from "gatsby-link";
import { motion } from "framer-motion";

import Container from "components/ui/Container";
import TitleSection from "components/ui/TitleSection";

import * as Styled from "./styles";

const ProjectCard = ({
  cover,
  imageStyle,
  title,
  date,
  description,
  hideTags,
  tags,
  filteredTags,
}) => {
  return (
    <Styled.Card>
      {cover && (
        <Styled.Image imageStyle={imageStyle}>
          <Img fluid={cover.childImageSharp.fluid} alt={title} />
        </Styled.Image>
      )}
      <Styled.Content>
        {/* <Styled.Date>{date}</Styled.Date> */}
        <Styled.Title>{title}</Styled.Title>
        <Styled.Description>{description}</Styled.Description>
      </Styled.Content>
      {!hideTags && (
        <Styled.Tags>
          {tags.sort().map((tag) => {
            if (filteredTags && filteredTags.includes(tag)) {
              return null;
            } else {
              return <Styled.Tag key={tag}>{tag}</Styled.Tag>;
            }
          })}
        </Styled.Tags>
      )}
    </Styled.Card>
  );
};

const ProjectCardWide = ({
  cover,
  imageStyle,
  title,
  date,
  description,
  hideTags,
  tags,
  filteredTags,
}) => {
  return (
    <Styled.CardWide>
      {cover && (
        <Styled.ImageWide imageStyle={imageStyle}>
          <Img fluid={cover.childImageSharp.fluid} alt={title} />
        </Styled.ImageWide>
      )}
      <Styled.Content>
        <Styled.Date>{date}</Styled.Date>
        <Styled.Title>{title}</Styled.Title>
        <Styled.Description>{description}</Styled.Description>
        {!hideTags && (
          <Styled.TagsWide>
            {tags.map((tag) => {
              if (filteredTags && filteredTags.includes(tag)) {
                return <span />;
              } else {
                return <Styled.Tag key={tag}>{tag}</Styled.Tag>;
              }
            })}
          </Styled.TagsWide>
        )}
      </Styled.Content>
    </Styled.CardWide>
  );
};

const Projects = ({ featured, filteredTags, hideTags, wide }) => {
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
        filter: {
          frontmatter: { category: { eq: "projects" }, published: { eq: true } }
        }
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
              image_style
            }
          }
        }
      }
    }
  `);

  const sectionTitle = markdownRemark.frontmatter;
  const projects = allMarkdownRemark.edges;

  return (
    <Styled.Projects>
      {projects
        .filter((item) => {
          if (featured) {
            if (filteredTags) {
              return (
                filteredTags.some((i) =>
                  item.node.frontmatter.tags.includes(i)
                ) && item.node.frontmatter.featured
              );
            } else {
              return item.node.frontmatter.featured;
            }
          } else if (filteredTags) {
            return filteredTags.some((i) =>
              item.node.frontmatter.tags.includes(i)
            );
          }
        })
        .map((item) => {
          const {
            id,
            fields: { slug },
            frontmatter: { title, cover, description, date, tags, image_style },
          } = item.node;

          return (
            <Styled.Project
              key={id}
              className={wide ? "w-full" : "w-full sm:w-1/2"}
            >
              <Link to={slug} className={"project-link"}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whiletap={{ scale: 1 }}
                >
                  {wide ? (
                    <ProjectCardWide
                      date={date}
                      title={title}
                      description={description}
                      cover={cover}
                      imageStyle={image_style}
                      filteredTags={filteredTags}
                      hideTags={hideTags}
                      tags={tags}
                    />
                  ) : (
                    <ProjectCard
                      date={date}
                      title={title}
                      description={description}
                      cover={cover}
                      imageStyle={image_style}
                      filteredTags={filteredTags}
                      hideTags={hideTags}
                      tags={tags}
                    />
                  )}
                </motion.div>
              </Link>
            </Styled.Project>
          );
        })}
    </Styled.Projects>
  );
};

export default Projects;
