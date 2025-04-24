// const express = require("express");
// const router = express.Router();
// const AWS = require("aws-sdk");
// const multer = require("multer");
// const Service = require("../models/ServiceModel");
// const OnlineService = require("../models/OnlineServiceModel");
// const DigitalProduct = require("../models/DigitalProductModel");
// const VideoTutorial = require("../models/VideoTutorialModel");

// // Configure AWS S3
// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

// const BUCKET_NAME = process.env.S3_BUCKET_NAME;

// // Multer setup for file uploads
// const upload = multer({ storage: multer.memoryStorage() });

// // Function to upload file to S3
// const uploadToS3 = async (file, folder) => {
//   const fileName = `${folder}/${Date.now()}_${file.originalname}`;
//   const params = {
//     Bucket: BUCKET_NAME,
//     Key: fileName,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//   };

//   try {
//     await s3.upload(params).promise();
//     return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
//   } catch (error) {
//     throw new Error("Failed to upload file to S3");
//   }
// };

// // Create Service Route
// router.post("/createService", upload.any(), async (req, res) => {
//   try {
//     const formData = req.body;
//     const files = req.files;
//     const {
//       mentorId,
//       type,
//       title,
//       shortDescription,
//       amount,
//       digitalProductType,
//     } = formData;

//     // Validate required fields
//     if (!mentorId || !type || !title || !shortDescription || !amount) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     // Create Service document
//     const service = new Service({
//       mentorId,
//       type,
//       title,
//       shortDescription,
//       amount,
//     });

//     let serviceId;
//     if (type === "1-1Call" || type === "priorityDM") {
//       const { duration, longDescription, oneToOneType } = formData;
//       if (
//         !duration ||
//         !longDescription ||
//         (type === "1-1Call" && !oneToOneType)
//       ) {
//         return res
//           .status(400)
//           .json({ error: "Missing required fields for online service" });
//       }
//       const onlineService = new OnlineService({
//         mentorId,
//         type: type === "1-1Call" ? oneToOneType : "priorityDM",
//         duration,
//         longDescription,
//       });
//       await onlineService.save();
//       serviceId = onlineService._id;
//     } else if (type === "DigitalProducts") {
//       if (!digitalProductType) {
//         return res.status(400).json({ error: "Missing digital product type" });
//       }
//       const digitalProduct = new DigitalProduct({
//         mentorId,
//         type: digitalProductType,
//       });

//       if (digitalProductType === "documents") {
//         const pdfFile = files.find((file) => file.fieldname === "pdfFile");
//         if (!pdfFile) {
//           return res
//             .status(400)
//             .json({ error: "Missing PDF file for documents" });
//         }
//         const fileUrl = await uploadToS3(pdfFile, "pdfs");
//         digitalProduct.fileUrl = fileUrl;
//       } else if (digitalProductType === "videoTutorials") {
//         const exclusiveContent = [];
//         let seasonIndex = 0;
//         while (formData[`exclusiveContent[${seasonIndex}][season]`]) {
//           const season = formData[`exclusiveContent[${seasonIndex}][season]`];
//           const episodes = [];
//           let episodeIndex = 0;
//           while (
//             formData[
//               `exclusiveContent[${seasonIndex}][episodes][${episodeIndex}][episode]`
//             ]
//           ) {
//             const episode =
//               formData[
//                 `exclusiveContent[${seasonIndex}][episodes][${episodeIndex}][episode]`
//               ];
//             const title =
//               formData[
//                 `exclusiveContent[${seasonIndex}][episodes][${episodeIndex}][title]`
//               ];
//             const description =
//               formData[
//                 `exclusiveContent[${seasonIndex}][episodes][${episodeIndex}][description]`
//               ];
//             const videoFile = files.find(
//               (file) =>
//                 file.fieldname ===
//                 `exclusiveContent[${seasonIndex}][episodes][${episodeIndex}][video]`
//             );
//             if (!videoFile) {
//               return res
//                 .status(400)
//                 .json({
//                   error: `Missing video file for episode ${episodeIndex}`,
//                 });
//             }
//             const videoUrl = await uploadToS3(videoFile, "videos");
//             episodes.push({ episode, title, description, videoUrl });
//             episodeIndex++;
//           }
//           exclusiveContent.push({ season, episodes });
//           seasonIndex++;
//         }
//         const videoTutorial = new VideoTutorial({
//           exclusiveContent,
//         });
//         await videoTutorial.save();
//         digitalProduct.videoTutorials = [videoTutorial._id];
//       }
//       await digitalProduct.save();
//       serviceId = digitalProduct._id;
//     } else {
//       return res.status(400).json({ error: "Invalid service type" });
//     }

//     // Set serviceId and save Service document
//     service.serviceId = serviceId;
//     await service.save();

//     res.status(201).json({ data: service });
//   } catch (error) {
//     console.error("Error creating service:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// router.get("/generate-presigned-url", async (req, res) => {
//   const { fileName, fileType, folder } = req.query;
//   const key = `${folder}/${Date.now()}_${fileName}`;
//   const params = {
//     Bucket: process.env.S3_BUCKET_NAME,
//     Key: key,
//     ContentType: fileType,
//     Expires: 300,
//   };
//   try {
//     const url = await s3.getSignedUrlPromise("putObject", params);
//     res.json({ url, key });
//   } catch (error) {
//     console.error("Error generating presigned URL:", error);
//     res.status(500).json({ error: "Failed to generate presigned URL" });
//   }
// });

// module.exports = router;
