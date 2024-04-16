import { state } from "./state";
import { Item, isRoot, removeItemFromTree, getItemToSelectAfterRemoval, getItemIndex, insertItemAt } from "./tree";
import {
    insertChildren,
    insertItemToDom,
    removeChildren,
    removeItemFromDom,
    renderList,
    updateItem,
    updateSelection,
} from "./view/views";

//
// the main idea of this file is to sync tree and dom
//

export function selectItem(item: Item | undefined) {
    if (!item) return;

    updateSelection(state.selected, item);
    state.selected = item;
}

export function moveItem(item: Item, newParent: Item, index: number) {
    removeItemFromTree(item);
    updateItem(item.parent);

    removeItemFromDom(item);

    insertItemAt(newParent, item, index);
    insertItemToDom(item);

    updateItem(newParent);
    updateSelection(undefined, item);
}

export function closeItem(item: Item) {
    item.isOpen = false;

    removeChildren(item);
    updateItem(item);
}

export function openItem(item: Item) {
    item.isOpen = true;

    insertChildren(item);
    updateItem(item);
}

export function updateTitle(item: Item, newTitle: string) {
    item.title = newTitle;
    updateItem(item);
}

export function removeItem(item: Item) {
    const nextSelected = getItemToSelectAfterRemoval(item);

    removeItemFromTree(item);

    removeItemFromDom(item);

    //TODO: this is ugly, need to think
    if (!isRoot(item.parent)) updateItem(item.parent);

    selectItem(nextSelected);
}

export function addItemAt(item: Item, parent: Item, position: number) {
    insertItemAt(parent, item, position);
    insertItemToDom(item);

    updateItem(item.parent);
    updateItem(item);
    selectItem(item);
}

export function renderApp(root: Item, selected: Item) {
    state.app.replaceChildren();
    state.root = root;
    state.selected = selected;

    state.app.appendChild(renderList(root));

    updateSelection(undefined, selected);
}
