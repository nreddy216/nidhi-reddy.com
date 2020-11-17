import styled from "styled-components";
import tw from "tailwind.macro";

export const SliderWrapper = styled.section`
  ${tw`relative w-full overflow-hidden max-h-full flex justify-center items-center`};

  ${({ sliderSize }) =>
    sliderSize && `height: calc(${sliderSize}px); margin-bottom: 4rem;`};
`;

export const Slider = styled.section`
  ${tw`absolute md:relative top-0 left-0`};
`;

export const AnimationWrapper = styled.section`
  ${tw`absolute`};

  clip-path: circle(30% at 50% 50%);
  top: 0;
  z-index: -1;

  @media (min-width: 768px) {
    clip-path: circle(30% at 50% 350px);
  }

  @media (min-width: 1440px) {
    clip-path: circle(25% at 50% 350px);
  }

  ${({ animationWidth, windowHeight }) =>
  (animationWidth && windowHeight) &&
    `
    canvas {
      max-width: 100% !important;
      max-height: 100% !important;
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

