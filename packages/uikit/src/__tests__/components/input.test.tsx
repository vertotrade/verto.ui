import React from "react";
import { renderWithProvider } from "../../testHelpers";
import Input from "../../components/Input/Input";

const handleChange = jest.fn();

it("renders correctly", () => {
  const { asFragment } = renderWithProvider(<Input type="text" value="input" onChange={handleChange} />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c0 {
      background-color: var(--colors-inputBg);
      border-radius: 8px;
      color: var(--colors-text);
      display: block;
      font-size: 16px;
      height: 48px;
      outline: 0;
      padding: 0 16px;
      width: 100%;
      border: 1px solid var(--colors-inputBorder);
    }

    .c0::-webkit-input-placeholder {
      color: var(--colors-placeholder);
    }

    .c0::-moz-placeholder {
      color: var(--colors-placeholder);
    }

    .c0:-ms-input-placeholder {
      color: var(--colors-placeholder);
    }

    .c0::placeholder {
      color: var(--colors-placeholder);
    }

    .c0:hover {
      border: 1px solid var(--colors-inputBorderHover);
    }

    .c0:disabled {
      background-color: var(--colors-backgroundDisabled);
      color: var(--colors-textDisabled);
      cursor: not-allowed;
      border: 1px solid var(--colors-disabledBg);
    }

    .c0:focus:not(:disabled) {
      border: 1px solid var(--colors-newPrimary);
    }

    <input
        class="c0"
        scale="lg"
        type="text"
        value="input"
      />
    </DocumentFragment>
  `);
});
