import { AtomBox } from "@verto/ui";
import { ReactNode } from "react";
import { Heading } from "../../components/Heading";
import { Text } from "../../components/Text";

interface Props {
  title: ReactNode;
  subtitle: ReactNode;
}

export const CurrencyInputHeader = ({ title, subtitle }: Props) => {
  return (
    <AtomBox
      width="full"
      alignItems="center"
      flexDirection="column"
      paddingBottom="24px"
      borderBottom="1"
      borderColor="hrBold"
    >
      <AtomBox display="flex" width="full" alignItems="center" justifyContent="space-between">
        {title}
      </AtomBox>
      {subtitle}
    </AtomBox>
  );
};

export const CurrencyInputHeaderTitle = ({ children }: { children: ReactNode }) => (
  <Heading as="h2" style={{ fontSize: "22px" }}>
    {children}
  </Heading>
);
export const CurrencyInputHeaderSubTitle = ({ children }: { children: ReactNode }) => (
  <Text color="text" fontSize="14px" style={{ fontFamily: "Inter" }} textAlign="center">
    {children}
  </Text>
);
