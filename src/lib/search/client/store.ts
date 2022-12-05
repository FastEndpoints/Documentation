import { writable } from 'svelte/store';
import { browser } from '$app/env';

import SearchSharedWorker from './worker?sharedworker';
import type { RequestWorker } from './worker';
import type { SearchResult } from '../types';

type SearchState = {
    query: string;
    results: SearchResult[];
    isOpen: boolean;
}

const searchStore = createSearchStore();

function createSearchStore() {
    let worker : RequestWorker | null = null

    if (browser) {
        worker = new SearchSharedWorker();

        worker.port.onmessage = (response) => {
            const msg = response.data;
            switch(msg.type) {
                case "ready":
                    break;
                case "search-response":
                    update(state => ({
                        ...state,
                        results: msg.results
                    }));
                    break;
            }
        };

        worker.port.postMessage({
            type: "init",
            origin: location.origin
        });
    }



    const { subscribe, update } = writable<SearchState>({
        query: '',
        results: [],
        isOpen: false
    });

    return {
        subscribe,
        search: (query: string) => {
            update(state => ({ ...state, query }));
            worker?.port.postMessage({ type: 'search-request', query })
        },
        toggleOpen: () => {
            update(state => ({ ...state, isOpen: !state.isOpen}));
        },
        open: () => {
            update(state => ({...state, isOpen: true }))
        },
        close: () => {
            update(state => ({...state, isOpen: false, query: '' }))
        }
    }
}

export default searchStore;