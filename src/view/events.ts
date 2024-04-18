import { Item } from "../tree";

export type ItemEvent = { detail: Item };

export type EventType = "toggle-item" | "video-progress" | "video-ended" | "item-focus";

export const addCustomEventListener = (name: EventType, cb: (ev: ItemEvent) => void) =>
    document.addEventListener(name, cb as any);

export const dispatchCustomEvent = (name: EventType, item: Item) =>
    document.dispatchEvent(new CustomEvent(name, { detail: item }));

export const dispatchCustomEventEmpty = (name: EventType) =>
    document.dispatchEvent(new CustomEvent(name));
