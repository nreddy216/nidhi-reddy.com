import React from "react";
import PropTypes from "prop-types";

import * as Styled from "./styles";

const Container = ({ section, sectionY, children }) => (
  <Styled.Container section={section} sectionY={sectionY}>
    {children}
  </Styled.Container>
);

Container.propTypes = {
  section: PropTypes.bool,
  sectionY: PropTypes.bool,
  children: PropTypes.any.isRequired,
};
export default Container;
