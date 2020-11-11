import React from "react";
import PropTypes from "prop-types";
import CircularSlider from "react-circular-slider-svg";
import { useState, useEffect } from "preact/hooks";

import Container from "components/ui/Container";

import * as Styled from "./styles";

const HeroAnimation = () => {
  
  const [endingValue, setEndingValue] = useState();
  const [time, setTime] = useState(new Date());
  const [value1, setValue1] = useState(time.getHours());

  useEffect(() => {
    let timerID = setInterval(() => tick(), 1000 * 60);
    return function cleanup() {
      clearInterval(timerID);
    };
  });

  function tick() {
    setTime(new Date());
  }

  console.log("Date ", time.getHours(), ":", time.getMinutes());

  const sliderSize = 600;

  return (
      <>
      <Container className="relative">
    <Styled.SliderWrapper sliderSize={sliderSize}>
        <Styled.Slider>
            <CircularSlider
            style={`position: absolute;`}
                size={sliderSize}
                minValue={0}
                maxValue={24}
                handle1={{
                value: value1,
                onChange: v => {
                    console.log("v ", v);

                    setValue1(v);
                }
                }}
                onControlFinished={() => setEndingValue(value1)}
                arcColor="#48bb78"
                arcBackgroundColor="#3c366b"
            />
            Current value: {value1}
            <br />
            Result of last control: {endingValue}
            <style>
                {`svg circle {
                        stroke-width: 100px;
                    }`}
            </style>
        </Styled.Slider>
    </Styled.SliderWrapper>
    
    </Container>
    </>
  );
};

// HeroAnimation.propTypes = {};

export default HeroAnimation;
