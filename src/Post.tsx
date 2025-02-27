import { useState } from "react"
import { getUsername } from "./signed-in-handler"
import { displayNewMessage } from "./App"


function floorWithPrecision(num: number, precision: number) {
    const multiplier = 10 ^ precision

    return Math.floor(num * multiplier) / multiplier
}

function post(message: string) {
    const username = getUsername()
    
    navigator.geolocation.getCurrentPosition(async (pos: GeolocationPosition) => {
        const location = `${pos.coords.latitude} ${pos.coords.longitude}`

        await fetch("http://localhost:3000/post-message", {
            method: "POST",
            body: JSON.stringify({username: username, message: message, location: location})
        })

        displayNewMessage()
    })
}

export function Post() {
    const [message, setMessage] = useState("")
    
    return <div className="postContainer" id="postDiv">
         <h3 className="signInText">Message:</h3>
         <textarea className="postInput" onChange={(e) => setMessage(e.target.value)}></textarea>
         <button onClick={() => post(message)}>Post</button>
    </div>
}