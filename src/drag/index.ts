import { html, render } from "lit-html";
import { fromEvent, map, switchAll, switchMap, takeUntil, tap } from "rxjs";
import { dragTemplate } from "../shared/template";

const $document = document;
const $app = document.getElementById("app") as HTMLDivElement;

const template = html`
  ${dragTemplate("red", "red")} ${dragTemplate("blue", "blue")}
`;

render(template, $app);

const $red = document.getElementById("red")!;
const $blue = document.getElementById("blue")!;

fromEvent<MouseEvent>($red, "mousedown")
  .pipe(
    switchMap((e) => {
      $red.style.zIndex = "999";

      const baseX = e.clientX;
      const baseY = e.clientY;

      const [preX, preY] = $red.style.transform
        .slice(12, -1)
        .replace(/px/g, "")
        .split(", ")
        .map((x) => parseInt(x));

      const offsetX = baseX - preX;
      const offsetY = baseY - preY;

      return fromEvent<MouseEvent>($document, "mousemove").pipe(
        takeUntil(
          fromEvent($document, "mouseup").pipe(
            map(() => {
              $red.style.zIndex = "1";
            }),
          ),
        ),
        map((e) => ({ X: e.pageX - offsetX, Y: e.pageY - offsetY })),
      );
    }),
  )
  .subscribe((pos) => {
    $red.style.transform = `translate3d(${pos.X}px, ${pos.Y}px, 0px)`;
  });

const mouseDown = fromEvent<MouseEvent>($blue, "mousedown");
const mouseUp = fromEvent<MouseEvent>($document, "mouseup");
const mouseMove = fromEvent<MouseEvent>($document, "mousemove");

mouseDown
  .pipe(
    map((event) => {
      $blue.style.zIndex = "999";
      const baseX = event.clientX;
      const baseY = event.clientY;

      const [preX, preY] = $blue.style.transform
        .slice(12, -1)
        .replace(/px/g, "")
        .split(", ")
        .map((x) => parseInt(x));

      const offsetX = baseX - preX;
      const offsetY = baseY - preY;

      return mouseMove.pipe(
        takeUntil(
          mouseUp.pipe(
            map(() => {
              $blue.style.zIndex = "1";
            }),
          ),
        ),
        map((e) => ({ X: e.pageX - offsetX, Y: e.pageY - offsetY })),
      );
    }),
    switchAll(),
  )
  .subscribe((pos) => {
    $blue.style.zIndex = "1";
    $blue.style.transform = `translate3d(${pos.X}px, ${pos.Y}px, 0px)`;
  });
