import { html, render } from "lit-html";
import { fromEvent, map } from "rxjs";

const $document = document;
const $app = document.getElementById("app") as HTMLDivElement;

const template = html`
  <div>
    <a href="/#/bmi">bmi</a>
    <a href="/#/drag">drag</a>
  </div>
`;

render(template, $app);

const pageChange$ = fromEvent<HashChangeEvent>(window, "hashchange").pipe(
  map((e) => new URL(e.newURL).hash.slice(2)),
);

pageChange$.subscribe(console.log);
