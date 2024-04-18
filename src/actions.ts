import { state } from "./state";
import {
    Item,
    isRoot,
    removeItemFromTree,
    getItemToSelectAfterRemoval,
    insertItemAt,
    getItemIndex,
} from "./tree";
import { updateItemPlaying } from "./view/footer";
import {
    insertChildren,
    insertItemToDom,
    itemStartedPlaying,
    itemStoppedPlaying,
    removeChildren,
    removeItemFromDom,
    renderList,
    updateItem,
    updateSelection,
} from "./view/views";
import { pause, play, resume } from "./youtubePlayer";

//
// the main idea of this file is to sync tree and dom
//

export function selectItem(item: Item | undefined) {
    if (!item) return;

    const parents = [];
    let parent = item.parent;
    while (!isRoot(parent)) {
        parents.push(parent);
        parent = parent.parent;
    }

    for (const p of parents.reverse()) {
        if (!p.isOpen) openItem(p);
    }

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
    selectItem(item);
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
    const wasParentOpen = parent.isOpen;
    insertItemAt(parent, item, position);
    if (wasParentOpen) insertItemToDom(item);
    else openItem(parent);

    updateItem(item.parent);
    updateItem(item);
    selectItem(item);
}

export function playItem(item: Item) {
    if (state.itemPlayed != item) {
        if (state.itemPlayed) itemStoppedPlaying(state.itemPlayed);

        state.itemPlayed = item;

        if (item.videoId) play(item.videoId);
        state.isPlaying = true;
        itemStartedPlaying(item);
        updateItemPlaying(item);
    }
}

export function playNextItem() {
    if (state.itemPlayed) {
        const index = getItemIndex(state.itemPlayed);
        if (index < state.itemPlayed.parent.children.length - 1)
            playItem(state.itemPlayed.parent.children[index + 1]);
    }
}
export function playPrevItem() {
    if (state.itemPlayed) {
        const index = getItemIndex(state.itemPlayed);
        if (index > 0) playItem(state.itemPlayed.parent.children[index - 1]);
    }
}
export function togglePausePlay() {
    if (!state.itemPlayed) return;
    if (state.isPlaying) {
        state.isPlaying = false;
        pause();
        itemStoppedPlaying(state.itemPlayed);
    } else {
        state.isPlaying = true;
        resume();
        itemStartedPlaying(state.itemPlayed);
    }
}

export function toggleIsDone(item: Item) {
    item.isDone = !item.isDone;
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
