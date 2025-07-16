// test-s3.js - Standalone S3 test script
require("dotenv").config();
const AWS = require("aws-sdk");

// Configure AWS
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "ap-south-1",
});

console.log("🔧 AWS Configuration Check:");
console.log(
  "- AWS_ACCESS_KEY_ID:",
  process.env.AWS_ACCESS_KEY_ID ? "Present" : "Missing"
);
console.log(
  "- AWS_SECRET_ACCESS_KEY:",
  process.env.AWS_SECRET_ACCESS_KEY ? "Present" : "Missing"
);
console.log("- Region: ap-south-1");
console.log("- Bucket: mentorone-app\n");

async function testS3Configuration() {
  console.log("🧪 Testing S3 Configuration...\n");

  // Test 1: List bucket contents
  try {
    console.log("1️⃣ Testing bucket access and listing images folder...");
    const bucketContents = await s3
      .listObjectsV2({
        Bucket: "mentorone-app",
        Prefix: "images/",
        MaxKeys: 20,
      })
      .promise();

    console.log("✅ Bucket access successful");
    console.log(
      "📁 Found objects in images folder:",
      bucketContents.Contents?.length || 0
    );

    if (bucketContents.Contents && bucketContents.Contents.length > 0) {
      console.log("📄 All image files:");
      bucketContents.Contents.forEach((obj, index) => {
        console.log(
          `   ${index + 1}. ${obj.Key} (${obj.Size} bytes, ${obj.LastModified})`
        );
      });
    } else {
      console.log("❌ No files found in images folder");

      // Check root folder
      console.log("\n🔍 Checking root folder...");
      const rootContents = await s3
        .listObjectsV2({
          Bucket: "mentorone-app",
          MaxKeys: 20,
        })
        .promise();

      if (rootContents.Contents && rootContents.Contents.length > 0) {
        console.log("📄 Files in root folder:");
        rootContents.Contents.forEach((obj, index) => {
          console.log(`   ${index + 1}. ${obj.Key}`);
        });
      }
    }
  } catch (error) {
    console.error("❌ Bucket access failed:");
    console.error("- Error Code:", error.code);
    console.error("- Error Message:", error.message);
    console.error("- Status Code:", error.statusCode);
    return;
  }

  // Test 2: Check specific file from your logs
  const testKey = "images/1752567307856_1752567307750_Sree.jpeg";
  try {
    console.log("\n2️⃣ Testing specific file existence...");
    console.log("🔍 Looking for:", testKey);

    const headResult = await s3
      .headObject({
        Bucket: "mentorone-app",
        Key: testKey,
      })
      .promise();

    console.log("✅ File exists!");
    console.log("📋 File details:");
    console.log("   - Size:", headResult.ContentLength, "bytes");
    console.log("   - Type:", headResult.ContentType);
    console.log("   - Last Modified:", headResult.LastModified);
    console.log("   - ETag:", headResult.ETag);
  } catch (error) {
    console.error("❌ Specific file not found:");
    console.error("- Error Code:", error.code);
    console.error("- Error Message:", error.message);

    // Try to find files with similar naming pattern
    try {
      console.log('\n🔍 Searching for files with "Sree" in name...');
      const searchResult = await s3
        .listObjectsV2({
          Bucket: "mentorone-app",
          Prefix: "images/",
          MaxKeys: 50,
        })
        .promise();

      const sreeFiles = searchResult.Contents?.filter(
        (obj) => obj.Key && obj.Key.toLowerCase().includes("sree")
      );

      if (sreeFiles && sreeFiles.length > 0) {
        console.log('📁 Found files containing "Sree":');
        sreeFiles.forEach((obj, index) => {
          console.log(`   ${index + 1}. ${obj.Key}`);
        });
      } else {
        console.log('❌ No files containing "Sree" found');
      }
    } catch (searchError) {
      console.error("❌ Search failed:", searchError.message);
    }
  }

  // Test 3: Generate signed URL (use first available file or test key)
  let keyToTest = testKey;

  // If we have files, use the first one
  try {
    const bucketContents = await s3
      .listObjectsV2({
        Bucket: "mentorone-app",
        Prefix: "images/",
        MaxKeys: 1,
      })
      .promise();

    if (bucketContents.Contents && bucketContents.Contents.length > 0) {
      keyToTest = bucketContents.Contents[0].Key;
      console.log("\n3️⃣ Testing signed URL generation with existing file...");
      console.log("🔗 Using key:", keyToTest);
    }
  } catch (error) {
    console.log("\n3️⃣ Testing signed URL generation with original key...");
  }

  try {
    const signedUrl = s3.getSignedUrl("getObject", {
      Bucket: "mentorone-app",
      Key: keyToTest,
      Expires: 3600,
    });

    console.log("✅ Signed URL generated successfully");
    console.log("🔗 Generated URL structure:");
    console.log(
      "   - Starts with https://mentorone-app.s3:",
      signedUrl.startsWith("https://mentorone-app.s3.")
    );
    console.log(
      "   - Contains X-Amz-Algorithm:",
      signedUrl.includes("X-Amz-Algorithm")
    );
    console.log(
      "   - Contains X-Amz-Credential:",
      signedUrl.includes("X-Amz-Credential")
    );
    console.log("   - Full URL length:", signedUrl.length);

    // Test the signed URL with a simple HTTP request
    console.log("\n4️⃣ Testing signed URL accessibility...");

    const https = require("https");
    const url = require("url");

    return new Promise((resolve) => {
      const parsedUrl = url.parse(signedUrl);
      const options = {
        hostname: parsedUrl.hostname,
        port: 443,
        path: parsedUrl.path,
        method: "HEAD",
        timeout: 10000,
      };

      const req = https.request(options, (res) => {
        if (res.statusCode === 200) {
          console.log("✅ Signed URL is accessible!");
          console.log("📋 Response details:");
          console.log("   - Status:", res.statusCode);
          console.log("   - Content-Type:", res.headers["content-type"]);
          console.log("   - Content-Length:", res.headers["content-length"]);
        } else if (res.statusCode === 403) {
          console.error(
            "❌ Access Denied (403) - Check bucket policy and file permissions"
          );
        } else {
          console.error("❌ Signed URL returned status:", res.statusCode);
        }
        resolve();
      });

      req.on("timeout", () => {
        console.error("❌ Request timeout - signed URL may be inaccessible");
        req.destroy();
        resolve();
      });

      req.on("error", (error) => {
        console.error("❌ Failed to access signed URL:", error.message);
        resolve();
      });

      req.end();
    });
  } catch (error) {
    console.error("❌ Signed URL generation failed:", error.message);
  }
}

// Test your specific URL pattern
async function testYourSpecificUrl() {
  console.log("\n🎯 Testing Your Specific URL Pattern...\n");

  const fullS3Url =
    "https://mentorone-app.s3.ap-south-1.amazonaws.com/images/1752567307856_1752567307750_Sree.jpeg";
  console.log("📝 Full URL from your logs:", fullS3Url);

  // Extract key like your backend does
  let key = fullS3Url;
  if (fullS3Url.includes("amazonaws.com/")) {
    const urlParts = fullS3Url.split("amazonaws.com/");
    key = urlParts[1];
  }

  console.log("🔧 Extracted key:", key);

  try {
    const headResult = await s3
      .headObject({
        Bucket: "mentorone-app",
        Key: key,
      })
      .promise();

    console.log("✅ Your specific file exists!");

    const signedUrl = s3.getSignedUrl("getObject", {
      Bucket: "mentorone-app",
      Key: key,
      Expires: 3600,
    });

    console.log(
      "✅ Signed URL for your file:",
      signedUrl.substring(0, 100) + "..."
    );
  } catch (error) {
    console.error("❌ Your specific file test failed:", error.message);
  }
}

// Run all tests
async function runAllTests() {
  try {
    await testS3Configuration();
    await testYourSpecificUrl();
    console.log("\n🏁 All S3 tests completed!");
  } catch (error) {
    console.error("\n💥 Test suite failed:", error.message);
  }
}

runAllTests();
