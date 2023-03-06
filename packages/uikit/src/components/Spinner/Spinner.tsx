import React from "react";
import styled, { keyframes } from "styled-components";
import { SpinnerProps } from "./types";

const lineGrow = keyframes`
  0% {
    height: 0;
  }
  100% {
    height: 75%;
  }
`;

const LoaderWrapper = styled.div<{ size: number }>`
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin: 75px;
  display: inline-block;
  vertical-align: middle;
`;

const Line = styled.div`
  width: 8px;
  height: 100%;
  position: absolute;
  border-radius: 5px;
  bottom: 0;
  background: -webkit-gradient(linear, left top, left bottom, from(#30e8bf), to(#ff8235));
  background: -webkit-linear-gradient(top, #30e8bf, #ff8235);
  background: -o-linear-gradient(top, #30e8bf, #ff8235);
  background: linear-gradient(to bottom, #30e8bf, #ff8235);
`;

const FirstLine = styled(Line)`
  left: 0;
  -webkit-animation: ${lineGrow} 0.5s ease alternate infinite;
  animation: ${lineGrow} 0.5s ease alternate infinite;
`;
const SecondLine = styled(Line)`
  left: 20px;
  -webkit-animation: ${lineGrow} 0.5s 0.2s ease alternate infinite;
  animation: ${lineGrow} 0.5s 0.2s ease alternate infinite;
`;

const ThirdLine = styled(Line)`
  left: 40px;
  -webkit-animation: ${lineGrow} 0.5s 0.4s ease alternate infinite;
  animation: ${lineGrow} 0.5s 0.4s ease alternate infinite;
`;

const Loader = ({ size }: { size: number }) => {
  return (
    <LoaderWrapper size={size}>
      <FirstLine />
      <SecondLine />
      <ThirdLine />
    </LoaderWrapper>
  );
};

const Spinner: React.FC<React.PropsWithChildren<SpinnerProps>> = ({ size = 128 }) => {
  return <Loader size={size} />;
};

export default Spinner;
