import React from "react";
import { useStaticQuery, graphql } from "gatsby";

import InfoBlock from "components/ui/InfoBlock";
import Container from "components/ui/Container";
import TitleSection from "components/ui/TitleSection";

import * as Styled from "./styles";

const ContactInfo = () => {
  const { markdownRemark, allMarkdownRemark } = useStaticQuery(graphql`
    query {
      markdownRemark(frontmatter: { category: { eq: "contact section" } }) {
        frontmatter {
          title
          subtitle
        }
      }
      allMarkdownRemark(
        filter: { frontmatter: { category: { eq: "contact" } } }
        sort: { fields: fileAbsolutePath }
      ) {
        edges {
          node {
            id
            frontmatter {
              title
              icon
              href
              content
            }
          }
        }
      }
    }
  `);

  const sectionTitle = markdownRemark.frontmatter;
  const contacts = allMarkdownRemark.edges;

  return (
    <Container section>
      <TitleSection
        title={sectionTitle.title}
        subtitle={sectionTitle.subtitle}
        center
      />
      {contacts.map((item) => {
        const {
          id,
          frontmatter: { title, iconText, content, href },
        } = item.node;

        return (
          <Styled.ContactInfoItem key={id}>
            <InfoBlock
              href={href}
              iconText={iconText}
              title={title}
              content={content}
              center
            />
          </Styled.ContactInfoItem>
        );
      })}
    </Container>
  );
};

export default ContactInfo;
