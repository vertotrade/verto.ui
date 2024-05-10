import noop from "lodash/noop";
import { renderWithProvider } from "../../testHelpers";
import { Modal } from "../../widgets/Modal";

it("renders correctly", () => {
  const { asFragment } = renderWithProvider(
    <Modal title="Title" onDismiss={noop}>
      body
    </Modal>
  );
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c8 {
      -webkit-align-self: center;
      -ms-flex-item-align: center;
      align-self: center;
      fill: var(--colors-icon);
      -webkit-flex-shrink: 0;
      -ms-flex-negative: 0;
      flex-shrink: 0;
    }

    .c4 {
      color: var(--colors-text);
      font-weight: 500;
      line-height: 1.5;
      font-size: 16px;
    }

    .c4 .textSpan {
      font-size: 16px;
    }

    .c6 {
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
      height: 32px;
      padding: 0 16px;
      background-color: transparent;
      color: var(--colors-icon);
      box-shadow: none;
    }

    .c6:hover:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled):not(:active) {
      opacity: 0.65;
    }

    .c6:active:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled) {
      opacity: 0.85;
      -webkit-transform: translateY(1px);
      -ms-transform: translateY(1px);
      transform: translateY(1px);
      box-shadow: none;
    }

    .c6:disabled,
    .c6.pancake-button--disabled {
      background-color: var(--colors-backgroundDisabled);
      border-color: var(--colors-backgroundDisabled);
      box-shadow: none;
      color: var(--colors-textDisabled);
      cursor: not-allowed;
    }

    .c7 {
      padding: 8px;
    }

    .c2 {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
    }

    .c5 {
      font-size: 22px;
      font-weight: 600;
      line-height: 1.1;
    }

    .c1 {
      -webkit-align-items: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      background: transparent;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      margin-bottom: 14px;
    }

    .c3 {
      -webkit-align-items: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      -webkit-flex: 1;
      -ms-flex: 1;
      flex: 1;
    }

    .c9 {
      -webkit-flex-direction: column;
      -ms-flex-direction: column;
      flex-direction: column;
      overflow-y: auto;
      overflow-x: hidden;
      max-height: calc(90vh - 73px);
    }

    .c0 {
      overflow: hidden;
      background: var(--colors-white);
      box-shadow: 0px 20px 36px -8px rgba(14,14,44,0.1),0px 1px 1px rgba(0,0,0,0.05);
      border-radius: 16px 16px 0px 0px;
      width: auto;
      max-height: calc(var(--vh,1vh) * 100);
      z-index: 100;
      position: absolute;
      min-width: 320px;
      bottom: 0;
      padding: 30px 24px 24px;
    }

    @supports (-webkit-text-size-adjust:none) and (not (-ms-accelerator:true)) and (not (-moz-appearance:none)) {
      .c8 {
        -webkit-filter: none !important;
        filter: none !important;
      }
    }

    @media screen and (min-width:852px) {
      .c9 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        max-height: 90vh;
      }
    }

    @media screen and (min-width:852px) {
      .c0 {
        position: auto;
        bottom: auto;
        border-radius: 16px;
        max-height: 100vh;
      }
    }

    <div
        class="c0 modal"
      >
        <div
          class="c1"
        >
          <div
            class="c2 c3"
          >
            <h2
              class="c4 c5"
              color="text"
              font-size="16px"
            >
              Title
            </h2>
          </div>
          <button
            aria-label="Close the dialog"
            class="c6 c7"
            scale="sm"
          >
            <svg
              class="c8"
              color="icon"
              viewBox="0 0 24 24"
              width="24px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.3 5.70997C17.91 5.31997 17.28 5.31997 16.89 5.70997L12 10.59L7.10997 5.69997C6.71997 5.30997 6.08997 5.30997 5.69997 5.69997C5.30997 6.08997 5.30997 6.71997 5.69997 7.10997L10.59 12L5.69997 16.89C5.30997 17.28 5.30997 17.91 5.69997 18.3C6.08997 18.69 6.71997 18.69 7.10997 18.3L12 13.41L16.89 18.3C17.28 18.69 17.91 18.69 18.3 18.3C18.69 17.91 18.69 17.28 18.3 16.89L13.41 12L18.3 7.10997C18.68 6.72997 18.68 6.08997 18.3 5.70997Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <div
          class="c2 c9"
        >
          body
        </div>
      </div>
    </DocumentFragment>
  `);
});
