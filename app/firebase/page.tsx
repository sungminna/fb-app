'use client';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import firebase from 'firebase/compat/app';
//import firebase from 'firebase/app';
import 'firebase/compat/auth';

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { auth, app } from "@/lib/firebase/auth"
import { useEffect } from "react"


export default function LoginForm() {
  useEffect(() => {
    let ui: any | null = null;
    const firebaseui = require('firebaseui');
    if(!ui){
        const ui = new firebaseui.auth.AuthUI(auth);
    }
    ui.start('#firebaseui-auth-container', {
        signInOptions:[
            firebase.auth.EmailAuthProvider.PROVIDER_ID
        ], 
    
      });
  })

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
        <div id="firebaseui-auth-container"></div>
        </CardContent>
      </Card>
    </main>
    
  )
}
