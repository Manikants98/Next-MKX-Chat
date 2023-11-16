import { Chat, Contacts, Dashboard, Groups, People } from "@mui/icons-material";

export const navItems = [
  {
    navIcon: <Dashboard />,
    navItem: "Dashboard",
    navLink: "/admin",
  },
  {
    navIcon: <People />,
    navItem: "Users",
    navLink: "/admin/users",
  },
  {
    navIcon: <Contacts />,
    navItem: "Contacts",
    navLink: "/admin/contacts",
  },
  {
    navIcon: <Chat />,
    navItem: "Chats",
    navLink: "/admin/chats",
  },
  {
    navIcon: <Groups />,
    navItem: "Groups",
    navLink: "/admin/groups",
  },
];
