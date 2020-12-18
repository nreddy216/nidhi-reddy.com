import styled from "styled-components";
import tw from "tailwind.macro";

const navyBlue = "#3c366b";
const green = "#48bb78";

export const SliderWrapper = styled.section`
  ${tw`relative w-full h-full max-h-full flex justify-center items-center`};
  margin-bottom: 1rem;
  transition: all 0.25s ease;

  ${({ sliderSize }) => sliderSize && `height: ${sliderSize}px;`};
`;

export const Slider = styled.section`
  ${tw`relative w-full`};

  circle {
    cursor: pointer;
  }
`;

export const Canvas = styled.canvas`
  transition: opacity 0.25 ease;
  ${({ loaded }) => (loaded ? `opacity: 1;` : `opacity: 0;`)};
`;

export const AnimationWrapper = styled.section`
  ${tw`absolute`};

  clip-path: circle(38% at 50% 50%);
  transition: all 0.5s ease;
  z-index: -1;

  @media (min-width: 1024px) {
    clip-path: circle(36% at 50% 50%);
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

export const LoaderAnim = styled.div`
  transition: opacity 0.25s ease;

  ${({ loaded }) => (loaded ? `opacity: 0;` : `opacity: 1;`)};
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
border: 4px solid ${navyBlue};
width: 100%;
max-width: 600px;
margin: 0 auto;
height: 50vh;
max-height: 600px;
transition: opacity 0.25s ease;

${({ sliderSize }) =>
  !!sliderSize
    ? `opacity: 1; height: ${sliderSize}px; width: ${sliderSize}px;`
    : `opacity: 0; @media (min-width: 1024px) {
    height: 600px;
  }`};

.cs-handle-container {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 2px;
  margin-top: -1px;
}

.cs-handle {
  position: relative;
  transform: translateY(-50%);
  cursor: grab;

  &.active {
    .cs-handle-img-wrapper {
      background: #efefef;
      box-shadow: rgba(0, 0, 0, 0.3) 0 1px 6px 0;
    }
  }

  &:focus {
    outline: none !important;
    .cs-handle-img-wrapper {
      background: ${navyBlue};
    }
  }

  .cs-handle-img-wrapper {
    border-radius: 100%;
    background: linear-gradient(180deg, #ffffff, #efefef);
    box-shadow: rgba(0, 0, 0, 0.3) 0 1px 10px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: rotate(90deg);
    position: absolute;
    right: 16px;
    width: 32px;
    height: 32px;
    top: -16px;

    @media (min-width: 500px) {
      right: 25px;
      width: 50px;
      height: 50px;
      top: -25px;
    }    
  }
  .cs-handle-img {
    width: 50%;
  }
}
);
`;

export const HandCursor = styled.div`
  ${({ icon }) => icon && `background-image: url(${icon});`};
`;
