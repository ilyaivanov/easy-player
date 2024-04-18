export type Item = {
    title: string;
    children: Item[];
    type: "node" | "video";
    parent: Item;
    videoId?: string;
    isOpen: boolean | undefined;
    isDone: boolean;
};

export function node(title: string, childs?: Item[]): Item {
    const children = childs || [];
    const item: Item = {
        title,
        children,
        type: "node",
        isOpen: undefined,
        parent: undefined as unknown as Item,
        isDone: false,
    };
    item.parent = item;
    children.forEach((c) => (c.parent = item));
    return item;
}

export function video(title: string, id: string): Item {
    let i = node(title);
    i.type = "video";
    i.videoId = id;
    return i;
}

export function getItemAbove(item: Item): Item | undefined {
    const index = item.parent.children.indexOf(item);

    if (index > 0) {
        let prevItem = item.parent.children[index - 1];
        if (prevItem.isOpen) {
            //looking for the most nested item
            while (prevItem.isOpen) prevItem = getChildAt(prevItem, prevItem.children.length - 1);
        }
        return prevItem;
    }

    if (!isRoot(item.parent)) {
        return item.parent;
    }
}

export function getNextSibling(item: Item) {
    const index = item.parent.children.indexOf(item);
    if (index < item.parent.children.length - 1) return item.parent.children[index + 1];
}

export function getPrevSibling(item: Item) {
    const index = item.parent.children.indexOf(item);
    if (index > 0) return item.parent.children[index - 1];
}

export function getItemBelow(item: Item): Item | undefined {
    if (item.isOpen) return item.children[0];
    else {
        let parent = item.parent;
        let itemIndex = getItemIndex(item);
        if (parent && itemIndex < parent.children.length - 1) {
            return getChildAt(parent, itemIndex + 1);
        } else {
            while (
                !isRoot(parent) &&
                getItemIndex(parent) == parent.parent.children.length - 1 &&
                parent.isOpen
            )
                parent = parent.parent;
            if (parent && !isRoot(parent))
                return getChildAt(parent.parent, getItemIndex(parent) + 1);
        }
    }
}

export function getItemIndex(item: Item) {
    return item.parent.children.indexOf(item);
}

export function getChildAt(parent: Item, index: number) {
    return parent.children[index];
}

export function isRoot(item: Item) {
    return item.parent == item;
}

export function removeItemFromTree(item: Item) {
    item.parent.children.splice(getItemIndex(item), 1);
    if (item.parent.children.length == 0) item.parent.isOpen = false;
}

export function insertItemAfter(itemAfter: Item, itemToInsert: Item) {
    const index = getItemIndex(itemAfter);
    itemAfter.parent.children.splice(index + 1, 0, itemToInsert);
    itemToInsert.parent = itemAfter.parent;
}

export function insertItemBefore(itemAfter: Item, itemToInsert: Item) {
    const index = getItemIndex(itemAfter);
    itemAfter.parent.children.splice(index, 0, itemToInsert);
    itemToInsert.parent = itemAfter.parent;
}

export function insertItemAsFirstChild(itemParent: Item, itemToInsert: Item) {
    itemParent.children.splice(0, 0, itemToInsert);
    itemToInsert.parent = itemParent;
}
export function insertItemAsLastChild(itemParent: Item, itemToInsert: Item) {
    itemParent.children.push(itemToInsert);
    itemToInsert.parent = itemParent;
}
export function insertItemAt(parent: Item, child: Item, index: number) {
    parent.children.splice(index, 0, child);
    parent.isOpen = true;
    child.parent = parent;
}

export function createEmptyRoot(): Item {
    const item = node("Home");
    item.parent = item;
    return item;
}

export function getItemToSelectAfterRemoval(selected: Item) {
    const index = getItemIndex(selected);
    if (index != 0) return selected.parent.children[index - 1];
    else if (selected.parent.children.length > 1) return selected.parent.children[index + 1];
    else {
        return selected.parent;
    }
}

export function isSameOrChildOf(parent: Item, child: Item) {
    let p = child;
    while (!isRoot(p)) {
        if (p == parent) return true;
        p = p.parent;
    }

    return p == parent;
}
