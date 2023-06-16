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
      defaultColor="vertoBg1"
      checkedColor="text"
      onChange={() => toggleTheme(!isDark)}
      scale="md"
      startIcon={() => <SunIcon color="black" />}
      endIcon={() => <MoonIcon color="black" />}
    />
  );
};

export default memo(ThemeSwitcher, (prev, next) => prev.isDark === next.isDark);
