import { ReactNode } from "react";
import styled from "styled-components";
import { CardHeader, Flex, Heading, Text } from "../../components";

const Wrapper = styled(CardHeader)<{ isFinished?: boolean; background: string }>`
  background: transparent;
  border-radius: ${({ theme }) => `${theme.radii.card} ${theme.radii.card} 0 0`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.hrBold};
`;

export const PoolCardHeader: React.FC<
  React.PropsWithChildren<{
    isFinished?: boolean;
    isStaking?: boolean;
  }>
> = ({ isFinished = false, isStaking = false, children }) => {
  const background = isStaking ? "gradientBubblegum" : "gradientCardHeader";

  return (
    <Wrapper isFinished={isFinished} background={background}>
      <Flex alignItems="center" justifyContent="space-between">
        {children}
      </Flex>
    </Wrapper>
  );
};

export const PoolCardHeaderTitle: React.FC<
  React.PropsWithChildren<{ isFinished?: boolean; title: ReactNode; subTitle: ReactNode }>
> = ({ isFinished, title, subTitle }) => {
  return (
    <Flex flexDirection="column">
      <Heading color={isFinished ? "disbaldText" : "body"} scale="lg">
        {title}
      </Heading>
      <Text fontSize="14px" color={isFinished ? "disbaldText" : "textSubtle"}>
        {subTitle}
      </Text>
    </Flex>
  );
};
