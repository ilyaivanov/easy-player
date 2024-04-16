import { selected } from "./entry";
import { Item } from "./tree";
import { views } from "./views";

const WAIT_TIME = 200;
function animateBg(item: Item, color: string) {
    views.get(selected)!.item.animate([{ backgroundColor: "transparent" }, { backgroundColor: color }], {
        duration: Math.min(WAIT_TIME / 2, 200),
        direction: "alternate",
        iterations: 2,
    });
}

const itemChecked = (item: Item) => animateBg(item, "green");
const itemError = (item: Item) => animateBg(item, "red");

function fail(msg: string) {
    console.error(msg);
    console.trace();
}

function test(title: string) {}

const sleep = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function expectSelectedItem(title: string) {
    if (selected.title != title) {
        fail(`Expected selected item to be '${title}' but it was '${selected.title}'`);
        itemError(selected);
    } else itemChecked(selected);
}

function expectItemToBeInDom(item: Item) {
    if (!views.get(item)!.container.isConnected) {
        fail(`Expected item '${item.title}' to be inside the DOM`);
    } else itemChecked(item);
}
function expectItemNotToBeInDom(item: Item) {
    if (views.get(item)!.container.isConnected) {
        fail(`Expected item '${item.title}' to be inside the DOM`);
        itemError(selected);
    }
}

const dispatchKey = (code: string) => async () => {
    await sleep(WAIT_TIME);
    const event = new KeyboardEvent("keydown", { code });
    document.dispatchEvent(event);
};

const key = {
    moveDown: dispatchKey("KeyJ"),
    moveUp: dispatchKey("KeyK"),
    moveRight: dispatchKey("KeyL"),
    moveLeft: dispatchKey("KeyH"),
};

//Music
//  Electro
//  Piano
//  Ambient
//    Carbon Based Lifeforms
//    Sync24
//    James Murray
//Software Development
//Channels
//Four

document.addEventListener("DOMContentLoaded", async () => {
    expectSelectedItem("Music");

    await key.moveDown();
    expectSelectedItem("Electro");

    await key.moveDown();
    expectSelectedItem("Piano");

    await key.moveDown();
    expectSelectedItem("Ambient");

    test("Checking closing and opening item");
    expectItemToBeInDom(selected.children[0]);
    await key.moveLeft();
    expectItemNotToBeInDom(selected.children[0]);
    await key.moveRight();
    expectItemToBeInDom(selected.children[0]);
});
