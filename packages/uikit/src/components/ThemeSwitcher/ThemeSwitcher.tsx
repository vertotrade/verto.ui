import { memo } from "react";
import { SunIcon, MoonIcon } from "../Svg";
import { Toggle } from "../Toggle";

export interface Props {
  isDark: boolean;
  toggleTheme: (isDark: boolean) => void;
}

const ThemeSwitcher: React.FC<React.PropsWithChildren<Props>> = ({ isDark, toggleTheme }) => (
  <Toggle
    checked={isDark}
    defaultColor="toggleBgColor"
    checkedColor="warning"
    onChange={() => toggleTheme(!isDark)}
    scale="md"
    startIcon={() => <SunIcon color="white" />}
    endIcon={() => <MoonIcon color="white" />}
  />
);

export default memo(ThemeSwitcher, (prev, next) => prev.isDark === next.isDark);
