import { validateRequest } from "@/server/actions/auth";
import { redirect } from "next/navigation";

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = async ({ children }: AuthLayoutProps) => {
  const user = await validateRequest();
  if (user) redirect("/");
  return <>{children}</>;
};

export default AuthLayout;
