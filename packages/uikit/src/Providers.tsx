import { ThemeProvider, DefaultTheme } from "styled-components";
import { LanguageProvider } from "@verto/localization";
import { MatchBreakpointsProvider } from "./contexts/MatchBreakpoints/Provider";
import { ToastsProvider } from "./contexts/ToastsContext/Provider";

export const UIKitProvider: React.FC<React.PropsWithChildren<{ theme: DefaultTheme; children: React.ReactNode }>> = ({
  theme,
  children,
}) => {
  return (
    <ThemeProvider theme={theme}>
      <LanguageProvider>
        <MatchBreakpointsProvider>
          <ToastsProvider>{children}</ToastsProvider>
        </MatchBreakpointsProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};
