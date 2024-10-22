"use client";
import React from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import {SignedIn, SignedOut, UserButton} from '@clerk/nextjs'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="z-50 relative flex justify-center w-full p-4 bg-transparent">
      <div className="relative w-full max-w-5xl bg-white border border-gray-200 rounded-full shadow-sm backdrop-blur-md bg-opacity-20">
        <div className="mx-auto flex items-center justify-between px-10 py-2">
          <div className="inline-flex items-center space-x-2">
            <Link href="/">
            <span className="font-bold text-lg text-black">AST</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <ul className="inline-flex space-x-6">
              <SignedIn>
              <li>
                <Link href="/dashboard">
                  <div className="text-base font-medium text-black hover:text-gray-500">Dashboard</div>
                </Link>
              </li>
              </SignedIn>
              <SignedOut>
              <li>
                <Link href="/sign-in">
                  <div className="text-base font-medium text-black hover:text-gray-500">Sign In</div>
                </Link>
              </li>
              <li>
                <Link href="/sign-up">
                  <div className="text-base font-medium text-black hover:text-gray-500">Sign Up</div>
                </Link>
              </li>
              </SignedOut>
              <SignedIn>
              <li className="flex justify-center">
                <UserButton></UserButton>
              </li>
              </SignedIn>
            </ul>
          </div>
          <div className="md:hidden">
            <Menu onClick={() => setIsMenuOpen(true)} className="h-6 w-6 cursor-pointer" />
          </div>
        </div>
        {isMenuOpen && (
          <div className="absolute right-0 top-full mt-2 w-full origin-top-right transform p-2 transition md:hidden">
            <div className="divide-y-2 divide-gray-50 rounded-2xl bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="px-5 pb-6 pt-5">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center space-x-2">
                    <span className="font-bold">AST</span>
                  </div>
                </div>
                <div className="mt-6">
                  <nav className="grid gap-y-4">
                    <Link href="/dashboard">
                      <div className="-m-3 flex items-center rounded-md p-3 text-sm font-medium hover:bg-gray-50">
                        <span className="ml-3 text-base font-medium text-black">Dashboard</span>
                      </div>
                    </Link>
                    <Link href="/sign-in">
                      <div className="-m-3 flex items-center rounded-md p-3 text-sm font-medium hover:bg-gray-50">
                        <span className="ml-3 text-base font-medium text-black">Sign In</span>
                      </div>
                    </Link>
                    <Link href="/sign-up">
                      <div className="-m-3 flex items-center rounded-md p-3 text-sm font-medium hover:bg-gray-50">
                        <span className="ml-3 text-base font-medium text-black">Sign Up</span>
                      </div>
                    </Link>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
