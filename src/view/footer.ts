import { Item } from "../tree";
import {
    PlayerProgressState,
    formatTime,
    formatTimeOmitHour,
    youtubeIframeId,
} from "../youtubePlayer";
import { div, img, span } from "./html";

let title: HTMLElement;
let image: HTMLImageElement;
let time: HTMLElement;
let footer: HTMLElement;

export function renderFooter() {
    return div({
        ref: (ref) => (footer = ref),
        className: "footer",
        children: [
            img({ ref: (ref) => (image = ref) }),
            div({
                className: "text-container",
                children: [
                    span({ ref: (ref) => (title = ref) }),
                    span({ ref: (ref) => (time = ref), className: "video-time" }),
                ],
            }),
            div({ className: "mini-player", id: youtubeIframeId }),
        ],
    });
}

export function updateItemPlaying(item: Item) {
    if (!image.src) {
        footer.classList.add("visible");
    }
    title.innerText = item.title;
    image.src = `https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`;
}

export function updateProgressTime(e: PlayerProgressState) {
    const oneHour = 60 * 60;
    const formatter = e.duration >= oneHour ? formatTime : formatTimeOmitHour;

    time.innerText = `${formatter(e.currentTime)} / ${formatter(e.duration)}`;
}
