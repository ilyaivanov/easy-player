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

const playPath = "M384 256L0 32V480L384 256z";

const playSvg = svgWithPath("play-icon", "0 0 384 512", playPath);
export const playIcon = () => playSvg.cloneNode(true) as HTMLElement;

const pausePath = "M128 64H0V448H128V64zm192 0H192V448H320V64z";

const pauseSvg = svgWithPath("play-icon", "0 0 320 512", pausePath);
export const pauseIcon = () => pauseSvg.cloneNode(true) as HTMLElement;

// ▲›✓⏸
