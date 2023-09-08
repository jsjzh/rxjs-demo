import { html } from "lit-html";

export const inputTemplate = (id: string, title: string) => html`
  <label for=${id}>${title}</label>
  <input
    type="number"
    name=${id}
    id=${id}
  />
`;

export const dragTemplate = (id: string, color: string) => html`
  <div
    id=${id}
    style="
      width: 50px;
      height: 50px;
      background: ${color};
      transform: translate3d(0px, 0px, 0px);
      z-index: 1;
      position: relative;
    "
  >
  </div>
`;
