import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

export default async function HomePage() {
  const locale = await getLocale();
  return redirect(`/${locale}`);
}
