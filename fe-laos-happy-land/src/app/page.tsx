import { redirect } from "next/navigation";

export default function RootPage() {
  // Default redirect to Laos - client-side will handle locale detection
  redirect("/la");
}
