import type { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  return (
    <div className="route-template" data-page-transition="enter">
      <span className="route-enter-progress" aria-hidden="true" />
      {children}
    </div>
  );
}
