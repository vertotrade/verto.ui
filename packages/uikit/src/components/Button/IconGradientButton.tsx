import styled from "styled-components";
import { PolymorphicComponent } from "../../util/polymorphic";
import GradientButton from "./GradientButton";
import { BaseButtonProps } from "./types";

const GradientIconButton: PolymorphicComponent<BaseButtonProps, "button"> = styled(GradientButton)<BaseButtonProps>`
  padding: 0;
  width: ${({ scale }) => (scale === "sm" ? "32px" : "48px")};
`;

export default GradientIconButton;
