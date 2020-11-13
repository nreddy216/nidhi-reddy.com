import styled from "styled-components";
import tw from "tailwind.macro";

export const SliderWrapper = styled.section`
  ${tw`relative flex flex-none items-start justify-center w-full overflow-hidden`};



  ${({ sliderSize }) => sliderSize && `height: calc(${sliderSize}px + 4rem);`};
`;

export const Slider = styled.section`
  ${tw`absolute md:relative top-0 left-0`};
`;

export const AnimationWrapper = styled.section`
  ${tw`absolute top-0 overflow-hidden bg-yellow-400`};

  z-index: -1;
  clip-path: circle(50%);
  max-width: 100%;

  ${({ sliderSize }) =>
    sliderSize &&
    `
    border-radius: ${sliderSize}px;
    max-width: 100%;
    max-height: 100%;
    
    canvas {
      height: 100% !important;
      width: 100% !important;
      overflow: hidden;
    }`};
`;

export const LoaderAnim = styled.section`
  ${tw`w-full`};
`;

export const Loader = styled.section`
  ${tw`w-full`};
`;
