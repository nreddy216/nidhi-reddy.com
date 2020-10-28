import React from "react";
import PropTypes from "prop-types";

import * as Styled from "./styles";

const TitleSection = ({ center, title, subtitle, hero, project }) => (
  <Styled.TitleSection>
    {hero && (
      <Styled.Title hero={hero} center={center} project={project}>
        {title}
      </Styled.Title>
    )}
    {subtitle && (
      <Styled.SubTitle center={center} hero={hero} project={project}>
        {subtitle}
      </Styled.SubTitle>
    )}
    {!hero && (
      <Styled.Title hero={hero} center={center} project={project}>
        {title}
      </Styled.Title>
    )}
    <Styled.Separator center={center} />
  </Styled.TitleSection>
);

TitleSection.propTypes = {
  center: PropTypes.bool,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  hero: PropTypes.bool,
  project: PropTypes.bool,
};

export default TitleSection;
