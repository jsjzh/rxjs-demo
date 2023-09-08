import { html, render } from "lit-html";
import { combineLatest, fromEvent, map } from "rxjs";
import { inputNumberTemplate } from "../../shared/template";

const $document = document;
const $app = document.getElementById("app") as HTMLDivElement;

const template = html`
  <div>${inputNumberTemplate("weight", "体重")}</div>
  <div>${inputNumberTemplate("height", "身高")}</div>
  <div>${inputNumberTemplate("BMI", "指数")}</div>
`;

render(template, $app);

const $weight = document.getElementById("weight") as HTMLInputElement;
const $height = document.getElementById("height") as HTMLInputElement;
const $BMI = document.getElementById("BMI") as HTMLInputElement;

const weight$ = fromEvent<InputEvent>($weight, "input");
const height$ = fromEvent<InputEvent>($height, "input");

combineLatest([weight$, height$])
  .pipe(
    map((values) =>
      values.map((e) => (<HTMLInputElement>e.target).valueAsNumber),
    ),
    map((values) => values[0] / values[1] / values[1]),
  )
  .subscribe((value) => ($BMI.valueAsNumber = value));
