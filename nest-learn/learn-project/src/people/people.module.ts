import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PeopleController } from './people.controller';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  controllers: [PeopleController],
  providers: [PeopleService],
})


export class PeopleModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('people');
  }
}
