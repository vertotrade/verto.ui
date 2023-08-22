import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <path d="M16.8255 8L11.7 13.1981L6.5745 8L5 9.60028L11.7 16.41L18.4 9.60028L16.8255 8Z" />
    </Svg>
  );
};

export default Icon;
