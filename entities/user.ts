import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { Group } from './group'

@Entity({ name: "User" })
export class User {
    @PrimaryGeneratedColumn("uuid")
    user_id!: string

    @Column()
    name!: string

    @Column()
    email!: string

    @Column()
    password!: string

    @ManyToMany(() => Group)
    @JoinTable()
    groups!: Group[]

}
export default User;