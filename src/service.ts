import { Injectable } from '@nestjs/common';
import { FixtureCollection, FixtureWorker } from './interfaces';
import { ConsoleService, Command } from 'nestjs-console';
import { CommanderStatic } from 'commander';

@Injectable()
export class FixturesService {
    private readonly collections: Map<string, FixtureCollection> = new Map();
    private readonly workers: Map<string, FixtureWorker> = new Map();
    private program: Command;
    private loader: any;

    constructor(private readonly consoleService: ConsoleService) {
        this.registerCli();
        this.loader = ConsoleService.createSpinner();
    }

    private registerCli() {
        const cli = this.consoleService.getCli();
        this.program = this.consoleService.subCommands(
            cli,
            'fixtures',
            'Manage the data fixtures'
        );

        this.program
            .command('insert')
            .description('Insert fixtures')
            .option('-e, --entities <items>', 'A list of entities to load', v =>
                v
                    .trim()
                    .split(',')
                    .map((d: string) => d.trim())
            )
            .option('-a, --all', 'Insert all entities and ignore --entities')
            .action(async options => {
                this.loader.start('Preparing fixtures...');
                try {
                    if (this.collections.size === 0) {
                        this.loader.fail('No registerd fixtures.');
                        return;
                    }
                    const fixturesToLoad = options.all
                        ? Array.from(this.collections.keys())
                        : options.entities;
                    await this.insertFixtures(fixturesToLoad);
                } catch (e) {
                    this.loader.fail(e.message);
                }
                this.loader.stop();
                process.exit();
            });

        this.program
            .command('list')
            .description('List the registered fixtrues')
            .action(async () => {
                this.logData(Array.from(this.collections.keys()));
                process.exit();
            });
    }

    private logData(data: any) {
        process.stdout.write(JSON.stringify(data));
        return this;
    }

    async insertFixture(name: string) {
        if (!this.collections.has(name)) {
            throw new Error(`No ${name} fixtures found`);
        }
        if (!this.workers.has(name)) {
            throw new Error(`No ${name} worker found`);
        }
        this.loader.text = `Inserting fixtures named ${name}`;
        const collection = this.collections.get(name);
        const worker = this.workers.get(name);

        return await worker(collection);
    }

    async insertFixtures(names: string[]) {
        const results = [];
        for (const name of names) {
            try {
                results.push({
                    name,
                    result: await this.insertFixture(name)
                });
            } catch (e) {
                results.push({ name, error: e });
            }
        }

        results.map(r =>
            r.error
                ? this.loader.fail(`${r.name} => ${r.error.message}`)
                : this.loader.succeed(
                      `${r.name}fixtures were inserted with success`
                  )
        );

        return results;
    }

    setFixture(
        name: string,
        collection: FixtureCollection,
        worker: FixtureWorker
    ): FixturesService {
        this.collections.set(name, collection);
        this.workers.set(name, worker);
        return this;
    }

    deleteFixture(name: string): FixturesService {
        this.collections.delete(name);
        this.workers.delete(name);
        return this;
    }

    hasCollection(name: string): boolean {
        return this.collections.has(name);
    }

    getCollection(name: string): FixtureCollection {
        return this.collections.get(name);
    }

    hasWorker(name: string): boolean {
        return this.workers.has(name);
    }

    getWorker(name: string): FixtureWorker {
        return this.workers.get(name);
    }
}
