

import { Link } from "@nextui-org/react";



function LinkTag() {
  return (
    <Link isExternal href="https://github.com/Muhammad-Owais-Warsi" showAnchorIcon>
      Owais
    </Link>
  );
}

export default function Footer() {
  return (

        <p className="relative top-10">
            <LinkTag />
        </p>

  );
}
