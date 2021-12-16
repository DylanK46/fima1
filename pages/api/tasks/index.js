import dbConnect from "../../../utils/dbConnect";
import Task from "../../../models/Task";
import User from "../../../models/User";
import ClassTask from "../../../models/ClassTask";

dbConnect();

export default async function (req, res) {
  const { method } = req;
  switch (method) {
    case "GET":
      try {
        const classTasks = await ClassTask.find({});
        res.status(200).json({ success: true, data: classTasks });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "POST":
      try {
        const students = await User.find({ role: "student" });
        const studentIds = students.map((student) => student._id);
        const initialCompleteStatus = [];
        for (let i = 0; i < studentIds.length; i++) {
          initialCompleteStatus.push({
            student: studentIds[i],
            completed: false,
          });
        }
        const classTask = await ClassTask.create({
          ...req.body,
          completeStatus: initialCompleteStatus,
        });
        students.forEach(async (student) => {
          const task = await Task.create({
            ...req.body,
            classTask: classTask._id,
            user: student._id,
          });
          await User.findByIdAndUpdate(
            student._id,
            { $push: { tasks: task._id } },
            { new: true }
          );
        });
        res.status(201).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, error: "Bad Request" });
      break;
  }
}
