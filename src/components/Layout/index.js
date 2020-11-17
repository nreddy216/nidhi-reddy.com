import React from "react";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";
import { motion, AnimatePresence } from "framer-motion";

import { isInBrowser } from "../../helpers/constants";
import Header from "components/Header";
import Footer from "components/Footer";

import "assets/styles/global.css";
import GlobalStyles from "assets/styles/globalStyles";
import * as Styled from "./styles";

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
      {/* <AnimatePresence exitBeforeEnter> */}
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
      {/* </AnimatePresence> */}
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.any.isRequired,
};

export default Layout;
