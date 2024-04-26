function svgWithPath(className: string, viewBox: string, pathS: string) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", viewBox);

    svg.classList.add(className);

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathS);
    svg.appendChild(path);
    return svg;
}

const chevronPath =
    "M244.7 116.7c6.2-6.2 16.4-6.2 22.6 0l192 192c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0L256 150.6 75.3 331.3c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l192-192z";
const chevronSvg = svgWithPath("chevron", "0 0 512 512", chevronPath);
export const chevronIcon = () => chevronSvg.cloneNode(true) as HTMLElement;

//
//
//

const playSvg = svgWithPath("item-icon", "0 0 384 512", "M384 256L0 32V480L384 256z");
export const playIcon = () => playSvg.cloneNode(true) as HTMLElement;

const pauseSvg = svgWithPath(
    "item-icon",
    "0 0 320 512",
    "M128 64H0V448H128V64zm192 0H192V448H320V64z"
);
export const pauseIcon = () => pauseSvg.cloneNode(true) as HTMLElement;

const profileSvg = svgWithPath(
    "item-icon",
    "0 0 448 512",
    "M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"
);
export const profileIcon = () => profileSvg.cloneNode(true) as HTMLElement;

const playlistSvg = svgWithPath(
    "item-icon",
    "0 0 320 512",
    "M64 288h96c53 0 96-43 96-96s-43-96-96-96H64V288zM0 352V320 288 96 64 32H32 64h96c88.4 0 160 71.6 160 160s-71.6 160-160 160H64v96 32H0V448 352z"
);
export const playlistIcon = () => playlistSvg.cloneNode(true) as HTMLElement;

// ▲›✓⏸
