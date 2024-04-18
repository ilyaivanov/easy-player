import { div, img, span } from "./html";
import { chevronIcon } from "./icons";

import "./header.css";
import { state } from "../state";
import { isRoot } from "../tree";

let header: HTMLElement;

export function renderHeader() {
    return div({
        className: "header",
        ref: (ref) => (header = ref),
        children: [],
    });
}

export function updateFocus() {
    const path = [];
    let el = state.focused;
    while (!isRoot(el)) {
        path.push(el);
        el = el.parent;
    }
    path.push(state.root);
    path.reverse();

    const newChildren: HTMLElement[] = path
        .map((p) => {
            if (p == state.focused) return [span({ className: "part", children: [p.title] })];
            else
                return [
                    span({ className: "part", children: [p.title] }),
                    div({ className: "header-chevron", children: [chevronIcon()] }),
                ];
        })
        .flat();

    header.replaceChildren(...newChildren);
}
