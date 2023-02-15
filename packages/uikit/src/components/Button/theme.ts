import { scales, variants } from "./types";

export const scaleVariants = {
  [scales.MD]: {
    height: "48px",
    padding: "0 24px",
  },
  [scales.SM]: {
    height: "32px",
    padding: "0 16px",
  },
  [scales.XS]: {
    height: "20px",
    fontSize: "12px",
    padding: "0 8px",
  },
};

export const styleVariants = {
  [variants.PRIMARY]: {
    backgroundColor: "primary",
    color: "invertedContrast",
  },
  [variants.SECONDARY]: {
    backgroundImage: (theme: any) => theme.colors.gradientGreenOrangeButton,
    backgroundPosition: "90% 100%",
    backgroundSize: "200%",
    borderColor: "transparent",
    boxShadow: "none",
    color: "white",
    fontWeight: "500",
    transition: "background-position 0.3s",
    ":hover": {
      backgroundPosition: "60% 100%",
      opacity: "1 !important",
    },
    ":disabled": {
      backgroundColor: "transparent",
    },
  },
  [variants.TERTIARY]: {
    backgroundColor: "tertiary",
    boxShadow: "none",
    color: "primary",
  },
  [variants.SUBTLE]: {
    backgroundColor: "backgroundAlt2",
    color: "textSubtle",
  },
  [variants.SUBTLE2]: {
    backgroundColor: "subtleButton2",
    color: "invertedContrast",
  },
  [variants.DANGER]: {
    backgroundColor: "failure",
    color: "white",
  },
  [variants.SUCCESS]: {
    backgroundColor: "success",
    color: "white",
  },
  [variants.TEXT]: {
    backgroundColor: "transparent",
    color: "primary",
    boxShadow: "none",
  },
  [variants.LIGHT]: {
    backgroundColor: "input",
    color: "primary",
    boxShadow: "none",
  },
  [variants.VERTOCUSTOM]: {
    backgroundColor: "input",
    color: "primary",
    boxShadow: "none",
    borderColor: "primary0f",
    borderStyle: "solid",
    borderWidth: "2px",
    height: "36px",
  },
};
