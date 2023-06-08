import styled from "styled-components";
import { PolymorphicComponent } from "../../util/polymorphic";
import Button from "../Button/Button";
import { BaseButtonProps } from "../Button/types";
import { ButtonMenuItemProps } from "./types";

interface MaybeActiveButtonProps extends BaseButtonProps {
  forwardedAs: BaseButtonProps["as"];
}

const MaybeActiveButton: PolymorphicComponent<MaybeActiveButtonProps, "button"> = styled(
  Button
)<MaybeActiveButtonProps>`
  background-color: ${({ theme, isActive }) => (isActive ? theme.colors.backgroundAlt : theme.colors.inputBg)};
  color: ${({ theme, isActive }) => (isActive ? theme.colors.text : theme.colors.disabledTextDark)};
  border-radius: 4px;

  &:hover:not(:disabled):not(:active) {
    background-color: ${({ theme, isActive }) => (isActive ? theme.colors.backgroundAlt : "transparent")};
    color: ${({ theme }) => theme.colors.text};

    & svg {
      fill: ${({ theme }) => theme.colors.text};
    }
  }
`;

const ButtonMenuItem: PolymorphicComponent<ButtonMenuItemProps, "button"> = ({ as, ...props }: ButtonMenuItemProps) => (
  <MaybeActiveButton forwardedAs={as} {...props} />
);

export default ButtonMenuItem;
