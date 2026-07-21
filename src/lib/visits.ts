const FREE_VISITED_KEY = "cle-lpc-free-visited-v1";

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
