export type Item = {
    title: string;
    children: Item[];
    type: "node";
    isOpen: boolean;
    parent: Item;
};

export function node(title: string, childs?: Item[]): Item {
    const children = childs || [];
    const item: Item = {
        title,
        children,
        type: "node",
        isOpen: children.length > 0,
        parent: undefined as unknown as Item,
    };
    item.parent = item;
    children.forEach((c) => (c.parent = item));
    return item;
}

export function getItemAbove(item: Item): Item | undefined {
    const index = item.parent.children.indexOf(item);

    if (index > 0) {
        let prevItem = item.parent.children[index - 1];
        if (prevItem.isOpen) {
            //looking for the most nested item
            while (prevItem.isOpen)
                prevItem = getChildAt(prevItem, prevItem.children.length - 1);
        }
        return prevItem;
    }

    if (!isRoot(item.parent)) {
        return item.parent;
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
            if (parent && parent.parent)
                return getChildAt(parent.parent, getItemIndex(parent) + 1);
        }
    }
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
    itemParent.children.splice(itemParent.children.length, 0, itemToInsert);
    itemToInsert.parent = itemParent;
}
export function insertItemAt(parent: Item, child: Item, index: number) {
    parent.children.splice(index, 0, child);
    child.parent = parent;
}

export function createEmptyItem(): Item {
    return {
        title: "",
        children: [],
        isOpen: false,
        parent: undefined as unknown as Item,
        type: "node",
    };
}

export function getItemToSelectAfterRemoval(selected: Item) {
    const index = getItemIndex(selected);
    if (index != 0) return selected.parent.children[index - 1];
    else if (selected.parent.children.length > 1)
        return selected.parent.children[index + 1];
    else {
        return selected.parent;
    }
}
