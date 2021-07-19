import React from "react";
import { useStaticQuery, graphql } from "gatsby";

import * as Styled from "./styles";

const RandomizedLogo = ({ title }) => {
  const emojis = {
    magic: "(ﾉ◕ヮ◕)ﾉ*:・ﾟ✧",
    flip: "	(╯°□°)╯︵",
    shrug: "¯\\_(ツ)_/¯",
    zen: "⊹╰(⌣ʟ⌣)╯⊹",
  };

  const randomIndex = Math.floor(Math.random() * Object.keys(emojis).length);
  const emoji = Object.keys(emojis)[randomIndex];

  let isVerticallyFlipped = emoji === "flip";
  let isHorizontallyFlipped = emoji === "flip" || emoji === "magic";

  return (
    <>
      <Styled.Text isVerticallyFlipped={isVerticallyFlipped}>
        {title}
      </Styled.Text>
      <Styled.Emoji isHorizontallyFlipped={isHorizontallyFlipped} aria-hidden>
        {emojis[emoji]}
      </Styled.Emoji>
    </>
  );
};

const Logo = () => {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  const logoTitle = `nidhi reddy`;

  return (
    <Styled.Logo to="/">
      <RandomizedLogo title={logoTitle} />
    </Styled.Logo>
  );
};

export default Logo;
