import { div, insertAfter, span } from "./html";
import { chevronIcon } from "./icons";
import { Item, getItemIndex, isRoot } from "../tree";

type ItemViews = {
    children: HTMLElement;
    container: HTMLElement;
    item: HTMLElement;
    square: HTMLElement;
    chevron: HTMLElement;
    text: HTMLElement;
};

export const views = new WeakMap<Item, ItemViews>();

export function removeItemFromDom(item: Item) {
    views.get(item)?.container.remove();
}

export function insertItemToDom(item: Item) {
    const index = getItemIndex(item);
    let childrenElem = views.get(item.parent)?.children;
    if (!childrenElem) {
        insertChildren(item.parent);
    } else if (index >= item.parent.children.length) {
        childrenElem?.appendChild(renderItem(item));
    } else {
        childrenElem!.insertBefore(renderItem(item), childrenElem!.childNodes[index]);
    }
}

export function updateSelection(prev: Item | undefined, current: Item | undefined) {
    prev && views.get(prev)?.item.classList.remove("selected");
    current && views.get(current)?.item.classList.add("selected");
}

export function removeChildren(item: Item) {
    const itemElem = views.get(item);
    if (!itemElem) return;

    itemElem.children.remove();
}

export function insertChildren(item: Item) {
    const itemElem = views.get(item);
    if (!itemElem) return;

    insertAfter(itemElem.item, renderChildren(item));
}

export function updateItem(item: Item) {
    const itemElem = views.get(item);
    if (!itemElem || isRoot(item)) return;

    itemElem.text.innerText = item.title;
    if (item.children.length == 0) itemElem.item.classList.add("empty");
    else {
        itemElem.item.classList.remove("empty");

        if (item.isOpen) itemElem.item.classList.add("open");
        else itemElem.item.classList.remove("open");
    }
}

export function startEdit(item: Item) {
    const elem = views.get(item)!.text;
    elem.contentEditable = "true";
    elem.focus();
}
export function emptyText(item: Item) {
    views.get(item)!.text.innerText = "";
}

export function stopEdit(item: Item) {
    const elem = views.get(item)!.text;
    elem.blur();
    elem.removeAttribute("contentEditable");
}

export function getItemTitle(item: Item) {
    return views.get(item)!.text.innerText;
}

function onToggle(item: Item) {
    const ev = new CustomEvent("toggle-item", { detail: item });
    document.dispatchEvent(ev);
}

function renderItem(item: Item): HTMLElement {
    //TODO: ugly, but I need to prepopulate empty object
    const view: ItemViews = {} as any;
    views.set(item, view);
    const itemElem = div({
        ref: (ref) => (view.container = ref),
        children: [
            div({
                className: "item",
                ref: (ref) => (view.item = ref),
                children: [
                    div({
                        ref: (ref) => (view.chevron = ref),
                        className: "chevron-container",
                        children: [chevronIcon()],
                        onClick: () => onToggle(item),
                    }),
                    div({
                        className: "square",
                        ref: (ref) => (view.square = ref),
                    }),

                    span({
                        className: "item-text",
                        children: [item.title],
                        ref: (ref) => (view.text = ref),
                    }),
                ],
            }),
            item.isOpen &&
                div({
                    className: "children-container",
                    children: item.children.map(renderItem),
                    ref: (ref) => (view.children = ref),
                }),
        ],
    });

    updateItem(item);

    return itemElem;
}

const renderChildren = (item: Item) =>
    div({
        className: "children-container",
        children: item.children.map(renderItem),
        ref: (ref) => (views.get(item)!.children = ref),
    });

export const renderList = (root: Item) => {
    views.set(root, {} as any);
    return div({
        className: "list",
        children: [renderChildren(root)],
    });
};
