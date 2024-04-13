import {
    Item,
    createEmptyItem,
    getItemAbove,
    getItemBelow,
    isRoot,
    node,
    removeItemFromTree,
    getItemToSelectAfterRemoval,
    insertItemAfter,
    insertItemBefore,
    insertItemAsFirstChild,
} from "./tree";

import "./entry.css";
import {
    closeItemDom,
    insertItemToDom,
    openItemDom,
    removeItemFromDom,
    renderApp,
    startEdit,
    stopEdit,
    updateItem,
    updateSelection,
} from "./views";

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

function selectItem(item: Item | undefined) {
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

function startEditSelectedItem() {
    mode = "Insert";
    startEdit(selected);
}

function stopEditSelectedItem() {
    mode = "Normal";
    stopEdit(selected);
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

    //TODO: move items around
    //TODO: undo/redo

    if (e.code == "KeyO") {
        const item = createEmptyItem();

        if (e.shiftKey) insertItemBefore(selected, item);
        if (e.ctrlKey) {
            insertItemAsFirstChild(selected, item);
            e.preventDefault();
        } else insertItemAfter(selected, item);

        updateItem(selected);
        insertItemToDom(item);

        selectItem(item);
        startEditSelectedItem();
        e.preventDefault();
    } else if (e.code == "KeyD") {
        const nextSelected = getItemToSelectAfterRemoval(selected);
        removeItemFromTree(selected);

        removeItemFromDom(selected);

        //TODO: this is ugly, need to think
        updateItem(selected.parent!);

        selectItem(nextSelected);
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

document.body.appendChild(renderApp(root));

updateSelection(undefined, selected);
