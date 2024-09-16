import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from "typeorm";
import Message from "./message";
import User from "./user";
import Task from "./task";

@Entity({ name: "Group" })
export class Group {
  @PrimaryGeneratedColumn("uuid")
  group_id!: string

  @Column()
  name!: string

  @Column()
  admin!: string

  @OneToMany(() => Message, (message) => message.group)
  message!: Message[]

  @ManyToMany(() => User, user => user.groups)
  users!: User[];

  @OneToMany(() => Task, (task) => task.group)
  tasks!: Task[];

}
export default Group;