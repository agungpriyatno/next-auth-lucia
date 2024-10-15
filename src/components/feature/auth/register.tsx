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
import { registerDTO, TRegisterDTO } from "@/lib/dto/auth";
import { register } from "@/server/actions/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "next/dist/server/api-utils";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { toast } from "sonner";

const Register = () => {
  const form = useForm<TRegisterDTO>({
    resolver: zodResolver(registerDTO),
    defaultValues: {
      name: "",
      username: "",
      password: "",
    },
  });

  const mutationFn = form.handleSubmit(async (data) => {
    try {
      await register(data);
      toast.success("Register success");
    } catch (error) {
      if (error instanceof ApiError) {
        return toast.error(error.message);
      }
      return toast.error("Internal server error");
    }
    console.log(data);
  });

  const { isLoading, mutate } = useMutation({
    mutationKey: ["register"],
    mutationFn,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Register your account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={mutate} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Your Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              {isLoading ? "Loading..." : "Register"}
            </Button>
            <Link href={"/login"}>
              <Button variant={"outline"}>Login</Button>
            </Link>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export { Register };
