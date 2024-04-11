import { div, fragment, insertAfter, span } from "./html";
import { chevronIcon } from "./icons";
import {
    Item,
    getItemAbove,
    getItemBelow,
    getItemIndex,
    isRoot,
    node,
} from "./item";

import "./entry.css";

const root: Item = node("Root", [
    node("Music", [
        node("Electro"),
        node("Piano"),
        node("Ambient", [
            node("Carbon Based Lifeforms"),
            node("Sync24"),
            node("James Murray"),
        ]),
    ]),
    node("Software Development"),
    node("Channels"),
    node("Four"),
]);

let selected: Item = root.children[0];
const views = new WeakMap<Item, HTMLElement>();

type Mode = "Normal" | "Insert";
let mode: Mode = "Normal";

function selectItem(item: Item | undefined) {
    if (!item) return;

    views.get(selected)?.classList.remove("selected");
    selected = item;
    views.get(selected)?.classList.add("selected");
}

function closeItem(item: Item) {
    item.isOpen = false;

    const itemElem = views.get(item);
    if (!itemElem) return;

    itemElem.nextSibling?.remove();
    updateItem(item);
}

function openItem(item: Item) {
    item.isOpen = true;
    const itemElem = views.get(item);
    if (!itemElem) return;

    insertAfter(
        itemElem,
        div({
            className: "children-container",
            children: item.children.map(renderItem),
        })
    );
    updateItem(item);
}

function updateItem(item: Item) {
    const itemElem = views.get(item);
    if (!itemElem) return;

    if (item.children.length == 0) itemElem.classList.add("empty");
    else {
        itemElem.classList.remove("empty");

        if (item.isOpen) itemElem.classList.add("open");
        else itemElem.classList.remove("open");
    }
}
function startEditSelectedItem() {
    mode = "Insert";
    //TODO: this is also ugly
    const elem = views.get(selected)?.childNodes[2] as HTMLElement;
    elem.contentEditable = "true";
    elem.focus();
}

function stopEditSelectedItem() {
    mode = "Normal";
    //TODO: this is also ugly
    const elem = views.get(selected)?.childNodes[2] as HTMLElement;
    elem.blur();
    elem.removeAttribute("contentEditable");
}

document.addEventListener("keydown", (e) => {
    if (mode == "Insert" && (e.code == "Enter" || e.code == "Escape")) {
        stopEditSelectedItem();

        return;
    }

    if (mode == "Insert") {
        return;
    }

    //TODO: insert and delete items
    //TODO: move items around
    //TODO: undo/redo
    if (e.code == "KeyO") {
        const item: Item = {
            title: "",
            children: [],
            isOpen: false,
            parent: undefined,
            type: "node",
        };
        const index = getItemIndex(selected);

        selected.parent?.children.splice(index + 1, 0, item);
        item.parent = selected.parent;

        if (selected.isOpen)
            insertAfter(
                views.get(selected)!.nextSibling as HTMLElement,
                renderItem(item)
            );
        else insertAfter(views.get(selected)!, renderItem(item));

        selectItem(item);
        startEditSelectedItem();
        e.preventDefault();
    } else if (e.code == "KeyJ") selectItem(getItemBelow(selected));
    else if (e.code == "KeyK") selectItem(getItemAbove(selected));
    else if (e.code == "KeyH") {
        if (selected.isOpen) closeItem(selected);
        else if (selected.parent && !isRoot(selected.parent))
            selectItem(selected.parent);
    } else if (e.code == "KeyL") {
        if (selected.isOpen && selected.children.length > 0)
            selectItem(selected.children[0]);
        else if (!selected.isOpen) openItem(selected);
    } else if (e.code == "KeyI") {
        startEditSelectedItem();

        e.preventDefault();
    }
});

function renderItem(item: Item): HTMLElement {
    function onCloseClick() {
        if (item.isOpen) closeItem(item);
        else openItem(item);
    }

    const itemElem = div({
        className: "item",
        classMap: { selected: item == selected },
        children: [
            div({
                className: "chevron-container",
                children: [chevronIcon()],
                onClick: onCloseClick,
            }),
            div({ className: "square" }),
            span({
                className: "item-text",
                children: [item.title],
                onInput: (e) => (item.title = e.currentTarget.innerText),
            }),
        ],
    });
    views.set(item, itemElem);

    updateItem(item);

    if (item.isOpen)
        return fragment(
            itemElem,
            div({
                className: "children-container",
                children: item.children.map(renderItem),
            })
        );
    else return itemElem;
}

document.body.appendChild(
    div({ className: "list", children: root.children.map(renderItem) })
);
