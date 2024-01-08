import React from "react";
import styled, { keyframes } from "styled-components";
import { SpinnerProps } from "./types";

const spinKey = keyframes`
  100% {
    transform: rotate(1turn);
  }
`;

const SpinnerWrapper = styled.div<{ size: number }>`
  position: relative;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: 50%;
  background: radial-gradient(farthest-side, #30e8bf 94%, #0000) top/9px 9px no-repeat,
    conic-gradient(#0000 30%, #30e8bf);
  -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 9px), #000 0);
  -webkit-animation: ${spinKey} 0.5s 0.4s ease alternate infinite;
  animation: ${spinKey} 1s infinite linear;
`;

const Loader = ({ size }: { size: number }) => {
  return <SpinnerWrapper size={size} />;
};

const Spinner: React.FC<React.PropsWithChildren<SpinnerProps>> = ({ size = 64 }) => {
  return <Loader size={size} />;
};

export default Spinner;
