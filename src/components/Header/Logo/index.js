import React from "react";
import { useStaticQuery, graphql } from "gatsby";

import * as Styled from "./styles";

const RandomizedLogo = () => {
  const emojis = {
    magic: "(ﾉ◕ヮ◕)ﾉ*:・ﾟ✧",
    flip: "	(╯°□°)╯︵",
    shrug: "¯\\_(ツ)_/¯",
    zen: "⊹╰(⌣ʟ⌣)╯⊹",
  };

  const randomIndex = Math.floor(Math.random() * Object.keys(emojis).length);
  const emoji = Object.keys(emojis)[randomIndex];

  let isFlipped = emoji === "flip";

  return (
    <>
      <Styled.Emoji aria-hidden>{emojis[emoji]}</Styled.Emoji>
      <Styled.Text isFlipped={isFlipped}>nidhi reddy</Styled.Text>
    </>
  );
};

const Logo = () => {
  const { site, placeholderImage } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  const logoTitle = site.siteMetadata.title;

  return (
    <Styled.Logo to="/">
      <RandomizedLogo />
    </Styled.Logo>
  );
};

export default Logo;
