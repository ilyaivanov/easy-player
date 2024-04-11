import {
    cblReleases,
    sync24Releases,
    jamesMurrayReleaes,
} from "./musicBrainzReleaseGroups";

function formatChildren(parentItem: Item) {
    const types = new Map<string, Item[]>();

    const releases: any = {
        "8229a8f1-b315-4fae-af57-b3eb71efdaf4": cblReleases,
        "ad614ebb-c487-4695-93c8-7877455d58cf": sync24Releases,
        "31e9fbb4-ed16-4017-bd25-be9b7268d391": jamesMurrayReleaes,
    };

    for (let item of (releases[parentItem.mbid!] as any)["release-groups"]) {
        let mapped: Item = {
            title: item.title,
            mbid: item.id,
            type: "album",
            date: +item["first-release-date"].substring(0, 4),
            children: [],
        };

        let primaryType = item["primary-type"];
        let secondaryType = item["secondary-types"][0];
        const key = secondaryType
            ? `${primaryType} + ${secondaryType}`
            : primaryType;

        if (types.has(key)) types.get(key)!.push(mapped);
        else types.set(key, [mapped]);
    }

    const res: Item[] = [];

    if (types.has("Album"))
        res.push({
            mbid: "",
            title: "Album",
            type: "node",
            children: types.get("Album")!.sort((a, b) => a.date! - b.date!),
        });

    types.delete("Album");

    for (let type of types.keys()) {
        const typeItems = types.get(type)!.sort((a, b) => a.date! - b.date!);

        res.push({
            mbid: "",
            title: type,
            type: "node",
            children: typeItems,
        });
    }

    return res;
}

export async function getChildren(item: Item): Promise<Item[]> {
    return Promise.resolve(formatChildren(item));

    if (item.mbid) {
        //TODO handles paging
        const url = `https://musicbrainz.org/ws/2/release?artist=${item.mbid}&fmt=json&type=album&status=official&inc=release-groups`;
        console.log("Making request to musicbraincs.org", url);
        const response = await fetch(url);
        const json = await response.json();
        return json.releases.map((r: any) => ({}));
    }
    return [];
}
