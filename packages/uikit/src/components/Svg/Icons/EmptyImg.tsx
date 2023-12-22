import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none" {...props}>
      <path
        d="M42.6667 5.33333V42.6667H5.33333V5.33333H42.6667ZM42.6667 0H5.33333C2.4 0 0 2.4 0 5.33333V42.6667C0 45.6 2.4 48 5.33333 48H42.6667C45.6 48 48 45.6 48 42.6667V5.33333C48 2.4 45.6 0 42.6667 0ZM29.7067 23.6267L21.7067 33.9467L16 27.04L8 37.3333H40L29.7067 23.6267Z"
        fill="black"
      />
    </Svg>
  );
};

export default Icon;
