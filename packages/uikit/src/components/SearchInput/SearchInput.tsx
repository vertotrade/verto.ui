import { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import debounce from "lodash/debounce";
import { useTranslation } from "@verto/localization";
import { InputWithSymbol } from "../Input";
import { SearchIcon } from "../Svg";

const InputWrapper = styled.div`
  position: relative;
  ${({ theme }) => theme.mediaQueries.sm} {
    display: block;
  }
`;

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  initialValue?: string;
  iconColor?: string;
}

const SearchInput: React.FC<React.PropsWithChildren<Props>> = ({
  onChange: onChangeCallback,
  placeholder = "Search",
  initialValue,
  iconColor = "black",
}) => {
  const [searchText, setSearchText] = useState("");
  const { t } = useTranslation();

  const debouncedOnChange = useMemo(
    () => debounce((e: React.ChangeEvent<HTMLInputElement>) => onChangeCallback(e), 500),
    [onChangeCallback]
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    debouncedOnChange(e);
  };
  useEffect(() => {
    if (initialValue) {
      setSearchText(initialValue);
    }
  }, [initialValue]);

  return (
    <InputWrapper>
      <InputWithSymbol
        style={{ minWidth: "200px", paddingLeft: "10px", height: "40px" }}
        inputStyle={{ fontSize: "14px" }}
        symbol={<SearchIcon width="18px" height="18px" color={iconColor} />}
        value={searchText}
        onChange={onChange}
        placeholder={t(placeholder)}
      />
    </InputWrapper>
  );
};

export default SearchInput;
