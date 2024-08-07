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
import 'firebaseui/dist/firebaseui.css';

import 'firebase/compat/auth';

import { auth } from "@/lib/firebase/auth"
import { useEffect, useState } from "react"

import { signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';


export default function LoginForm() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  const [isAuth ,setIsAuth] = useState(false);
  const [username, setUsername] = useState("");

  const provider = new GoogleAuthProvider();
  
  const CheckCurrentUser = () => {
    const user = auth.currentUser;
    if(user){
      console.log(user);
      setIsAuth(true);
    }
    else{
      setIsAuth(false);
    }
  }

  useEffect(() => {
    CheckCurrentUser();
}, [])

  const SendToken = async () => {
    try{
      if(!auth.currentUser){
        console.log("no user signed in");
        return;
      }
      const user = auth.currentUser;
      const token = await user.getIdToken();
      console.log(token);
      console.log(username);
      //const token = auth.currentUser?.getIdToken(true);
      //send token via https
      
      const res = await fetch('http://localhost:8000/local/firebase-token/', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}`, 
        }, 
        body: JSON.stringify({'token': token, 'username': username}), 
      });

      if(!res.ok){
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log("server response", data);


    }
    catch (error){
      console.log(error);
    }
  }

  const SignUp = async (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    try{
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        CheckCurrentUser();
    }
    catch(error){
        console.log(error);
    }
  }

  const Login = async (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    try{
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        setUser(user);
        CheckCurrentUser();
    }
    catch(error){
        console.log(error);
    }
  }

  const Google = async (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    try{
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        const username = user.displayName;
        setUsername(username);
        console.log(token);
        CheckCurrentUser();
    }
    catch(error){
        console.log(error);
    }
  }

  const Logout = async (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    try{
        await signOut(auth);
        CheckCurrentUser();
    }
    catch(error){
        console.log(error);
    }
  }
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{isAuth ? "Wecome": "Login"}</CardTitle>
          <CardDescription>
            Manual user auth
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                id="username"
                type="text"
                placeholder="username"
                required
                onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" 
                onChange={(e) => setPassword(e.target.value)}

                />
            </div>
            <Button className="w-full" onClick={SignUp}>
                Create an account
            </Button>
            <Button className="w-full" onClick={Login}>
                Login an account
            </Button>
            <Button className="w-full" onClick={Google}>
                Google Auth
            </Button>
            <Button className="w-full" onClick={Logout} disabled={!isAuth}>
                Logout an account
            </Button>
            <Button className="w-full" onClick={SendToken} disabled={!isAuth}>
                SEND TOKEN
            </Button>
            <Link href={'/'}>Home</Link>
            </div>
            <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="signin" className="underline">
                Sign in
            </Link>
            </div>
        </CardContent>
      </Card>
    </main>
    
  )
}
