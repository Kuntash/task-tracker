"use client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { auth, db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { USER_COLLECTION } from "@/constants";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, {
    message: "Password should have a minimum length of 8 characters",
  }),
});

export default function SignUpPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (args: z.infer<typeof formSchema>) => {
    const { email, password } = args;

    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, USER_COLLECTION, userCredentials.user.uid), {
        uid: userCredentials.user.uid,
        email,
      });

      router.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main
      id="signup-ui"
      className="flex min-h-screen justify-center items-center"
    >
      {/* Login page */}
      <Card className="p-4">
        <CardHeader>
          <CardTitle>Sign up to Task Tracker</CardTitle>
          <CardDescription>Track your task and be punctual.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="johndoe@gmail.com"
                          {...field}
                        />
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
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" variant="secondary">
                  Create account
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <CardDescription>
            Already have an account?
            <Link href="/login">
              <Button variant="link">Login</Button>
            </Link>
          </CardDescription>
        </CardFooter>
      </Card>
    </main>
  );
}
