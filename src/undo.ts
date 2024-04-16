import { addItemAt, moveItem, removeItem, renderApp, updateTitle } from "./actions";
import { Item } from "./tree";

// dispatch and revert changes

type Change =
    | { type: "rename"; oldName: string; newName: string; item: Item }
    | { type: "remove"; position: number; item: Item }
    | { type: "add"; position: number; parent: Item; item: Item }
    | { type: "loaded"; oldRoot: Item; oldSelected: Item; newRoot: Item; newSelected: Item }
    | { type: "move"; item: Item; oldIndex: number; oldParent: Item; newIndex: number; newParent: Item };

const changeHistory: Change[] = [];

let currentChange = -1;

export function addChange(change: Change) {
    pushNewChange(change);
    performChange(change);
}

export function undoLastChange() {
    if (currentChange > -1) {
        const change = changeHistory[currentChange];
        currentChange--;
        revertChange(change);
    }
}

export function redoLastChange() {
    if (currentChange < changeHistory.length - 1) {
        currentChange++;
        const change = changeHistory[currentChange];
        performChange(change);
    }
}

function pushNewChange(change: Change) {
    if (currentChange < changeHistory.length - 1) {
        changeHistory.splice(currentChange + 1, changeHistory.length - currentChange - 1);
    }

    changeHistory.push(change);
    currentChange++;
}

// prettier-ignore
function performChange(change: Change) {
    if      (change.type == "move")   moveItem(change.item, change.newParent, change.newIndex);
    else if (change.type == "rename") updateTitle(change.item, change.newName);
    else if (change.type == "remove") removeItem(change.item);
    else if (change.type == "loaded") renderApp(change.newRoot, change.newSelected);
    else if (change.type == "add")    addItemAt(change.item, change.parent, change.position);
    else                              assertNever(change);
}

// prettier-ignore
function revertChange(change: Change) {
    if      (change.type == "move")   moveItem(change.item, change.oldParent, change.oldIndex);
    else if (change.type == "rename") updateTitle(change.item, change.oldName);
    else if (change.type == "remove") addItemAt(change.item, change.item.parent, change.position);
    else if (change.type == "loaded") renderApp(change.oldRoot, change.oldSelected);
    else if (change.type == "add")    removeItem(change.item);
    else                              assertNever(change);
}

function assertNever(arg: never) {}
