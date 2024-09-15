import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany,ManyToOne, CreateDateColumn } from "typeorm";
import Group from "./group";


@Entity({ name: "Message" })
export class Message {
  @PrimaryGeneratedColumn("uuid")
  message_id!: string

  @Column()
  sender!: string

  // @ManyToOne(() => User, user => user.messages)
  //   sender: User;


  @Column()
  content!: string

  @CreateDateColumn()
    timestamp!: Date;

  @ManyToOne(() => Group, (group) => group.message)
    group!:Group

}
export default Message;