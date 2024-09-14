import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany,ManyToOne } from "typeorm";
import Group from "./group";


@Entity({ name: "Message" })
export class Message {
  @PrimaryGeneratedColumn("uuid")
  message_id!: string

  @Column()
  sender!: string

  @Column()
  time!: string 

  @ManyToOne(() => Group, (group) => group.message)
    group!:Group

}
export default Message;