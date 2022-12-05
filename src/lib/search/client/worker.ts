import type { SearchResult } from '../types';
import { init, isInited, isInitInProgess, search } from './search';

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

// MessagePort with typed messages
interface Port<TOnMsg,TPostMsg> extends EventTarget {
    onmessage: ((this: Port<TOnMsg, TPostMsg>, ev: MessageEvent<TOnMsg>) => unknown) | null;
    onmessageerror: ((this: MessagePort, ev: MessageEvent) => unknown) | null;
    close(): void;
    postMessage(message: TPostMsg, transfer: Transferable[]): void;
    postMessage(message: TPostMsg, options?: StructuredSerializeOptions): void;
    start(): void;
    addEventListener<K extends keyof MessagePortEventMap>(type: K, listener: (this: MessagePort, ev: MessagePortEventMap[K]) => unknown, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof MessagePortEventMap>(type: K, listener: (this: MessagePort, ev: MessagePortEventMap[K]) => unknown, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

// MessageEvent with typed messages
interface OnConnectMessageEvent extends Event {
    readonly data: never;
    readonly lastEventId: string;
    readonly origin: string;
    readonly source: MessageEventSource | null;
    readonly ports: ReadonlyArray<Port<RequestMessage, ResponseMessage>>;
    /** @deprecated */
    initMessageEvent(type: string, bubbles?: boolean, cancelable?: boolean, data?: unknown, origin?: string, lastEventId?: string, source?: MessageEventSource | null, ports?: MessagePort[]): void;
}

export type RequestWorker = {
    port: Port<ResponseMessage, RequestMessage>,
};

type ResponseWorker = {
    onconnect: ((this: SharedWorkerGlobalScope, ev: OnConnectMessageEvent) => unknown) | null;
}

const worker : ResponseWorker = self as SharedWorkerGlobalScope;
worker.onconnect = handleConnect;

function handleConnect(this: SharedWorkerGlobalScope, e: OnConnectMessageEvent) {
    e.ports[0].onmessage = handleMessage;
}

let portsWaitingOnInit : Port<RequestMessage, ResponseMessage>[] = [];

async function handleMessage(this: Port<RequestMessage, ResponseMessage>, request: MessageEvent<RequestMessage>) {
    const msg = request.data;

    switch (msg.type) {
        case "init": {
            if (isInited) {
                this.postMessage({ type: 'ready' });
                break;
            }

            portsWaitingOnInit.push(this);

            if (isInitInProgess) {
                break;
            }

            await init(msg.origin);

            for(const port of portsWaitingOnInit) {
                port.postMessage({ type: 'ready' });
            }

            portsWaitingOnInit = [];


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