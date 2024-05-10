import React from "react";
import { renderWithProvider } from "../../testHelpers";
import { Card, CardBody, CardHeader, CardFooter } from "../../components/Card";

it("renders correctly", () => {
  const { asFragment } = renderWithProvider(
    <Card>
      <CardHeader>Header</CardHeader>
      <CardBody>Body</CardBody>
      <CardFooter>Footer</CardFooter>
    </Card>
  );
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c0 {
      background: var(--colors-backgroundAlt);
      border-radius: var(--radii-default);
      color: var(--colors-text);
      overflow: hidden;
      position: relative;
    }

    .c1 {
      width: 100%;
      height: 100%;
      overflow: inherit;
      background: var(--colors-backgroundAlt);
      padding: 24px;
    }

    .c3 {
      padding-top: 0px;
      padding-bottom: 0px;
    }

    .c2 {
      background: var(--colors-backgroundAlt);
      border-radius: var(--radii-card) var(--radii-card) 0 0;
      padding-bottom: 24px;
    }

    .c4 {
      border-top: 1px solid var(--colors-hrBold);
      padding-top: 24px;
    }

    <div
        class="c0"
      >
        <div
          class="c1"
        >
          <div
            class="c2"
          >
            Header
          </div>
          <div
            class="c3"
          >
            Body
          </div>
          <div
            class="c4"
          >
            Footer
          </div>
        </div>
      </div>
    </DocumentFragment>
  `);
});
