import styled from "styled-components";
import tw from "tailwind.macro";

export const SliderWrapper = styled.section`
  ${tw`relative w-full overflow-hidden max-h-full flex justify-center items-center`};

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
