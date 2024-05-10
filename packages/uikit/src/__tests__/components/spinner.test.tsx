import { renderWithProvider } from "../../testHelpers";
import { Spinner } from "../../components/Spinner";

it("renders correctly", () => {
  const { asFragment } = renderWithProvider(<Spinner />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c0 {
      position: relative;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: radial-gradient(farthest-side,#30e8bf 94%,#0000) top/9px 9px no-repeat, conic-gradient(#0000 30%,#30e8bf);
      -webkit-mask: radial-gradient(farthest-side,#0000 calc(100% - 9px),#000 0);
      -webkit-animation: dRXZbQ 0.5s 0.4s ease alternate infinite;
      -webkit-animation: dRXZbQ 1s infinite linear;
      animation: dRXZbQ 1s infinite linear;
    }

    <div
        class="c0"
        size="64"
      />
    </DocumentFragment>
  `);
});
