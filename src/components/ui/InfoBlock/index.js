import React from "react";
import PropTypes from "prop-types";

import Icon from "components/ui/Icon";

import * as Styled from "./styles";

const InfoBlock = ({ icon, title, content, center, href }) => (
  <Styled.InfoBlock center={center}>
    <Styled.Icon>
      <Icon icon={icon} />
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
  icon: PropTypes.string.isRequired,
  href: PropTypes.string,
};

export default InfoBlock;
