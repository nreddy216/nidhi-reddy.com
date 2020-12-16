import styled from "styled-components";
import tw from "tailwind.macro";

export const SliderWrapper = styled.section`
  ${tw`relative w-full max-h-full flex justify-center items-center`};

  ${({ sliderSize }) =>
    sliderSize && `height: ${sliderSize}px; margin-bottom: 1rem;`};
`;

export const Slider = styled.section`
  ${tw`relative top-0 left-0`};

  circle {
    cursor: pointer;
  }
`;

export const AnimationWrapper = styled.section`
  ${tw`absolute`};

  clip-path: circle(38% at 50% 50%);
  transition: all 0.5s ease;
  z-index: -1;

  @media (min-width: 1024px) {
    clip-path: circle(35% at 50% 50%);
  }

  ${({ animationWidth, windowHeight }) =>
    animationWidth &&
    windowHeight &&
    `
    canvas {
      max-width: 100% !important;
      max-height: ${
        animationWidth * 0.65 < 300 ? 300 : animationWidth * 0.65
      }px !important;
      width: ${animationWidth}px !important;
      height: ${animationWidth}px !important;
    }`};
`;

export const LoaderAnim = styled.section`
  ${tw`w-full`};
`;

export const Loader = styled.section`
  ${tw`w-full bg-white`};
`;

export const Name = styled.h1`
  ${tw`absolute uppercase left-0 font-black text-6xl`};

  bottom: 2rem;

  transform: rotate(-10deg) skew(10deg, 10deg);
  background: linear-gradient(45deg, #f3ec78, #3c366b, #48bb78);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;
`;

export const CircleSlider = styled.div`
position: relative;
border-radius: 100%;
border: 6px solid black;

/* Other than the above two, go wild! */
${({ sliderSize }) =>
sliderSize && `height: ${sliderSize}px; width: ${sliderSize}px;`};


/*
  Probably best to paste this exactly as is.
  These CSS rules make sure that the handle rotates
  properly, so don't change anything here.
*/
.cs-handle-container {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 2px;
  margin-top: -1px;
}

.cs-handle {
  position: absolute;
  transform: translateY(-50%);
  width: 0; 
  height: 0; 
  border-top: 24px solid transparent;
  border-bottom: 24px solid transparent;
  border-left: 36px solid #48bb78;
  transition: border-left-color 0.25s ease;
  
  /*
    Change 'right' to change the offset from the edge.
    E.g right: 0 puts the handle just next to the edge
    of #slider, on the inside
  */
  right: -20px;
  cursor: pointer;

  &:after {
    content: '';
    position: absolute;
    right: 50px;
    top: -30px;
    background: #48bb78;
    width: 6px;
    height: 60px;
    transform: rotate(90deg);
  }
}

.cs-handle:active {
  border-left-color: blue;
}
);
`;
