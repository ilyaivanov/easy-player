import { Item, getItemAbove, getItemBelow, isRoot, getItemIndex, node, createEmptyItem } from "./tree";
import { emptyText, getItemTitle, startEdit, stopEdit } from "./view/views";
import { state } from "./state";
import { closeItem, openItem, renderApp, selectItem } from "./actions";
import { addChange, redoLastChange, undoLastChange } from "./undo";
import "./entry.css";
import { readFile, saveFile } from "./saveLoad";

// Uncommend to enable E2E tests (currently very minimal)
// import "./tests";

// gather info to dispatch change or directly call actions

function moveSelected(newParent: Item, newIndex: number) {
    addChange({
        type: "move",
        item: state.selected,
        oldParent: state.selected.parent,
        oldIndex: getItemIndex(state.selected),
        newParent,
        newIndex,
    });
}

function moveSelectedDown() {
    const { selected } = state;
    const index = getItemIndex(selected);
    if (index < selected.parent.children.length - 1) moveSelected(selected.parent, index + 1);
}

function moveSelectedUp() {
    const { selected } = state;
    const index = getItemIndex(selected);
    if (index > 0) moveSelected(selected.parent, index - 1);
}

function moveSelectedLeft() {
    const { selected } = state;
    if (!isRoot(selected.parent)) {
        const oldParent = selected.parent;
        moveSelected(oldParent.parent, getItemIndex(oldParent) + 1);
    }
}

function moveSelectedRight() {
    const { selected } = state;
    const index = getItemIndex(selected);
    if (index > 0) {
        const prev = selected.parent.children[index - 1];

        if (prev) {
            if (!prev.isOpen) openItem(prev);
            moveSelected(prev, prev.children.length);
        }
    }
}

function startEditSelectedItem() {
    state.mode = "Insert";
    startEdit(state.selected);
}

function stopEditSelectedItem() {
    state.mode = "Normal";
    if (state.isEditingNewlyCreated) {
        state.selected.title = getItemTitle(state.selected);
        state.isEditingNewlyCreated = false;
    } else {
        addChange({
            type: "rename",
            item: state.selected,
            oldName: state.selected.title,
            newName: getItemTitle(state.selected),
        });
    }

    stopEdit(state.selected);
}

document.addEventListener("keydown", async (e) => {
    if (state.mode == "Insert" && (e.code == "Enter" || e.code == "Escape")) {
        stopEditSelectedItem();
        return;
    }
    if (state.mode == "Insert") {
        return;
    }

    const { selected } = state;

    if (e.code == "KeyH") {
        if (e.altKey) moveSelectedLeft();
        else if (selected.isOpen) closeItem(selected);
        else if (selected.parent && !isRoot(selected.parent)) selectItem(selected.parent);
    } else if (e.code == "KeyJ") {
        if (e.altKey) moveSelectedDown();
        else selectItem(getItemBelow(selected));
    } else if (e.code == "KeyK") {
        if (e.altKey) moveSelectedUp();
        else selectItem(getItemAbove(selected));
    } else if (e.code == "KeyL") {
        if (e.altKey) moveSelectedRight();
        else if (selected.isOpen && selected.children.length > 0) selectItem(selected.children[0]);
        else if (!selected.isOpen && selected.children.length > 0) openItem(selected);
    } else if (e.code == "KeyU") {
        if (e.shiftKey) redoLastChange();
        else undoLastChange();
    } else if (e.code == "KeyD") {
        addChange({ type: "remove", item: state.selected, position: getItemIndex(state.selected) });
    } else if (e.code == "KeyS" && e.ctrlKey) {
        saveFile(state.root);
        e.preventDefault();
    } else if (e.code == "KeyE" && e.ctrlKey) {
        e.preventDefault();
        const newRoot = await readFile();
        if (newRoot) {
            addChange({
                type: "loaded",
                newRoot,
                newSelected: newRoot.children[0],
                oldRoot: state.root,
                oldSelected: state.selected,
            });
        }
    } else if (e.code == "KeyO") {
        const currentIndex = getItemIndex(selected);

        let position = 0;
        let parent = selected.parent;

        if (e.shiftKey) {
            position = currentIndex;
        } else if (e.ctrlKey) {
            parent = selected;
            position = 0;
        } else {
            position = currentIndex + 1;
        }

        addChange({ type: "add", item: createEmptyItem(), parent, position });
        state.isEditingNewlyCreated = true;
        startEditSelectedItem();
        e.preventDefault();
    } else if (e.code == "KeyI") {
        startEditSelectedItem();
        e.preventDefault();
    } else if (e.code == "KeyR" && !e.ctrlKey) {
        emptyText(selected);
        startEditSelectedItem();
        e.preventDefault();
    }
});

document.addEventListener("toggle-item", (e) => {
    const item = (e as CustomEvent).detail as Item;
    if (item.isOpen) closeItem(item);
    else openItem(item);
});

const initialRoot = node("Root", [
    node("Music", [
        node("Electro"),
        node("Piano"),
        node("Ambient", [node("Carbon Based Lifeforms"), node("Sync24"), node("James Murray")]),
    ]),
    node("Software Development"),
    node("Channels"),
    node("Four"),
]);

state.app = document.createElement("div");
document.body.appendChild(state.app);

renderApp(initialRoot, initialRoot.children[0]);
