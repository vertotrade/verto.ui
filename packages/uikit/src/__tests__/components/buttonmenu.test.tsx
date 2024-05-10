import React from "react";
import { renderWithProvider } from "../../testHelpers";
import ButtonMenu from "../../components/ButtonMenu/ButtonMenu";
import ButtonMenuItem from "../../components/ButtonMenu/ButtonMenuItem";

const handleClick = jest.fn();

it("renders correctly", () => {
  const { asFragment } = renderWithProvider(
    <ButtonMenu activeIndex={0} onItemClick={handleClick}>
      <ButtonMenuItem>Item 1</ButtonMenuItem>
      <ButtonMenuItem>Item 2</ButtonMenuItem>
    </ButtonMenu>
  );
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c1 {
      position: relative;
      -webkit-align-items: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      border: 0;
      border-radius: 1000px;
      cursor: pointer;
      display: -webkit-inline-box;
      display: -webkit-inline-flex;
      display: -ms-inline-flexbox;
      display: inline-flex;
      font-family: inherit;
      -webkit-box-pack: center;
      -webkit-justify-content: center;
      -ms-flex-pack: center;
      justify-content: center;
      line-height: 1;
      opacity: 1;
      outline: 0;
      -webkit-transition: background-color 0.2s,opacity 0.2s;
      transition: background-color 0.2s,opacity 0.2s;
      height: 30px;
      font-size: 14px;
      font-weight: 400;
      padding: 6px 8px;
      background: transparent;
      color: var(--colors--secondaryButtonText);
      font-family: Inter,sans-serif;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-align-items: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      -webkit-box-pack: center;
      -webkit-justify-content: center;
      -ms-flex-pack: center;
      justify-content: center;
      -webkit-transition: background-position 0.3s;
      transition: background-position 0.3s;
    }

    .c1:hover:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled):not(:active) {
      opacity: 0.65;
    }

    .c1:active:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled) {
      opacity: 0.85;
      -webkit-transform: translateY(1px);
      -ms-transform: translateY(1px);
      transform: translateY(1px);
      box-shadow: none;
    }

    .c1:disabled,
    .c1.pancake-button--disabled {
      background-color: var(--colors-backgroundDisabled);
      border-color: var(--colors-backgroundDisabled);
      box-shadow: none;
      color: var(--colors-textDisabled);
      cursor: not-allowed;
    }

    .c1:hover {
      background: var(--colors-ghostButtonHoverBg);
      opacity: 1 !important;
    }

    .c1:disabled {
      background: var(--colors-disabledBg);
      color: var(--colors-disabledText);
    }

    .c0 {
      height: 40px;
      background-color: var(--colors-inputBg);
      border-radius: 8px;
      display: -webkit-inline-box;
      display: -webkit-inline-flex;
      display: -ms-inline-flexbox;
      display: inline-flex;
      gap: 4px;
      border: 1px solid var(--colors-inputBorder);
      width: auto;
      padding: 4px;
    }

    .c0:hover {
      border: 1px solid var(--colors-inputBorderHover);
    }

    .c0 > button,
    .c0 > a {
      -webkit-flex: auto;
      -ms-flex: auto;
      flex: auto;
    }

    .c0 > button + button,
    .c0 > a + a {
      margin-left: 2px;
    }

    .c0 > button,
    .c0 a {
      box-shadow: none;
    }

    .c2 {
      background-color: var(--colors-backgroundAlt);
      color: var(--colors-text);
      border-radius: 4px;
    }

    .c2:hover:not(:disabled):not(:active) {
      background-color: var(--colors-backgroundAlt);
      color: var(--colors-text);
    }

    .c2:hover:not(:disabled):not(:active) svg {
      fill: var(--colors-text);
    }

    .c3 {
      background-color: var(--colors-inputBg);
      color: var(--colors-disabledTextDark);
      border-radius: 4px;
    }

    .c3:hover:not(:disabled):not(:active) {
      background-color: transparent;
      color: var(--colors-text);
    }

    .c3:hover:not(:disabled):not(:active) svg {
      fill: var(--colors-text);
    }

    <div
        class="c0"
      >
        <button
          class="c1 c2"
          scale="newXs"
        >
          Item 1
        </button>
        <button
          class="c1 c3"
          scale="newXs"
        >
          Item 2
        </button>
      </div>
    </DocumentFragment>
  `);
});
