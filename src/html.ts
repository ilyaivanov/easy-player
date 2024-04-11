type Props = {
    className?: string;
    classMap?: { [key: string]: boolean };
    children?: (DocumentFragment | HTMLElement | string | undefined)[];
    onClick?: (this: HTMLElement, mouse: MouseEvent) => void;
    onInput?: (this: HTMLElement, ev: Event) => void;

    afterCreation?: ((elem: HTMLElement) => void)[];
};

export const div = (props: Props) =>
    assignHtmlElementProps(document.createElement("div"), props);

export const span = (props: Props) =>
    assignHtmlElementProps(document.createElement("span"), props);

export const fragment = (...children: HTMLElement[]) => {
    const res = document.createDocumentFragment();

    for (const child of children) res.appendChild(child);

    //ugly typecast, but I'm adding this as children to nodes, which might be wrong
    return res as unknown as HTMLElement;
};

function assignHtmlElementProps<T extends HTMLElement>(
    elem: T,
    props: Props
): T {
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
    if (props.onInput) elem.addEventListener("input", props.onInput);

    if (props.afterCreation) for (const fn of props.afterCreation) fn(elem);

    return elem;
}

export const insertAfter = (elem: HTMLElement, elemToInsert: HTMLElement) =>
    elem.insertAdjacentElement("afterend", elemToInsert);
