/**
 * Global queue for the app's styled alert/confirm dialogs (see
 * components/alert-host.tsx + components/cwaax-ui.tsx's ConfirmModal).
 * notify()/confirmAsync() in native-alert.ts push requests here instead
 * of calling window.alert/window.confirm or Alert.alert, so every part
 * of the app gets the same nicely designed card with zero call-site
 * changes. Follows the same simple pub-sub pattern as network-store.ts.
 */

export type AlertRequest = {
  id: number;
  title: string;
  message?: string;
  confirmLabel: string;
  cancelLabel?: string; // present => two-button confirm dialog
  danger?: boolean;
  resolve: (value: boolean) => void;
};

type Listener = () => void;

let current: AlertRequest | null = null;
const queue: AlertRequest[] = [];
const listeners = new Set<Listener>();
let nextId = 1;

function emit() {
  listeners.forEach((l) => l());
}

function pump() {
  if (!current && queue.length) {
    current = queue.shift()!;
    emit();
  }
}

export function getCurrentAlert(): AlertRequest | null {
  return current;
}

export function subscribeAlert(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function pushAlert(req: {
  title: string;
  message?: string;
  confirmLabel: string;
  cancelLabel?: string;
  danger?: boolean;
}): Promise<boolean> {
  return new Promise((resolve) => {
    queue.push({ ...req, id: nextId++, resolve });
    pump();
  });
}

export function resolveCurrentAlert(value: boolean) {
  if (!current) return;
  const { resolve } = current;
  current = null;
  emit();
  resolve(value);
  pump();
}
