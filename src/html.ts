type Props = {
  className?: string;
  children?: (HTMLElement | string)[];
  onClick?: (this: HTMLDivElement, mouse: MouseEvent) => void;
};

export const div = (props: Props): HTMLDivElement => {
  const res = document.createElement("div");
  if (props.className) res.className = props.className;

  if (props.children) {
    for (const child of props.children) {
      res.append(child);
    }
  }

  if (props.onClick) res.addEventListener("click", props.onClick);
  return res;
};
