import {
  Entity,
  ObjectIdColumn,
  Column,
  ObjectId,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Metadata {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  filename: string;

  @Column()
  metadata: object;

  @CreateDateColumn()
  createdAt: Date;
}
