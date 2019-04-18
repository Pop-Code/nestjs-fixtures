export type FixtureWorker = (fixture: FixtureCollection) => any | Promise<any>;

export interface FixtureCollection {
    type: any;
    data: any[];
}
