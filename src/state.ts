import { Item } from "./tree";

export type State = {
    root: Item;
    selected: Item;
    itemPlayed: Item | undefined;
    isPlaying: boolean;
    isEditingNewlyCreated: boolean;
    mode: "Normal" | "Insert";
    app: HTMLElement;
};

export const state: State = {
    mode: "Normal",
    root: undefined as unknown as Item,
    selected: undefined as unknown as Item,

    itemPlayed: undefined as unknown as Item,
    isPlaying: false,

    app: undefined as unknown as HTMLElement,
    isEditingNewlyCreated: false,
};

(document as any).state = state;
