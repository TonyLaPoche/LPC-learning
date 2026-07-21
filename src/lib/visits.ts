const FREE_VISITED_KEY = "cle-lpc-free-visited-v1";
const CUSTOM_VISITED_KEY = "cle-lpc-custom-visited-v1";

export function loadFreeVisited(): boolean {
  try {
    return localStorage.getItem(FREE_VISITED_KEY) === "1";
  } catch {
    return false;
  }
}

export function markFreeVisited() {
  try {
    localStorage.setItem(FREE_VISITED_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function loadCustomVisited(): boolean {
  try {
    return localStorage.getItem(CUSTOM_VISITED_KEY) === "1";
  } catch {
    return false;
  }
}

export function markCustomVisited() {
  try {
    localStorage.setItem(CUSTOM_VISITED_KEY, "1");
  } catch {
    /* ignore */
  }
}
