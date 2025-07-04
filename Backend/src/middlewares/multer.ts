// import multer from "multer";
// import multerS3 from "multer-s3";
// import { s3 } from "../config/awsS3";

// export const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: process.env.AWS_BUCKET_NAME!, // "mentor-one"
//     acl: "public-read",
//     key: (req, file, cb) => {
//       const email = req.body.email || "unknown"; // Fallback if email isn’t provided
//       const uniqueKey = `ProfilePicture/${email.replace(
//         /[@.]/g,
//         "_"
//       )}_${Date.now()}.jpg`;
//       cb(null, uniqueKey);
//     },
//   }),
// });
