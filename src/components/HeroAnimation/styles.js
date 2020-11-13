import styled from "styled-components";
import tw from "tailwind.macro";

export const SliderWrapper = styled.section`
  ${tw`relative flex flex-none items-start justify-center w-full`};

  ${({ sliderSize }) => sliderSize && `height: calc(${sliderSize}px + 4rem);`};
`;

export const Slider = styled.section`
  ${tw`absolute`};
`;

export const AnimationWrapper = styled.section`
  ${tw`absolute top-0 overflow-hidden bg-yellow-400`};

  z-index: -1;
  clip-path: circle(50%);

  ${({ sliderSize }) =>
    sliderSize &&
    `
    border-radius: ${sliderSize}px;
    width: ${sliderSize}px;
    height: ${sliderSize}px;
    
    canvas {
      height: ${sliderSize}px !important;
      width: auto !important;
      border-radius: ${sliderSize}px;
      overflow: hidden;
    }`};
`;

export const LoaderAnim = styled.section`
  ${tw`w-full`};
`;

export const Loader = styled.section`
  ${tw`w-full`};
`;
