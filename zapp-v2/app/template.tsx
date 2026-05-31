import { PageTransition } from "@/components/PageTransition";

// template.tsx re-mounts on every navigation, so the enter transition replays
// each time the visitor moves between pages.
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
