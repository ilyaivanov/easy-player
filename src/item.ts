export type Item = {
    title: string;
    children: Item[];
    type: "node";
    isOpen: boolean;
    parent: Item | undefined;
};

export function node(title: string, childs?: Item[]): Item {
    const children = childs || [];
    const item: Item = {
        title,
        children,
        type: "node",
        isOpen: children.length > 0,
        parent: undefined,
    };
    children.forEach((c) => (c.parent = item));
    return item;
}

export function getItemAbove(item: Item): Item | undefined {
    const index = item.parent!.children.indexOf(item);

    if (index > 0) {
        let prevItem = item.parent!.children[index - 1];
        if (prevItem.isOpen) {
            //looking for the most nested item
            while (prevItem.isOpen)
                prevItem = getChildAt(prevItem, prevItem.children.length - 1);
        }
        return prevItem;
    }

    if (item.parent?.parent) {
        return item.parent;
    }
}

function getItemIndex(item: Item) {
    if (item.parent) return item.parent.children.indexOf(item);
    return -1;
}

function getChildAt(parent: Item, index: number) {
    return parent.children[index];
}

export function isRoot(item: Item) {
    return !item.parent;
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
                parent &&
                !isRoot(parent) &&
                getItemIndex(parent) == parent.parent!.children.length - 1 &&
                parent.isOpen
            )
                parent = parent.parent;
            if (parent && parent.parent)
                return getChildAt(parent.parent, getItemIndex(parent) + 1);
        }
    }
}
