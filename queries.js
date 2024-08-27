// users
// codekata
// attendance
// topics
// tasks
// company_drives
// mentors

//1: Find all the topics and tasks which are thought in the month of October


db.task.find({ date: { $regex: "2023-10" } }).toArray();

//2: Find all the company drives which appeared between 15 oct-2020 and 31-oct-2020

db.companyDrives.find({
  date: { $gte: "2020-10-15", $lte: "2020-10-31" },
});

//3: Find all the company drives and students who are appeared for the placement.

db.companyDrives.find({}, { company: 1, date: 1, students: 1, _id: 0 });

//4: Find the number of problems solved by the user in codekata
db.codekata
  .aggregate([
    {
      $group: {
        _id: "$userId",
        name: { $first: "$name" },
        total_points: {
          $sum: { $cond: [{ $eq: ["$isCompleted", true] }, "$points", 0] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        name: "$name",
        total_points: 1,
      },
    },
  ])
  .pretty();

//5: Find all the mentors with who has the mentee's count more than 15

db.mentor.find({ mentees: { $gt: 15 } }).pretty();

//6 Find the number of users who are absent and task is not submitted  between 15 oct-2020 and 31-oct-2020

//(a) absent users
db.attendence.aggregate([
  {
    $match: {
      isPresent: false,
      Date: { $gte: "15-10-2020", $lte: "30-10-2020" },
    },
  },
  { $group: { _id: "", student_absent: { $sum: 1 } } },
  { $project: { student_absent: 1, _id: 0 } },
]);

// (b) not submitted tasks

db.task
  .find({ iscompleted: false, date: { $gt: "15-10-2020", $lt: "30-10-2020" } })
  .count();
