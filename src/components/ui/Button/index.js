import React from "react";
import PropTypes from "prop-types";

import * as Styled from "./styles";

const Button = ({ as, primary, block, children, href }) => (
  <Styled.Button
    as={as}
    href={href ? href : ""}
    target="_blank"
    rel="noopener"
    primary={primary}
    block={block}
    whileHover={{ scale: 1.05 }}
    whiletap={{ scale: 0.95 }}
  >
    {children}
  </Styled.Button>
);

Button.propTypes = {
  primary: PropTypes.bool,
  block: PropTypes.bool,
  children: PropTypes.any.isRequired,
  href: PropTypes.string,
};

export default Button;
