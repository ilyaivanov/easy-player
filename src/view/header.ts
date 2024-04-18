import { div, span } from "./html";
import { chevronIcon } from "./icons";

import "./header.css";
import { state } from "../state";
import { Item, isRoot } from "../tree";
import { dispatchCustomEvent } from "./events";

let header: HTMLElement;

export function renderHeader() {
    return div({
        className: "header",
        ref: (ref) => (header = ref),
        children: [],
    });
}

function itemPart(item: Item) {
    return span({
        className: "part",
        children: [item.title],
        onClick: () => dispatchCustomEvent("item-focus", item),
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
            if (p == state.focused) return [itemPart(p)];
            else
                return [
                    itemPart(p),
                    div({ className: "header-chevron", children: [chevronIcon()] }),
                ];
        })
        .flat();

    header.replaceChildren(...newChildren);
}
