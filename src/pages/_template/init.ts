import { html, render } from "lit-html";
import { of } from "rxjs";

const $document = document;
const $app = document.getElementById("app") as HTMLDivElement;

const template = html`<div></div>`;

render(template, $app);

of("hello world").subscribe((value) => {
  $app.innerText = value;
});
