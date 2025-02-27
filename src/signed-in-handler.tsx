import { setSignedInUI } from "./App"

let signedIn = false
let usernameGlobal = ""


export function setSignedIn(username: string) {
    signedIn = true
    usernameGlobal = username
    setSignedInUI()
}

export function checkSignedIn() {
    return signedIn
}

export function getUsername() {
    return usernameGlobal
}