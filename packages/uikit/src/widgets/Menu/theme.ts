import { darkColors } from "../../theme/colors";

export interface NavThemeType {
  background: string;
}

export const light: NavThemeType = {
  background: "#d7caec45",
};

export const dark: NavThemeType = {
  background: darkColors.backgroundAlt,
};
