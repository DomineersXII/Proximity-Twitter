import { useState } from "react"
import { setSignedIn } from "./signed-in-handler"

type SignInProps = {
    onClick: () => void
}

async function signIn(username: string, password: string) {
    if (username.includes(" ")) return
    if (password.includes(" ")) return
    if (username.length === 0) return
    if (password.length === 0) return

    const response = await fetch("https://proximity-twitter-server.onrender.com/sign-in", {
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


export function SignIn(props: SignInProps) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    return <div className="signInContainer" id="signInDiv">
        <h3 className="signInText">Username:</h3>
        <input className="signInInput" type="text" onChange={(e) => setUsername(e.target.value)}></input>
        <h3 className="signInText">Password:</h3>
        <input className="signInInput" type="password" onChange={(e) => setPassword(e.target.value)}></input>
        <button onClick={() => signIn(username, password)}>Sign In</button>
        <button onClick={()=>{props.onClick()}}>Sign Up</button>
    </div>
}