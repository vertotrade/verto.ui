import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Logo: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg width="167" height="30" viewBox="0 0 637.96 167.32" {...props}>
      <defs>
        <linearGradient
          id="a"
          x1={34.75}
          y1={91.75}
          x2={116.92}
          y2={95.64}
          gradientTransform="translate(0 1)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0} stopColor="#30e8bf" />
          <stop offset={1} stopColor="#ff8235" />
        </linearGradient>
        <linearGradient id="b" x1={-39.73} y1={76.42} x2={169.4} y2={87.02} xlinkHref="#a" />
        <linearGradient
          id="c"
          x1={92.6}
          y1={2845.33}
          x2={655.62}
          y2={2875.88}
          gradientTransform="matrix(1 0 0 -1 0 2946.84)"
          xlinkHref="#a"
        />
      </defs>
      <path
        d="m51.87 76.19 31.18 54.29 31.19-54.29a10.35 10.35 0 0 0-17.92-10.36l-13.27 23.1-13.26-23.1a10.35 10.35 0 1 0-17.92 10.36Zm14-8 17.21 30 17.22-30a5.76 5.76 0 0 1 7.91-2.11 5.85 5.85 0 0 1 2.08 7.92l-27.24 47.44L55.82 74a5.83 5.83 0 0 1 2.11-7.91 5.68 5.68 0 0 1 7.91 2.11Z"
        style={{
          fill: "url(#a)",
          fillRule: "evenodd",
        }}
      />
      <path
        d="m166.42 83.66-11.15 41.47-30.4 30.39-41.46 11.16-41.47-11.16-30.39-30.39L.39 83.66 11.55 42.2l30.39-30.4L83.41.64 125 11.8l30.39 30.4Zm-26.35-50.34L98.69 9.43l23.9 6.41Zm21.61 50.34-6.41 23.9V59.77ZM150.7 50v72.47l-62.81 36.3Zm-4.57-7.91L83.41 5.83 20.59 42.11ZM16 50l62.84 108.77L16 122.49Zm82.6 107.8 41.4-23.89-17.5 17.48Zm-71.86-23.89 41.38 23.89-23.89-6.41ZM11.46 59.68v47.79l-6.41-23.9ZM68.12 9.43 26.74 33.32l17.49-17.48Zm79.24 37.25-64 110.86-64-110.86Z"
        style={{
          fill: "url(#b)",
          fillRule: "evenodd",
        }}
      />
      <path
        d="M279.83 42a5 5 0 0 1 1.81 6.78L235.36 129l-46.28-80.24a5 5 0 1 1 8.58-5l37.7 65.31 37.69-65.31a5 5 0 0 1 6.78-1.76Zm177.35 5a5 5 0 0 1 5-5h65.32a5 5 0 1 1 0 10h-28v72.15a5 5 0 0 1-10 0V51.94h-27.35a5 5 0 0 1-4.97-4.94Zm-160.55 0a5 5 0 0 1 5-5h52.88a5 5 0 0 1 0 10H301.6a5 5 0 0 1-4.97-5Zm0 36.08a5 5 0 0 1 5-5h52.88a5 5 0 0 1 0 10H301.6a5 5 0 0 1-4.97-5.08Zm0 36.08a5 5 0 0 1 5-5h52.88a5 5 0 0 1 0 10H301.6a5 5 0 0 1-4.97-5.04ZM592.16 48.2a35.46 35.46 0 1 0 35.46 35.46 35.44 35.44 0 0 0-35.46-35.46Zm-45.41 35.46a45.41 45.41 0 1 1 45.41 45.41 45.42 45.42 0 0 1-45.41-45.41ZM373.82 47a5 5 0 0 1 5-5h41.06a23 23 0 0 1 0 46h-16.14l37.14 27.74a5 5 0 1 1-6 8l-61.12-45.68h46.1a13.06 13.06 0 0 0 0-26.12H378.8a5 5 0 0 1-4.98-4.94Z"
        style={{
          fill: "url(#c)",
          fillRule: "evenodd",
        }}
      />
    </Svg>
  );
};

export default Logo;
