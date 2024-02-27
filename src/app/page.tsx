import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import React from "react";

const HomePage = () => {
  return (
    <main className="min-h-screen flex justify-center items-center">
      <Card className="p-4">
        <CardHeader>
          <CardTitle>Welcome to Task Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard">
            <Button variant="secondary" className="w-full">
              Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  );
};

export default HomePage;
