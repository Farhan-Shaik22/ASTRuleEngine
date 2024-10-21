"use client";

import { useUser } from "@clerk/clerk-react";
import Loader from "../_components/Loading";

export default function Dashboard() {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) {
    return <Loader />;
  }

  const email = user?.primaryEmailAddress?.emailAddress || "No email provided";

  return (
    <div>
      <h1>Hello {email}</h1>
    </div>
  );
}