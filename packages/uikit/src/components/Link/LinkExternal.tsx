import React, { useMemo } from "react";
import Link from "./Link";
import { LinkProps } from "./types";
import OpenNewIcon from "../Svg/Icons/OpenNew";
import BscScanIcon from "../Svg/Icons/BscScan";

const LinkExternal: React.FC<React.PropsWithChildren<LinkProps>> = ({ children, isBscScan = false, ...props }) => {
  const color = useMemo(() => (props.color ? props.color : "link"), [props.color]);

  return (
    <Link external color={color} {...props}>
      {children}
      {isBscScan ? <BscScanIcon color={color} ml="4px" /> : <OpenNewIcon color={color} ml="4px" />}
    </Link>
  );
};

export default LinkExternal;
