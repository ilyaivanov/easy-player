type Props<T> = {
    id?: string;
    className?: string;
    classMap?: { [key: string]: boolean };
    children?: (DocumentFragment | HTMLElement | string | undefined | false)[];
    ref?: (elem: T) => void;
    onClick?: (this: HTMLElement, mouse: MouseEvent) => void;
    onInput?: (this: HTMLElement, ev: Event & { currentTarget: HTMLElement }) => void;
};

export const div = (props: Props<HTMLDivElement>) => assignHtmlElementProps(document.createElement("div"), props);

export const span = (props: Props<HTMLSpanElement>) => assignHtmlElementProps(document.createElement("span"), props);

export const img = (props: Props<HTMLImageElement> & { src?: string }) => {
    const res = assignHtmlElementProps(document.createElement("img"), props);

    if (props.src) res.src = props.src;
    return res;
};

export const fragment = (...children: HTMLElement[]) => {
    const res = document.createDocumentFragment();

    for (const child of children) res.appendChild(child);

    //ugly typecast, but I'm adding this as children to nodes, which might be wrong
    return res as unknown as HTMLElement;
};

function assignHtmlElementProps<T extends HTMLElement>(elem: T, props: Props<T>): T {
    if (props.id) elem.id = props.id;

    if (props.className) elem.className = props.className;

    if (props.classMap) {
        for (const classKey in props.classMap) {
            if (props.classMap[classKey]) elem.classList.add(classKey);
        }
    }

    if (props.children) {
        for (const child of props.children) {
            if (child) elem.append(child);
        }
    }

    if (props.onClick) elem.addEventListener("click", props.onClick);
    if (props.onInput) elem.addEventListener("input", props.onInput as any);

    if (props.ref) props.ref(elem);

    return elem;
}

export const insertAfter = (elem: HTMLElement, elemToInsert: HTMLElement) => {
    elem.insertAdjacentElement("afterend", elemToInsert);
};
