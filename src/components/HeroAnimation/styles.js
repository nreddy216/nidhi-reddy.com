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

  clip-path: circle(30% at 50% 42%);
  z-index: -1;

  ${({ sliderSize }) =>
    sliderSize &&
    `
    top: ${sliderSize / 12}px;

    canvas {
      width: 100% !important;
      // max-width: 100% !important;
      // max-height: 100% !important;
      height: auto !important;
      overflow: hidden;
    }`};
`;

export const LoaderAnim = styled.section`
  ${tw`w-full`};
`;

export const Loader = styled.section`
  ${tw`w-full`};
`;
