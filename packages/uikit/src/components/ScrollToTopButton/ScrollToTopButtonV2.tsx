import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import throttle from "lodash/throttle";
import { Button } from "../Button";
import { ArrowUpIcon } from "../Svg";
import { useMatchBreakpoints } from "../../contexts";

const FixedContainer = styled.div`
  position: fixed;
  right: 5%;
  bottom: calc(110px + env(safe-area-inset-bottom));

  button {
    background-color: ${({ theme }) => theme.colors.newPrimary};
    &:hover {
      background-color: ${({ theme }) => theme.colors.newPrimaryDark};
      opacity: 1 !important;
    }
  }
`;

const ScrollToTopButtonV2 = () => {
  const [visible, setVisible] = useState(false);
  const { isMobile } = useMatchBreakpoints();

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const toggleVisible = () => {
      const scrolled = document.documentElement.scrollTop;
      if (scrolled > 500) {
        setVisible(true);
      } else if (scrolled <= 500) {
        setVisible(false);
      }
    };

    const throttledToggleVisible = throttle(toggleVisible, 200);

    window.addEventListener("scroll", throttledToggleVisible);

    return () => window.removeEventListener("scroll", throttledToggleVisible);
  }, []);

  return (
    <FixedContainer style={{ display: visible && !isMobile ? "inline" : "none" }}>
      <Button width={48} height={48} endIcon={<ArrowUpIcon style={{ marginLeft: 0 }} />} onClick={scrollToTop} />
    </FixedContainer>
  );
};

export default ScrollToTopButtonV2;
