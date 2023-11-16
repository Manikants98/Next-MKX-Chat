"use client";
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";
import classNames from "classnames";
import { navItems } from "../../mock";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();

  return (
    <div className="flex !h-full bg-white dark:bg-zinc-800 dark:text-white rounded">
      <List className="w-72 flex flex-col h-fit" disablePadding>
        <ListItem className="flex gap-2 items-center h-[10vh]">
          <Avatar src="mks" alt="M" />
          <span className="flex flex-col font-semibold">
            <p>Mani Kant Sharma</p>
            <p className="text-xs">Super Admin</p>
          </span>
        </ListItem>
        <Divider />
        <div className="flex flex-col gap-1 p-1">
          {navItems.map((i, index) => {
            return (
              <ListItemButton
                key={index + 1}
                className={classNames(
                  "hover:!bg-blue-500 group hover:!text-white !rounded-sm"
                )}
                onClick={() => router.push(i.navLink)}
              >
                <ListItemIcon className={classNames("group-hover:!text-white")}>
                  {i.navIcon}
                </ListItemIcon>
                {i.navItem}
              </ListItemButton>
            );
          })}
        </div>
      </List>
    </div>
  );
};

export default Sidebar;
