import React from 'react';
import PropTypes from 'prop-types';

import * as Styled from './styles';

const TitleSection = ({ center, title, subtitle, nocase }) => (
  <Styled.TitleSection>
    {subtitle && <Styled.SubTitle center={center}>{subtitle}</Styled.SubTitle>}
    {nocase ? <Styled.TitleNoCase center={center}>{title}</Styled.TitleNoCase> : <Styled.Title center={center}>{title}</Styled.Title>}
    <Styled.Separator center={center} />
  </Styled.TitleSection>
);

TitleSection.propTypes = {
  center: PropTypes.bool,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  nocase: PropTypes.bool
};

export default TitleSection;
