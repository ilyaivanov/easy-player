import { selectItem } from "./entry";
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
    getItemIndex,
    insertItemAt,
} from "./tree";

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

type Change =
    | { type: "rename"; oldName: string; newName: string; item: Item }
    | { type: "remove"; position: number; item: Item }
    | { type: "add"; position: number; item: Item }
    | { type: "move" };

const changeHistory: Change[] = [];

let currentChange = -1;

// export function itemRenamed(item: Item, )

//TODO: ugly fucking name. Need to think abouts actions/tree/views
function remItem(item: Item) {
    const nextSelected = getItemToSelectAfterRemoval(item);

    removeItemFromTree(item);

    removeItemFromDom(item);

    //TODO: this is ugly, need to think
    if (!isRoot(item.parent)) updateItem(item.parent);

    selectItem(nextSelected);
}

function pushNewChange(change: Change) {
    if (currentChange < changeHistory.length - 1) {
        changeHistory.splice(
            currentChange + 1,
            changeHistory.length - currentChange - 1
        );
    }

    changeHistory.push(change);
    currentChange++;
}

export function removeItem(item: Item) {
    pushNewChange({
        item,
        type: "remove",
        position: getItemIndex(item),
    });

    remItem(item);
}

export function itemCreated(item: Item) {
    pushNewChange({ item, type: "add", position: getItemIndex(item) });
}

export function itemRenamed(item: Item, newName: string) {
    pushNewChange({ type: "rename", item, oldName: item.title, newName });
    item.title = newName;
}

export function undoLastChange() {
    if (currentChange > -1) {
        const change = changeHistory[currentChange];
        currentChange--;
        if (change.type == "remove") {
            const { item, position } = change;
            insertItemAt(item.parent!, item, position);
            insertItemToDom(item);

            selectItem(item);
        } else if (change.type == "add") {
            remItem(change.item);
        } else if (change.type == "rename") {
            change.item.title = change.oldName;
            updateItem(change.item);
            selectItem(change.item);
        }
    }
}

export function redoLastChange() {
    if (currentChange < changeHistory.length - 1) {
        currentChange++;
        const change = changeHistory[currentChange];
        if (change.type == "remove") {
            remItem(change.item);
        } else if (change.type == "add") {
            insertItemAt(change.item.parent!, change.item, change.position);
            insertItemToDom(change.item);
            selectItem(change.item);
        } else if (change.type == "rename") {
            change.item.title = change.newName;
            updateItem(change.item);
            selectItem(change.item);
        }
    }
}
