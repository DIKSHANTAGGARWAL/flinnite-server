import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import Group from "./group";

@Entity({ name: "Task" })
export class Task {
  @PrimaryGeneratedColumn("uuid")
  task_id!: string;

  @Column()
  title!: string;

  @Column()
  taskDetails!: string;

  @Column({ default: false })
  isComplete!: boolean;

  // Many-to-one relationship with groups
  @ManyToOne(() => Group, (group) => group.tasks)
  group!: Group; 
}

export default Task;