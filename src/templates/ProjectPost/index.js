import React from "react";
import { graphql } from "gatsby";
import Link from "gatsby-link";

import Layout from "components/Layout";
import SEO from "components/SEO";
import Container from "components/ui/Container";
import TitleSection from "components/ui/TitleSection";
import FormatHtml from "components/utils/FormatHtml";
import Img from "gatsby-image";
import Button from "components/ui/Button";

import * as Styled from "./styles";
import Icon from "components/ui/Icon";

const ProjectPost = ({ data, pageContext }) => {
  const post = data.markdownRemark;
  const { previous, next } = pageContext;

  return (
    <Layout>
      <SEO title={post.frontmatter.title} scripts={post.frontmatter.scripts} />
      <Container section>
        <Container sectionY>
          <TitleSection
            project
            subtitle={post.frontmatter.date}
            title={post.frontmatter.title}
          />
          {post.frontmatter.description && (
            <em>
              <FormatHtml
                content={
                  post.frontmatter.description_long
                    ? post.frontmatter.description_long
                    : post.frontmatter.description
                }
              />
            </em>
          )}
          {post.frontmatter.cover && (
            <Styled.Image>
              <Img
                fluid={post.frontmatter.cover.childImageSharp.fluid}
                alt={post.frontmatter.title}
              />
            </Styled.Image>
          )}
          {post.frontmatter.url && (
            <Button as="a" primary href={post.frontmatter.url}>
              View site
              <Icon icon={`external-link-alt`} />
            </Button>
          )}
        </Container>
        {post.html && <FormatHtml content={post.html} />}
        <Styled.Links>
          <span>
            {previous && (
              <Link to={previous.fields.slug} rel="previous">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </span>
          <span>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </span>
        </Styled.Links>
      </Container>
    </Layout>
  );
};

export default ProjectPost;

export const query = graphql`
  query ProjectPostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date
        cover {
          childImageSharp {
            fluid(maxWidth: 800) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        url
        description
        description_long
        tags
        scripts {
          src
          async
          charset
        }
      }
    }
  }
`;
