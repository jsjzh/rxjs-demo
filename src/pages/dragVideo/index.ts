import { html, render } from "lit-html";
import {
  concatAll,
  filter,
  fromEvent,
  map,
  takeUntil,
  withLatestFrom,
} from "rxjs";

import "./index.scss";

const $document = document;
const $app = $document.getElementById("app") as HTMLDivElement;

const page = html` <div id="anchor">
  <div
    class="video"
    id="video"
  >
    <div class="masker"></div>
    <video
      width="100%"
      controls
    >
      <source
        src="http://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_480p_stereo.ogg"
        type="video/ogg"
      />
      Your browser does not support HTML5 video.
    </video>
  </div>
</div>`;

render(page, $app);

const $video = $document.getElementById("video")!;
const $anchor = $document.getElementById("anchor")!;

const scroll$ = fromEvent($document, "scroll");

scroll$
  .pipe(map((e) => $anchor.getBoundingClientRect().bottom < 0))
  .subscribe((bool) => {
    if (bool) {
      $video.classList.add("video-fixed");
    } else {
      $video.classList.remove("video-fixed");
    }
  });

const mouseDown$ = fromEvent<MouseEvent>($video, "mousedown");
const mouseUp$ = fromEvent<MouseEvent>($document, "mouseup");
const mouseMove$ = fromEvent<MouseEvent>($document, "mousemove");

const validValue = (value, max, min) => {
  return Math.min(Math.max(value, min), max);
};

mouseDown$
  .pipe(
    filter((e) => $video.classList.contains("video-fixed")),
    map((e) =>
      mouseMove$.pipe(
        map((e) => e),
        takeUntil(mouseUp$),
      ),
    ),
    concatAll(),
    withLatestFrom(mouseDown$, (move, down) => {
      return {
        x: validValue(move.clientX - down.offsetX, window.innerWidth - 320, 0),
        y: validValue(move.clientY - down.offsetY, window.innerHeight - 180, 0),
      };
    }),
  )
  .subscribe((pos) => {
    $video.style.left = pos.x + "px";
    $video.style.top = pos.y + "px";
  });
