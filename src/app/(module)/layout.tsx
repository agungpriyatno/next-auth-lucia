import { validateRequest } from "@/server/actions/auth";
import { redirect } from "next/navigation";

type ModuleLayoutProps = {
  children: React.ReactNode;
};

const ModuleLayout = async ({ children }: ModuleLayoutProps) => {
  const user = await validateRequest();
  if (!user) redirect("/login");
  return <>{children}</>;
};

export default ModuleLayout;
