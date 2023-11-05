"use client";
import { sql } from "@vercel/postgres";

export default async function Cart({ params }) {
  const { rows } = await sql`SELECT * from users`;
  return (
    <div>
      {rows.map((row) => (
        <div key={row.id}>{row.username}</div>
      ))}
    </div>
  );
}
