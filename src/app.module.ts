import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SubtaskModule } from './subtask/subtask.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/tasks'),
    TasksModule,
    SubtaskModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
