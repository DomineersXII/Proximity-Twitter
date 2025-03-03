import { useState } from "react";
import { setSignedIn } from "./signed-in-handler";


async function signUp(username: string, password: string, confirmPassword: string) {
    if (password !== confirmPassword) return //password doesnt match confirmed password
    if (username.includes(" ")) return
    if (password.includes(" ")) return
    if (username.length === 0) return
    if (password.length === 0) return

    const response = await fetch("https://proximity-twitter-server.onrender.com/sign-up", {
        method: "POST",
        body: JSON.stringify({username: username, password: password})
    })

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
    }

    const success = await response.json()

    if (success === true) {
        setSignedIn(username)
    }
}


export function SignUp() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    return <div className="signUpContainer" id="signUpDiv">
        <h3 className="signInText">Username:</h3>
        <input className="signInInput" type="text" onChange={(e) => setUsername(e.target.value)}></input>
        <h3 className="signInText">Password:</h3>
        <input className="signInInput" type="password" onChange={(e) => setPassword(e.target.value)}></input>
        <h3 className="signInText">Confirm Password:</h3>
        <input className="signInInput" type="password" onChange={(e) => setConfirmPassword(e.target.value)}></input>
        <button onClick={() => signUp(username, password, confirmPassword)}>Sign Up</button>
    </div>
}