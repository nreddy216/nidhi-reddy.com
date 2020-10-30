import React from "react";
import PropTypes from "prop-types";

import Icon from "components/ui/Icon";

import * as Styled from "./styles";

const InfoBlock = ({ icon, iconText, title, content, center, href }) => (
  <Styled.InfoBlock center={center}>
    <Styled.Icon>
      {icon ? <Icon icon={icon} /> : <span>{iconText}</span>}
    </Styled.Icon>
    <Styled.Wrapper center={center}>
      <Styled.Title>{title}</Styled.Title>
      <Styled.Content as={href && "a"} href={href && href}>
        {content}
      </Styled.Content>
    </Styled.Wrapper>
  </Styled.InfoBlock>
);

InfoBlock.propTypes = {
  center: PropTypes.bool,
  title: PropTypes.string.isRequired,
  content: PropTypes.any.isRequired,
  icon: PropTypes.string,
  iconText: PropTypes.string,
  href: PropTypes.string,
};

export default InfoBlock;
