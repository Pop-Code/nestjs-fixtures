import { Module } from '@nestjs/common';
import { FixturesService } from './service';
import { ConsoleModule } from 'nestjs-console';

@Module({
    imports: [ConsoleModule],
    providers: [FixturesService],
    exports: [FixturesService]
})
export class FixturesModule {}
