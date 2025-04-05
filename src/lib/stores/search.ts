import { writable, type Writable } from "svelte/store";

export const searchText: Writable<string> = writable("");
export const excludeSource: Writable<string[]> = writable([]);
