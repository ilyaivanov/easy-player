const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute("viewBox", "0 0 512 512");

svg.classList.add("chevron");

const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
path.setAttribute(
  "d",
  "M244.7 116.7c6.2-6.2 16.4-6.2 22.6 0l192 192c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0L256 150.6 75.3 331.3c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l192-192z"
);

svg.appendChild(path);

export const chevronIcon = () => svg.cloneNode(true) as HTMLElement;
