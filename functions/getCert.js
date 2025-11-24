const AWS = require('aws-sdk');
const mapping = require('./mapping.json');

// Normalize names for comparison
const normalize = s => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();

const s3 = new AWS.S3({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  if (event.httpMethod !== "POST")
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const roll = (payload.roll || "").trim().toUpperCase();
  const name = payload.name || "";

  if (!roll || !name)
    return { statusCode: 400, body: JSON.stringify({ error: "Missing fields" }) };

  const row = mapping[roll];
  if (!row)
    return { statusCode: 404, body: JSON.stringify({ error: "Roll number not found" }) };

  if (normalize(row.name) !== normalize(name))
    return { statusCode: 403, body: JSON.stringify({ error: "Name does not match records" }) };

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: row.filename,
    Expires: 300  // 5 minutes
  };

  try {
    const url = await s3.getSignedUrlPromise("getObject", params);
    return {
      statusCode: 200,
      body: JSON.stringify({ url })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "Server error generating link" }) };
  }
};
