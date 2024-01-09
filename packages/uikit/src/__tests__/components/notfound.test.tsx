import React from "react";
import { renderWithProvider } from "../../testHelpers";
import NotFound from "../../components/NotFound/NotFound";

it("renders correctly with statusCode", () => {
  const { asFragment } = renderWithProvider(<NotFound statusCode={400} />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c3 {
      -webkit-align-self: center;
      -ms-flex-item-align: center;
      align-self: center;
      fill: var(--colors-text);
      -webkit-flex-shrink: 0;
      -ms-flex-negative: 0;
      flex-shrink: 0;
      margin-bottom: 8px;
    }

    .c1 {
      color: var(--colors-text);
      font-weight: 500;
      line-height: 1.5;
      font-size: 16px;
    }

    .c4 {
      color: var(--colors-text);
      font-weight: 500;
      line-height: 1.5;
      margin-bottom: 8px;
      font-size: 16px;
    }

    .c6 {
      color: var(--colors-text);
      font-weight: 400;
      line-height: 1.5;
      margin-bottom: 16px;
      font-size: 16px;
    }

    .c8 {
      color: var(--colors-text);
      font-weight: 400;
      line-height: 1.5;
      font-weight: 600;
      font-size: 16px;
    }

    .c7 {
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
      height: 48px;
      padding: 0 24px;
      background-color: var(--colors-newPrimary);
      border-color: transparent;
      box-shadow: none;
      color: var(--colors-black);
      font-weight: 500;
      margin-right: 16px;
    }

    .c7:hover:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled):not(:active) {
      opacity: 0.65;
    }

    .c7:active:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled) {
      opacity: 0.85;
      -webkit-transform: translateY(1px);
      -ms-transform: translateY(1px);
      transform: translateY(1px);
      box-shadow: none;
    }

    .c7:disabled,
    .c7.pancake-button--disabled {
      background-color: var(--colors-backgroundDisabled);
      border-color: var(--colors-backgroundDisabled);
      box-shadow: none;
      color: var(--colors-textDisabled);
      cursor: not-allowed;
    }

    .c7:hover {
      background-color: var(--colors-newPrimaryDark);
      opacity: 1 !important;
    }

    .c7:active {
      background-color: var(--colors-newPrimaryDark);
      opacity: 1 !important;
    }

    .c7:disabled {
      background-color: transparent;
    }

    .c2 {
      font-size: 48px;
      font-weight: 600;
      line-height: 1.1;
    }

    .c5 {
      font-size: 22px;
      font-weight: 600;
      line-height: 1.1;
    }

    .c0 {
      -webkit-align-items: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-flex-direction: column;
      -ms-flex-direction: column;
      flex-direction: column;
      height: calc(100vh - 64px);
      -webkit-box-pack: center;
      -webkit-justify-content: center;
      -ms-flex-pack: center;
      justify-content: center;
    }

    @supports (-webkit-text-size-adjust:none) and (not (-ms-accelerator:true)) and (not (-moz-appearance:none)) {
      .c3 {
        -webkit-filter: none !important;
        filter: none !important;
      }
    }

    <div
        class="c0"
      >
        <h2
          class="c1 c2"
          color="text"
          font-size="16px"
          scale="xxl"
        >
          400
        </h2>
        <svg
          class="c3"
          color="text"
          height="30"
          viewBox="0 0 167 30"
          width="64px"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            fill="url(#pattern0)"
            height="30"
            width="167"
          />
          <defs>
            <pattern
              height="1"
              id="pattern0"
              patternContentUnits="objectBoundingBox"
              width="1"
            >
              <use
                transform="scale(0.00122249 0.00680522)"
                xlink:href="#image0_1_331"
              />
            </pattern>
            <image
              height="147"
              id="image0_1_331"
              width="818"
              xlink:href="data:image/png;base64,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"
            />
          </defs>
        </svg>
        <h2
          class="c4 c5"
          color="text"
          font-size="16px"
          scale="lg"
        >
          Page Not Found
        </h2>
        <div
          class="c6"
          color="text"
          font-size="16px"
        >
          Sorry, but the page you were looking for could not be found.
        </div>
        <a
          href="/"
        >
          <button
            class="c7"
            scale="md"
          >
            <div
              class="c8"
              color="text"
              font-size="16px"
              font-weight="600"
            >
              Back to Home Page
            </div>
          </button>
        </a>
      </div>
    </DocumentFragment>
  `);
});
