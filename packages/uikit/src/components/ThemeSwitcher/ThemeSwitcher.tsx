import { memo } from "react";
import { Flex, Text } from "@verto/uikit";
import { SunIcon, MoonIcon } from "../Svg";
// import { Toggle } from "../Toggle";

export interface Props {
  isDark: boolean;
  toggleTheme: (isDark: boolean) => void;
  showText?: boolean;
}

const ThemeSwitcher: React.FC<React.PropsWithChildren<Props>> = ({ isDark, toggleTheme, showText }) => {
  return (
    <Flex>
      {/* <Toggle
        checked={isDark}
        onChange={() => toggleTheme(!isDark)}
        // startIcon={() => <SunIcon color={isDark ? "backgroundAlt" : "white"} />}
        // endIcon={() => <MoonIcon color={isDark ? "secondary" : "white"} />}
      /> */}
      {isDark ? (
        <MoonIcon mt="2px" onClick={() => toggleTheme(!isDark)} />
      ) : (
        <SunIcon mt="2px" onClick={() => toggleTheme(!isDark)} />
      )}
      {showText && <Text mx="4px">{isDark ? "Dark Mode" : "Light Mode"}</Text>}
    </Flex>
  );
};

export default memo(ThemeSwitcher, (prev, next) => prev.isDark === next.isDark);
