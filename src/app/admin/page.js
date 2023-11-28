"use client";
import { Divider } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

const Dashboard = () => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const data = daysOfWeek.map((days) => ({
    days,
    users: Math.floor(Math.random() * (300 - 50 + 1)) + 50,
  }));
  const items = ["Users", "Contacts", "Chats", "Contacts"];

  const itemsCounts = items.map((item) => ({
    item,
    counts: Math.floor(Math.random() * (300 - 50 + 1)) + 50,
  }));

  return (
    <>
      <div className="flex justify-between items-center h-[10vh] px-3"></div>
      <Divider />
      <div className="flex min-h-[400px] overflow-auto h-[90vh] flex-col gap-3 p-3">
        <div className="grid grid-cols-4 gap-3 h-52">
          {itemsCounts.map((i, index) => {
            return (
              <div
                key={index + 1}
                className="flex flex-col items-center justify-center gap-1 rounded shadow cursor-pointer bg-zinc-200 dark:bg-zinc-700 dark:text-white"
              >
                20
                {/* <span className="text-xl font-semibold">{i.counts || ""}</span> */}
                {/* <span className="text-xl font-semibold">{i.item || ""}</span> */}
              </div>
            );
          })}
        </div>
        <div className="rounded bg-zinc-200 dark:bg-zinc-700">
          <BarChart
            colors={["red", "blue", "green", "sky"]}
            xAxis={[
              {
                scaleType: "band",
                data: daysOfWeek,
              },
            ]}
            series={[{ data: data?.map((u) => u.users) }]}
            height={370}
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
