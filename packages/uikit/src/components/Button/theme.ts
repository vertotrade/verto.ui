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
  [scales.NEW_XS]: {
    height: "30px",
    fontSize: "14px",
    fontWeight: "400",
    padding: "6px 8px",
  },
  [scales.NEW_SM]: {
    height: "48px",
    fontSize: "16px",
    fontWeight: "500",
    padding: "12px 24px",
  },
  [scales.NEW_LG]: {
    height: "56px",
    fontSize: "16px",
    fontWeight: "500",
    padding: "16px 32px",
  },
};

export const styleVariants = {
  [variants.PRIMARY]: {
    backgroundColor: "primary",
    color: "invertedContrast",
  },
  [variants.SECONDARY]: {
    backgroundColor: (theme: any) => theme.colors.newPrimary,
    borderColor: "transparent",
    boxShadow: "none",
    color: "black",
    fontWeight: "500",
    ":hover": {
      backgroundColor: (theme: any) => theme.colors.newPrimaryDark,
      opacity: "1 !important",
    },
    ":active": {
      backgroundColor: (theme: any) => theme.colors.newPrimaryDark,
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
    color: "black",
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
    color: "var(--colors-buttonText)",
    fontFamily: "Roboto, sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
  [variants.VERTO_PRIMARY_GRADIENT]: {
    borderRadius: "32px",
    background: "linear-gradient(90deg, var(--colors-newPrimary) 0%, var(--colors-newPrimaryLight) 100%)",
    color: "var(--colors-buttonText)",
    fontFamily: "Roboto, sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-position 0.3s",
    ":hover": {
      background: "linear-gradient(90deg, var(--colors-newPrimaryDark) 0%, var(--colors-newPrimary) 100%)",
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
  [variants.VERTO_TEXT]: {
    background: "transparent",
    color: "var(--colors-text)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-position 0.3s",
    height: "initial",
    ":hover": {
      opacity: "1 !important",
    },
  },
  [variants.VERTO_LINK]: {
    backgroundColor: "transparent",
    color: "link",
    boxShadow: "none",
    ":hover": {
      opacity: "1 !important",
      textDecoration: "underline",
    },
  },
  [variants.VERTO_ICON]: {
    backgroundColor: "transparent",
    color: "icon",
    boxShadow: "none",
  },
};
