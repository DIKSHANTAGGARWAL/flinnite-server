import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from "typeorm";
import Message from "./message";


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


}
export default Group;