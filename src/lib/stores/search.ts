import { writable, type Writable } from 'svelte/store'

export const searchText: Writable<string> = writable('')

export const sources: string[] = [
  'homemanager',
  'nur',
  'nixos',
  'nixpkgs',
  'darwin',
]

function localStorageStore<T>(key: string, initial: T): Writable<T> {
  let data = initial
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(key)
    data = stored ? JSON.parse(stored) : initial
  }
  const store = writable<T>(data)
  if (typeof window !== 'undefined') {
    store.subscribe((value: T) =>
      localStorage.setItem(key, JSON.stringify(value)),
    )
  }
  return store
}
export const expertMode = localStorageStore<boolean>('expertMode', false)
