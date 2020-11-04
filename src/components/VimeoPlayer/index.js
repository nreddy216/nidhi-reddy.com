import React from "react";
import PropTypes from "prop-types";

import * as Styled from "./styles";

const VimeoPlayer = ({ title, url, id, autoplay, loop, mute }) => {
  let link = id ? `https://player.vimeo.com/video/${id}` : `${url}`;
  link += `?byline=0&portrait=0&title=0&autoplay=${autoplay ? 1 : 0}&loop=${
    loop ? 1 : 0
  }&mute=${mute ? 1 : 0}`;

  return (
    <Styled.Player>
      <Styled.Iframe
        src={link}
        frameborder="0"
        allow="autoplay; fullscreen"
        allowfullscreen
        title={title}
      ></Styled.Iframe>
    </Styled.Player>
  );
};

VimeoPlayer.defaultProps = {
  title: "Video",
  autoplay: true,
  loop: true,
  mute: true,
};

VimeoPlayer.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string,
  id: PropTypes.string,
  autoplay: PropTypes.bool,
  loop: PropTypes.bool,
  mute: PropTypes.bool,
};

export default VimeoPlayer;
