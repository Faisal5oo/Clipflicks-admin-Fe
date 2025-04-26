import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const {
    CLOUDFLARE_R2_ACCOUNT_ID,
    CLOUDFLARE_R2_ACCESS_KEY_ID,
    CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    CLOUDFLARE_R2_BUCKET_NAME,
  } = process.env;

  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID,
      secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
  });

  const fileName = uuidv4() + ".mp4";
  const key = `videos/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: CLOUDFLARE_R2_BUCKET_NAME,
    Key: key,
    ContentType: "video/mp4",
  });

  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });
  
  const publicUrl = `https://pub-${CLOUDFLARE_R2_ACCOUNT_ID}.r2.dev/${key}`;

  return new Response(JSON.stringify({
    uploadUrl: signedUrl,
    publicUrl: publicUrl,
  }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
