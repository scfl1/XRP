type Listener = (code: string) => void;

let currentNetwork = "TRC20";
const listeners = new Set<Listener>();

export function getSelectedNetwork(): string {
  return currentNetwork;
}

export function setSelectedNetwork(code: string) {
  currentNetwork = code;
  listeners.forEach((l) => l(code));
}

export function subscribeNetwork(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
