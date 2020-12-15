import "assets/styles/global.css";

import * as Styled from "./styles";

import { graphql, useStaticQuery } from "gatsby";

import Footer from "components/Footer";
import GlobalStyles from "assets/styles/globalStyles";
import Header from "components/Header";
import PropTypes from "prop-types";
import React from "react";
import { isInBrowser } from "../../helpers/constants";
import { motion } from "framer-motion";

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <>
      <GlobalStyles />
      <Styled.Layout>
        <Header siteTitle={data.site.siteMetadata.title} />
        <motion.div
          initial={{ y: isInBrowser ? 30 : 0, opacity: isInBrowser ? 0 : 1 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: isInBrowser ? 0 : 1 }}
          transition={{ delay: 0.2 }}
        >
          {children}
          <Footer />
        </motion.div>
      </Styled.Layout>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.any.isRequired,
};

export default Layout;
