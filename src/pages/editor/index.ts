import { html, render } from "lit-html";
import { fromEvent, map, of, startWith, tap, withLatestFrom } from "rxjs";
import { inputCheckboxTemplate } from "../../shared/template";

const $document = document;
const $app = document.getElementById("app") as HTMLDivElement;

const template = html`
  <div>${inputCheckboxTemplate("upperCase", "大写")}</div>
  <textarea
    id="textarea"
    name="text"
    rows="10"
    cols="50"
  ></textarea>
`;

render(template, $app);

const $textarea = document.getElementById("textarea")! as HTMLTextAreaElement;
const $upperCase = document.getElementById("upperCase")! as HTMLInputElement;

const textarea$ = fromEvent<InputEvent>($textarea, "input");
const upperCase$ = fromEvent<InputEvent>($upperCase, "input").pipe(
  startWith({ target: { checked: false } }),
);

textarea$
  .pipe(
    withLatestFrom(
      upperCase$.pipe(
        tap(() => {
          $textarea.focus();
        }),
      ),
    ),
    map((events) => {
      return (<HTMLInputElement>events[1].target).checked === true
        ? events[0].data?.toUpperCase()
        : events[0].data?.toLowerCase();
    }),
  )
  .subscribe((value) => {
    $textarea.value = value!;
  });
