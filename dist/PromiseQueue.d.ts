interface PromiseQueueOpts {
    concurrency: number;
}
declare class PromiseQueue {
    private _queue;
    private _pause;
    private _ongoingCount;
    private _concurrency;
    private _resolveEmpty;
    constructor(opts: PromiseQueueOpts);
    _next(): void;
    pause(): void;
    resume(): void;
    add(fn: any): any;
    readonly waitingCount: number;
    readonly ongoingCount: number;
}
export default PromiseQueue;
