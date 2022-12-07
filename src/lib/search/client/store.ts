import { writable } from 'svelte/store';
import { browser } from '$app/env';

import SearchWorker from './worker?worker';
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


    // only clientside in browsers which support WebWorkers
    if (browser && window.Worker) {
        worker = new SearchWorker();

        worker.onmessage = (response) => {
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

        worker.postMessage({
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
            worker?.postMessage({ type: 'search-request', query })
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