import React from "react";
import { renderWithProvider } from "../../testHelpers";
import MenuItem from "../../components/MenuItem/MenuItem";

it("renders correctly", () => {
  const { asFragment } = renderWithProvider(
    <MenuItem>
      <div />
    </MenuItem>
  );
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c0 {
      -webkit-align-items: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      height: 100%;
      position: relative;
    }

    .c1 {
      -webkit-align-items: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      border-radius: 10px;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      outline: none;
      cursor: pointer;
      -webkit-text-decoration: none;
      text-decoration: none;
      position: relative;
      font-size: 1rem;
      width: -webkit-fit-content;
      width: -moz-fit-content;
      width: fit-content;
      font-weight: 500;
      padding: 8px 12px;
      height: 100%;
      -webkit-align-items: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      background: var(--colors-text);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      opacity: 1;
      margin-bottom: -1px;
    }

    .c1:hover,
    .c1:focus {
      color: var(--colors-gradientGreenOrange);
      opacity: 1;
      background: var(--colors-gradientGreenOrange);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      color: var(--colors-text);
    }

    <div
        class="c0"
      >
        <div
          class="c1"
        >
          <div />
        </div>
      </div>
    </DocumentFragment>
  `);
});
