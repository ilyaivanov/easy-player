import { div } from "./html";
import { chevronIcon } from "./icons";
import { items } from "./data";

import "./entry.css";

const list = div({
  className: "list",
  children: items.map((item) =>
    div({
      className: "item",
      children: [
        div({
          className: "chevron-container",
          children: [chevronIcon()],
          onClick: (ev) => {
            (ev.currentTarget as HTMLElement).classList.toggle("open");
          },
        }),
        div({ className: "square" }),
        item,
      ],
    })
  ),
});

document.body.appendChild(list);
