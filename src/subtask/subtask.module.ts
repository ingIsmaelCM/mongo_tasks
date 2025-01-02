import { Module } from '@nestjs/common';
import { SubtaskController } from './subtask.controller';
import { SubtaskService } from './subtask.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SubtaskSchema } from 'src/schemas/subtask.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: 'Subtask', schema: SubtaskSchema}])],
  controllers: [SubtaskController],
  providers: [SubtaskService]
})
export class SubtaskModule {}
