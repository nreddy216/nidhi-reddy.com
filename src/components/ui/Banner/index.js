import React from "react";
import PropTypes from "prop-types";

import Container from "components/ui/Container";
import Button from "components/ui/Button";
import TitleSection from "components/ui/TitleSection";
import FormatHtml from "components/utils/FormatHtml";

import * as Styled from "./styles";

const Banner = ({ title, subtitle, content, linkTo, linkText, hero }) => (
  <Styled.Banner>
    <Container section>
      {title && (
        <TitleSection
          title={<FormatHtml content={title} />}
          subtitle={<FormatHtml content={subtitle} />}
          nocase
          hero={hero}
        />
      )}
      {/* <h1>
      <FormatHtml content={title} />
      </h1> */}
      {content && (
        <Styled.Content>
          <FormatHtml content={content} />
        </Styled.Content>
      )}
      {linkTo && linkText && (
        <div>
          {/* <Link to={linkTo && linkTo != null ? linkTo : '/'}> */}
          <Button primary>{linkText}</Button>
          {/* </Link> */}
        </div>
      )}
    </Container>
  </Styled.Banner>
);

Banner.propTypes = {
  title: PropTypes.any,
  subtitle: PropTypes.any,
  content: PropTypes.any,
  linkTo: PropTypes.string,
  linkText: PropTypes.string,
};

export default Banner;
