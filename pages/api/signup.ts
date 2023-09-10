// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";

type Data = {
  success: boolean;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log("CREATING CLIENT...");
  // Create a new PostgreSQL client
  const client = new Client({
    user: "gabe",
    host: "dpg-cjv48ap5mpss7394g31g-a.oregon-postgres.render.com",
    database: "yearendrecap",
    password: "jVcnn0sCp5w2YHZvf5ftYPYaiCBISiLa",
    port: 5432, // Default PostgreSQL port
  });

  // Connect to the PostgreSQL database
  client.connect();

  // Define the email and current timestamp
  const email = "example@example.com";
  const currentDatetime = new Date();

  // SQL query to insert data into the "signups" table
  const insertQuery = `
    INSERT INTO signups (email, signup_datetime)
    VALUES ($1, $2)
    RETURNING id;
  `;

  console.log("RUNNING QUERY...");

  // Execute the query with parameters
  client.query(insertQuery, [email, currentDatetime], (err, result) => {
    console.log("RAN QUERY");
    if (err) {
      console.log("RAN QUERY WITH ERROR");
      console.error("Error inserting data:", err);
    } else {
      console.log("RAN QUERY SUCCESSFULLY!");
      console.log("Data inserted successfully. ID:", result.rows[0].id);
    }

    // Close the database connection
    client.end();
  });

  res.status(200).json({ success: true });
}
