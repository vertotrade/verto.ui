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
  [scales.NEW_SM]: {
    height: "48px",
    padding: "12px 24px",
  },
  [scales.NEW_LG]: {
    height: "56px",
    padding: "16px 32px",
  },
};

export const styleVariants = {
  [variants.PRIMARY]: {
    backgroundColor: "primary",
    color: "invertedContrast",
  },
  [variants.SECONDARY]: {
    backgroundImage: (theme: any) => theme.colors.gradientGreenOrange,
    backgroundPosition: "90% 100%",
    backgroundSize: "200%",
    borderColor: "transparent",
    boxShadow: "none",
    color: "black",
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
    backgroundColor: "newPrimary",
    color: "white",
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
  [variants.VERTO_PRIMARY]: {
    borderRadius: "32px",
    background: "var(--colors-newPrimary)",
    color: "#231F20",
    fontFamily: "Roboto, sans-serif",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "500",
    transition: "background-position 0.3s",
    ":hover": {
      background: "var(--colors-newPrimaryDark)",
      opacity: "1 !important",
    },
    ":disabled": {
      background: "var(--colors-disabledBg)",
      color: "var(--colors-disabledText)",
    },
  },
  [variants.VERTO_SECONDARY]: {
    borderRadius: "32px",
    background: "var(--colors-secondaryButtonBg)",
    color: "var(--colors-secondaryButtonText)",
    fontFamily: "Inter, sans-serif",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "500",
    transition: "background-position 0.3s",
    ":hover": {
      background: "var(--colors-secondaryButtonHoverBg)",
      opacity: "1 !important",
    },
    ":disabled": {
      background: "var(--colors-disabledBg)",
      color: "var(--colors-disabledText)",
    },
  },
  [variants.VERTO_GHOST]: {
    background: "transparent",
    color: "var(--colors--secondaryButtonText)",
    fontFamily: "Inter, sans-serif",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "500",
    transition: "background-position 0.3s",
    ":hover": {
      background: "var(--colors-ghostButtonHoverBg)",
      opacity: "1 !important",
    },
    ":disabled": {
      background: "var(--colors-disabledBg)",
      color: "var(--colors-disabledText)",
    },
  },
  [variants.VERTO_ICON]: {
    backgroundColor: "transparent",
    color: "icon",
    boxShadow: "none",
  },
};
