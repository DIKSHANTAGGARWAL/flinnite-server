import AppDataSource from "../config";
// import bcrypt from "bcryptjs";
// import * as jwt from "jsonwebtoken";
import User from "../entities/user";
import Group from "../entities/group";
import Task from "../entities/task";

const addGroup = async (req: any, res: any) => {
    console.log(req.body)
    const userRepo = AppDataSource.getRepository(User)
    const groupRepo = AppDataSource.getRepository(Group)

    const user = await userRepo.findOne({
        where: { email: req.body.email },
        relations: ['groups']  
    });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (user) {
        try {
            // console.log("1")
            // let OldGroups = user.groups||[]
            let newGroup = new Group()
            newGroup.admin = user.email
            newGroup.name = req.body.groupName
            newGroup.users = [user]; 
            await groupRepo.save(newGroup);
            // console.log(OldGroups)

            // OldGroups.push(newGroup)
            // user.groups = OldGroups
            console.log(newGroup);
            user.groups.push(newGroup);
            await userRepo.save(user);
            // console.log("2")
            let members = req.body.members
            for (let i = 0; i < members.length; i++) {
                // console.log(i+3)
                let memberId = members[i].userId
                let member = await userRepo.findOne({
                    where: { user_id: memberId },
                    relations: ['groups'] 
                })
                if (member) {
                    member.groups.push(newGroup);  // Add the group to this member's list of groups
                    await userRepo.save(member);  
                }
            }
            res.status(200).json({
                status: "200",
                message: "Group Created Successfully"
            })

        } catch (error) {
            res.status(404).json({
                status: "404",
                message: error
            })
        }
    }
};

const getGroups = async (req: any, res: any) => {
    const userRepo = AppDataSource.getRepository(User)

    const user = await userRepo.findOne({
        where: { email: req.body.email },
        relations: ['groups']  
    });

    res.status(200).json({
        status: "200",
        data: user?.groups
    })
}

const getTasks = async (req: any, res: any) => {
    const taskRepo = AppDataSource.getRepository(Task)

    const tasks = await taskRepo.find({
        where: {
          group: {
            group_id: req.body.groupId,
          },
        },
        relations: ['group'],
      });

    res.status(200).json({
        status: "200",
        tasks: tasks
    })
}

const createTask = async (req: any, res: any) => {
    try {
        const taskRepo = AppDataSource.getRepository(Task);
      // Add the task
        const newTask = new Task();
        newTask.title = req.body.title;
        newTask.taskDetails = req.body.taskDetails;
        newTask.group = req.body.group;
        taskRepo.save(newTask);
      // Send success response
      res.status(201).json(newTask);
    } catch (error:any) {
      // Send error response
      res.status(500).json({ error: error.message });
    }
};

const markComplete = async(req:any,res:any)=>{
    const taskRepo = AppDataSource.getRepository(Task);
    const task = await taskRepo.findOneBy({ task_id: req.body.taskId });

    if (!task) {
        throw new Error(`Task with ID ${req.body.taskId} not found.`);
    }

    // Set isComplete to true
    task.isComplete = true;

    // Save the updated task
    const updatedTask = await taskRepo.save(task);
    res.status(200).json({
        message:"Updated"
    })
}
export const controller = {
    addGroup,
    getGroups,
    getTasks,
    createTask,
    markComplete
}