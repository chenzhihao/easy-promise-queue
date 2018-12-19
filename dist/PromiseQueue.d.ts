interface IPromiseQueueOpts {
    concurrency: number;
}
declare type PromiseThunk = () => Promise<any>;
export default class PromiseQueue {
    private _queue;
    private _pause;
    private _ongoingCount;
    private _concurrency;
    constructor(opts: IPromiseQueueOpts);
    pause(): void;
    resume(): void;
    add(fn: PromiseThunk | PromiseThunk[]): PromiseQueue | TypeError;
    readonly waitingCount: number;
    readonly ongoingCount: number;
    private _resolveEmpty;
    private _next;
}
export {};
