import React, { useMemo } from "react";
import { useTheme } from "@verto/hooks";
import Text from "../Text/Text";
import Dropdown from "../Dropdown/Dropdown";
import Button from "../Button/Button";
import LanguageIcon from "../Svg/Icons/Language";
import MenuButton from "./MenuButton";
import { Colors } from "../../theme";
import { Language } from "./types";
import { Position } from "../Dropdown/types";
import { Scale } from "../Button/types";

interface Props {
  currentLang: string;
  menuItemColor?: string;
  langs: Language[];
  setLang: (lang: Language) => void;
  color: keyof Colors;
  dropdownPosition?: Position;
  buttonScale?: Scale;
  hideLanguage?: boolean;
}

const LangSelector: React.FC<React.PropsWithChildren<Props>> = ({
  currentLang,
  langs,
  color,
  menuItemColor,
  setLang,
  dropdownPosition = "bottom",
  buttonScale = "md",
  hideLanguage = false,
}) => {
  const { theme } = useTheme();
  const formattedLangText = useMemo(() => {
    return langs.find((lang) => lang.code === currentLang.toLowerCase())?.language;
  }, [currentLang, langs]);

  return (
    <Dropdown
      position={dropdownPosition}
      target={
        <Button
          scale={buttonScale}
          variant="text"
          startIcon={<LanguageIcon color={theme.colors[color] || color} width="24px" hasGradient />}
        >
          {!hideLanguage && (
            <Text className="hover-gradient" color={color}>
              {formattedLangText}
            </Text>
          )}
        </Button>
      }
    >
      {langs.map((lang) => (
        <MenuButton
          $color={menuItemColor}
          key={lang.locale}
          fullWidth
          onClick={() => setLang(lang)}
          // Safari fix
          style={{ minHeight: "32px", height: "auto" }}
        >
          {lang.language}
        </MenuButton>
      ))}
    </Dropdown>
  );
};

export default React.memo(LangSelector, (prev, next) => prev.currentLang === next.currentLang);
