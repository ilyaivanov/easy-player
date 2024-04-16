import { Item, insertItemAsLastChild, node } from "./tree";

const types: FilePickerAcceptType[] = [{ description: "Text files", accept: { "txt/*": [".txt"] } }];
export async function saveFile(root: Item) {
    try {
        const newHandle = await window.showSaveFilePicker({
            types,
            suggestedName: "items.txt",
        });
        const writableStream = await newHandle.createWritable();

        let res = "";
        const stack = [...root.children.reverse()];
        const levels = root.children.map(() => 0);
        while (stack.length != 0) {
            const item = stack.pop()!;
            const currentLevel = levels.pop()!;

            for (let i = 0; i < currentLevel * 2; i++) res += " ";
            res += `${item.title}\n`;

            if (item.children.length > 0) {
                stack.push(...item.children.reverse());
                levels.push(...item.children.map(() => currentLevel + 1));
            }
        }

        await writableStream.write(res);
        await writableStream.close();
    } catch (e) {
        if (e instanceof DOMException && e.name == "AbortError") return false;
        else throw e;
    }
}

export async function readFile(root: Item): Promise<boolean> {
    try {
        const [fileHandle] = await window.showOpenFilePicker({
            types,
            multiple: false,
        });
        const file = await fileHandle.getFile();
        const res = await file.text();

        root.children = [];
        const lines = res.split("\n");
        const stack = [{ item: root, level: -1 }];

        for (const line of lines) {
            let lineLevel = 0;
            while (line[lineLevel] == " ") lineLevel++;

            while (stack[stack.length - 1].level >= lineLevel) stack.pop();

            const { item: parent } = stack[stack.length - 1];
            const trimmed = line.trim();

            if (trimmed.length != 0) {
                const item = node(trimmed);
                stack.push({ item, level: lineLevel });

                parent.isOpen = true;
                insertItemAsLastChild(parent, item);
            }
        }

        return true;
    } catch (e: any) {
        if (e instanceof DOMException && e.name == "AbortError") return false;
        else throw e;
    }
}
