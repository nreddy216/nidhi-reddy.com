import React from 'react';
import PropTypes from 'prop-types';

import { useStaticQuery, graphql } from 'gatsby';
import FormatHtml from 'components/utils/FormatHtml';
import SEO from 'components/SEO';

import Container from 'components/ui/Container';
import TitleSection from 'components/ui/TitleSection';

import * as Styled from './styles';

const Post = ({ title, html, date }) => (
    <Container section>
        <SEO title={title} />
        <TitleSection title={date} subtitle={title} />
        <FormatHtml content={html} />
    </Container>
);

Post.propTypes = {
    title: PropTypes.string.isRequired,
    html: PropTypes.any.isRequired,
    date: PropTypes.string.isRequired
  };

export default Post;

