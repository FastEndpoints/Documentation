/// <reference lib="webworker" />
import type { SearchResult } from '../types';
import { init, isInited, search } from './search';

type InitRequest = {
    type: 'init';
    origin: string;
};

type SearchRequest = {
    type: 'search-request';
    query: string;
}

type ReadyResponse = {
    type: 'ready',
}

type SearchResponse = {
    type: 'search-response';
    results: SearchResult[];
}

type RequestMessage = InitRequest | SearchRequest;
type ResponseMessage = ReadyResponse | SearchResponse;

export interface RequestWorker extends Worker {
    onmessage: ((this: RequestWorker, ev: MessageEvent<ResponseMessage>) => unknown) | null;
    postMessage(message: RequestMessage) : void;
}

interface ResponseWorker extends DedicatedWorkerGlobalScope {
    onmessage: ((this: ResponseWorker, ev: MessageEvent<RequestMessage>) => unknown) | null;
    postMessage(message: ResponseMessage) : void;
}


const worker : ResponseWorker = self as unknown as ResponseWorker;

worker.onmessage = async function(request) {
    const msg = request.data;

    switch (msg.type) {
        case "init": {
            if (isInited) {
                this.postMessage({ type: 'ready' });
                break;
            }

            await init(msg.origin);
            this.postMessage({ type: 'ready' });

            break;
        }
        case 'search-request': {
            const results = search(msg.query);

            this.postMessage({ type: 'search-response', results })
            break;
        }
    }
}

// force TS to treat this file as a module
export default null;