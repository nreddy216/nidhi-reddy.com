import styled from "styled-components";
import tw from "tailwind.macro";

export const SliderWrapper = styled.section`
  ${tw`relative w-full overflow-hidden max-h-full flex justify-center items-center`};

  ${({ sliderSize }) =>
    sliderSize && `height: ${sliderSize}px; margin-bottom: 2rem;`};
`;

export const Slider = styled.section`
  ${tw`absolute md:relative top-0 left-0`};

  circle {
    cursor: pointer;
  }
`;

export const AnimationWrapper = styled.section`
  ${tw`absolute`};

  clip-path: circle(38% at 50% 50%);
  z-index: -1;

  @media (min-width: 1024px) {
    clip-path: circle(35% at 50% 50%);
  }

  ${({ animationWidth, windowHeight }) =>
  (animationWidth && windowHeight) &&
    `
    canvas {
      max-width: 100% !important;
      max-height: ${animationWidth * 0.65 < 300 ? 300 : animationWidth * 0.65}px !important;
      width: ${animationWidth}px !important;
      height: ${animationWidth}px !important;
    }`};
`;

export const LoaderAnim = styled.section`
  ${tw`w-full`};
`;

export const Loader = styled.section`
  ${tw`w-full`};
`;

