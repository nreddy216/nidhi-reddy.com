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
import VimeoPlayer from "components/VimeoPlayer";

import * as Styled from "./styles";
import Icon from "components/ui/Icon";

const ProjectPost = ({ data, pageContext }) => {
  const post = data.markdownRemark;
  const { previous, next } = pageContext;
  let scripts = [];
  
  if (post.frontmatter.video_id || post.frontmatter.vimeo_embed) {
    scripts.push({
      src: "https://player.vimeo.com/api/player.js"
    });
  }
  if (post.frontmatter.twitter_embed) {
    scripts.push({
      src: "https://platform.twitter.com/widgets.js",
      async: true,
      charset: "utf-8"
    });
  }

  return (
    <Layout>
      <SEO title={post.frontmatter.title} scripts={scripts} />
      <Container section>
        <Styled.LinksNoMargin>
          <Link to={"/projects"} rel="projects">
            ← back to all
          </Link>
        </Styled.LinksNoMargin>
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
          {post.frontmatter.video_id || post.frontmatter.video_url ? (
            <VimeoPlayer
              id={post.frontmatter.video_id}
              url={post.frontmatter.video_url}
              title={post.frontmatter.video_title}
              autoplay={post.frontmatter.video_autoplay}
            ></VimeoPlayer>
          ) : (
            post.frontmatter.cover && (
              <Styled.Image>
                <Img
                  fluid={post.frontmatter.cover.childImageSharp.fluid}
                  alt={post.frontmatter.title}
                />
              </Styled.Image>
            )
          )}

          {post.frontmatter.url && (
            <Button as="a" primary href={post.frontmatter.url}>
              {post.frontmatter.url_text
                ? post.frontmatter.url_text
                : `View site`}
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
        order
        title
        date
        cover {
          childImageSharp {
            fluid(maxWidth: 800) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        video_id
        video_title
        video_url
        video_autoplay
        url
        url_text
        description
        description_long
        tags
        twitter_embed
        vimeo_embed
      }
    }
  }
`;
