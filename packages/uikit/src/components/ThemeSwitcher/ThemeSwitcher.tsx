import { memo } from "react";
import { SunIcon, MoonIcon } from "../Svg";
import { Toggle } from "../Toggle";

export interface Props {
  isDark: boolean;
  toggleTheme: (isDark: boolean) => void;
}

const ThemeSwitcher: React.FC<React.PropsWithChildren<Props>> = ({ isDark, toggleTheme }) => {
  return (
    <Toggle
      checked={isDark}
      defaultColor="toggleBgColor"
      checkedColor={isDark ? "textDisabled" : "warning"}
      onChange={() => toggleTheme(!isDark)}
      scale="md"
      startIcon={() => <SunIcon color={isDark ? "backgroundAlt" : "white"} />}
      endIcon={() => <MoonIcon color={isDark ? "secondary" : "white"} />}
    />
  );
};

export default memo(ThemeSwitcher, (prev, next) => prev.isDark === next.isDark);
