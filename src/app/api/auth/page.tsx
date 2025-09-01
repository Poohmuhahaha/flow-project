"use client"

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Page = () => {

  const [ result, setResult ] = useState([])
  useEffect(() => {
    const fetchUsers = async() => {
      const response = await fetch("/api/users")
      const result = await response.json()
      setResult(result)
    }
    fetchUsers()
  }, [])
  console.log(result)
  
  return (
    <div className="flex flex-col items-center justify-center h-dvh">
      <Link href="/login">
      <Button>login</Button>
      </Link>
    </div>
  );
};
export default Page;
