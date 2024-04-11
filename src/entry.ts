import { div, fragment, insertAfter, span } from "./html";
import { chevronIcon } from "./icons";
import { Item, getItemAbove, getItemBelow, isRoot, node } from "./item";

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

function selectItem(item: Item | undefined) {
    if (!item) return;

    views.get(selected)?.classList.remove("selected");
    selected = item;
    views.get(selected)?.classList.add("selected");
}

function closeItem(item: Item) {
    const itemElem = views.get(item);
    item.isOpen = false;
    if (itemElem) {
        itemElem.nextSibling?.remove();
        updateItem(item);
    }
}

function openItem(item: Item) {
    item.isOpen = true;
    const itemElem = views.get(item);
    if (itemElem) {
        insertAfter(
            itemElem,
            div({
                className: "children-container",
                children: item.children.map(renderItem),
            })
        );
        updateItem(item);
    }
}

function updateItem(item: Item) {
    const itemElem = views.get(item);
    if (itemElem) {
        if (item.children.length == 0) itemElem.classList.add("empty");
        else {
            itemElem.classList.remove("empty");

            if (item.isOpen) itemElem.classList.add("open");
            else itemElem.classList.remove("open");
        }
    }
}

document.addEventListener("keydown", (e) => {
    if (e.code == "KeyJ") selectItem(getItemBelow(selected));
    else if (e.code == "KeyK") selectItem(getItemAbove(selected));
    else if (e.code == "KeyH") {
        if (selected.isOpen) closeItem(selected);
        else if (selected.parent && !isRoot(selected.parent))
            selectItem(selected.parent);
    } else if (e.code == "KeyL") {
        if (selected.isOpen && selected.children.length > 0)
            selectItem(selected.children[0]);
        else if (!selected.isOpen) openItem(selected);
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
            item.title,
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
