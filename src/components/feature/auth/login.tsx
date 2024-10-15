"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginDTO, TLoginDTO } from "@/lib/dto/auth";
import { login } from "@/server/actions/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "next/dist/server/api-utils";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { toast } from "sonner";

const Login = () => {
  const form = useForm<TLoginDTO>({
    resolver: zodResolver(loginDTO),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const mutationFn = form.handleSubmit(async (data) => {
    try {
      await login(data);
      toast.success("Login success");
    } catch (error) {
      if (error instanceof ApiError) {
        return toast.error(error.message);
      }
      return toast.error("Internal server error");
    }
    console.log(data);
  });

  const { isLoading, mutate } = useMutation({
    mutationKey: ["login"],
    mutationFn,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={mutate} className="space-y-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Your username" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Your password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isLoading}>
              {isLoading ? "Loading..." : "Login"}
            </Button>
            <Link href={"/register"}>
              <Button variant={"outline"}>Register</Button>
            </Link>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export { Login };
