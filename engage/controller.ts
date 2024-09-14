import AppDataSource from "../config";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import User from "../entities/user";
import Group from "../entities/group";

const addGroup = async (req: any, res: any) => {
    const userRepo = AppDataSource.getRepository(User)
    const groupRepo = AppDataSource.getRepository(Group)

    const user = await userRepo.findOne({
        where: { email: req.body.email },
    });

    if (user) {
        try {
            let OldGroups = user.groups
            let newGroup = new Group()
            newGroup.admin = user.email
            newGroup.name = req.body.groupName
            OldGroups.push(newGroup)
            user.groups = OldGroups
            await userRepo.save(user)
            let members = req.body.members
            for (let i = 0; i < members.length; i++) {
                let memberId = members[i]
                let member = await userRepo.findOne({
                    where: { user_id: memberId }
                })
                if (member) {
                    let OldGroupsM = member?.groups
                    OldGroupsM?.push(newGroup)
                    member.groups = OldGroupsM
                    await userRepo.save(member)
                }
            }

        } catch (error) {
            res.status(404).json({
                status: "404",
                message: error
            })
        }
    }
};

export const controller = {
    addGroup
}