import {
    Item,
    createEmptyItem,
    getItemAbove,
    getItemBelow,
    isRoot,
    node,
    removeItemFromTree,
    insertItemAfter,
    insertItemBefore,
    insertItemAsFirstChild,
    getItemIndex,
    insertItemAt,
} from "./tree";

import "./entry.css";
import {
    closeItemDom,
    emptyText,
    insertItemToDom,
    openItemDom,
    removeItemFromDom,
    renderApp,
    startEdit,
    stopEdit,
    updateItem,
    updateSelection,
} from "./views";
import {
    itemCreated,
    redoLastChange,
    removeItem,
    undoLastChange,
} from "./actions";

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

type Mode = "Normal" | "Insert";
let mode: Mode = "Normal";

export function selectItem(item: Item | undefined) {
    if (!item) return;

    updateSelection(selected, item);
    selected = item;
}

function closeItem(item: Item) {
    item.isOpen = false;

    closeItemDom(item);
}

function openItem(item: Item) {
    item.isOpen = true;
    openItemDom(item);
}

export function startEditSelectedItem() {
    mode = "Insert";
    startEdit(selected);
}

export function stopEditSelectedItem() {
    mode = "Normal";
    stopEdit(selected);
}

function moveItem(item: Item, newParent: Item, index: number) {
    removeItemFromTree(selected);
    removeItemFromDom(selected);

    insertItemAt(newParent, item, index);
    insertItemToDom(selected);

    updateItem(newParent);
    updateSelection(undefined, selected);
}

function moveSelectedDown() {
    const index = getItemIndex(selected);
    if (index < selected.parent.children.length - 1)
        moveItem(selected, selected.parent, index + 1);
}

function moveSelectedUp() {
    const index = getItemIndex(selected);
    if (index > 0) moveItem(selected, selected.parent, index - 1);
}

function moveSelectedLeft() {
    if (!isRoot(selected.parent)) {
        const oldParent = selected.parent;
        if (oldParent.children.length == 1) closeItem(oldParent);
        moveItem(selected, oldParent.parent, getItemIndex(oldParent) + 1);
        updateItem(oldParent);
    }
}
function moveSelectedRight() {
    const index = getItemIndex(selected);
    if (index > 0) {
        const prev = selected.parent.children[index - 1];

        if (prev) {
            if (!prev.isOpen) openItem(prev);
            moveItem(selected, prev, prev.children.length);
        }
    }
}

//TODO: this is a cyclical dependency from views.ts. Needs to remove cycles and extract this
export function onOpenToggleClick(item: Item) {
    if (item.isOpen) closeItem(item);
    else openItem(item);
}

document.addEventListener("keydown", (e) => {
    if (mode == "Insert" && (e.code == "Enter" || e.code == "Escape")) {
        stopEditSelectedItem();
        return;
    }

    if (mode == "Insert") {
        return;
    }

    if (e.code == "KeyU") {
        if (e.shiftKey) redoLastChange();
        else undoLastChange();
    }
    if (e.code == "KeyO") {
        const item = createEmptyItem();

        if (e.shiftKey) insertItemBefore(selected, item);
        if (e.ctrlKey) insertItemAsFirstChild(selected, item);
        else insertItemAfter(selected, item);

        itemCreated(item);
        updateItem(selected);
        insertItemToDom(item);

        selectItem(item);
        startEditSelectedItem();
        e.preventDefault();
    } else if (e.code == "KeyD") {
        removeItem(selected);
    } else if (e.code == "KeyJ") {
        if (e.altKey) moveSelectedDown();
        else selectItem(getItemBelow(selected));
    } else if (e.code == "KeyK") {
        if (e.altKey) moveSelectedUp();
        else selectItem(getItemAbove(selected));
    } else if (e.code == "KeyH") {
        if (e.altKey) moveSelectedLeft();
        else if (selected.isOpen) closeItem(selected);
        else if (selected.parent && !isRoot(selected.parent))
            selectItem(selected.parent);
    } else if (e.code == "KeyL") {
        if (e.altKey) moveSelectedRight();
        else if (selected.isOpen && selected.children.length > 0)
            selectItem(selected.children[0]);
        else if (!selected.isOpen && selected.children.length > 0)
            openItem(selected);
    } else if (e.code == "KeyI") {
        startEditSelectedItem();

        e.preventDefault();
    } else if (e.code == "KeyR" && !e.ctrlKey) {
        startEditSelectedItem();
        emptyText(selected);

        e.preventDefault();
    }
});

document.body.appendChild(renderApp(root));

updateSelection(undefined, selected);
