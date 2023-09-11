// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";

type Body = {
  email: string;
};

type Data = {
  success: boolean;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const body: Body = req.body as Body;

  console.log("CREATING CLIENT...");

  const client = new Client({
    connectionString: process.env.DB_CONNECTION_STRING,
  });

  // Connect to the PostgreSQL database
  client.connect();

  // Define the email and current timestamp
  const currentDatetime = new Date();

  // SQL query to insert data into the "signups" table
  const insertQuery = `
    INSERT INTO signups (email, signup_datetime)
    VALUES ($1, $2)
    RETURNING id;
  `;

  console.log("RUNNING QUERY...");

  // Execute the query with parameters
  client.query(insertQuery, [body.email, currentDatetime], (err, result) => {
    console.log("RAN QUERY");
    if (err) {
      console.error("FAIL! Error inserting data:", err);
      res.status(500).json({ success: false });
    } else {
      console.log(
        "SUCCESS! Data inserted successfully. ID:",
        result.rows[0].id
      );
      res.status(200).json({ success: true });
    }

    // Close the database connection
    client.end();
  });
}
