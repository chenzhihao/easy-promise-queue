interface IPromiseQueueOpts {
    concurrency: number;
}
declare class PromiseQueue {
    private _queue;
    private _pause;
    private _ongoingCount;
    private _concurrency;
    constructor(opts: IPromiseQueueOpts);
    pause(): void;
    resume(): void;
    add(fn: () => Promise<any>): PromiseQueue | TypeError;
    readonly waitingCount: number;
    readonly ongoingCount: number;
    private _resolveEmpty;
    private _next;
}
export default PromiseQueue;
