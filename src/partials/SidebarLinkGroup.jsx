// SidebarLinkGroup.jsx
import React, { useState } from "react";

function SidebarLinkGroup({ children, activecondition }) {
  const [open, setOpen] = useState(activecondition);

  const handleClick = () => setOpen(!open);

  return (
    <li
      className={`pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r ${
        activecondition
          ? "from-[#8B593E]/[0.22] dark:from-[#8B593E]/[0.22] to-[#8B593E]/[0.14]"
          : ""
      }`}
    >
      {children(handleClick, open)}
    </li>
  );
}

export default SidebarLinkGroup;
