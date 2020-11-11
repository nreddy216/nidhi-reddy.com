import styled from "styled-components";
import tw from "tailwind.macro";

export const SliderWrapper = styled.section`
  ${tw`relative flex justify-center w-full`};

  ${({ sliderSize }) => sliderSize
    && `height: calc(${sliderSize}px + 4rem);`
    };
`;


export const Slider = styled.section`
  ${tw`absolute`};
`;

