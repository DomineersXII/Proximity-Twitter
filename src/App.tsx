import './App.css'
import { MapContainer, Popup, TileLayer, Marker, Circle } from 'react-leaflet'
import { SignIn } from './SignIn'
import { SignUp } from './SignUp'
import { useEffect, useState } from 'react'
import { checkSignedIn } from './signed-in-handler'
import { Post } from './Post'
import { LatLngExpression } from 'leaflet'

const MESSAGE_DISPLAY_DISTANCE = 10 //miles

class signedInTracker {
  signedIn: boolean
  callback: (() => void) | null

  constructor() {
    this.signedIn = false
    this.callback = null
  }

  change() {
    this.signedIn = true
    if (this.callback) {
      this.callback()
    }
  }

  onChange(callback: () => void) {
    this.callback = callback
  }
}

class messagePostedTracker {
  callback: (() => void) | null

  constructor() {
    this.callback = null
  }

  call() {
    if (this.callback) {
      this.callback()
    }
  }

  assignCallback(callback: () => void) {
    this.callback = callback
  }
}

const signedInClass = new signedInTracker()
const messagePostedObject = new messagePostedTracker()

export function setSignedInUI() {
  signedInClass.change()
}

function placeMessage(userName: string | null, setShowSignIn: (show: boolean) => void, showSignIn: boolean, setShowSignUp: (show: boolean) => void, showSignUp: boolean, setShowPost: (show: boolean) => void, showPost: boolean) {
  if (userName !== null) {
  } else {
    if (checkSignedIn() === true) {
      setShowSignUp(false)
      setShowSignIn(false)
      setShowPost(!showPost)

      return
    }

    if (showSignUp === true) {
      setShowSignUp(false)
    } else {
      setShowSignIn(!showSignIn)
    }
  }
}

type message = {
  username: string,
  message: string,
  location: string
}

const globalMessages: message[] = []

async function loadMessages() {
  const response = await fetch("http://localhost:3000/get-all-messages", {
    method: "GET"
  })

  const messages = await response.json()

  for (let i = 0; i < messages.length; i++) {
    globalMessages[i] = messages[i]
  }
}

function toRadian(degree: number) {
  return degree * (Math.PI / 180)
}

function calculateDistance(point1: [number, number], point2: [number, number]): number {
  const EARTH_RADIUS = 3963.1 //in miles

  const [lat1, lon1] = point1
  const [lat2, lon2] = point2

  const D_LAT = toRadian(lat2 - lat1)
  const D_LON = toRadian(lon2 - lon1)

  const angle = Math.sin(D_LAT / 2) ** 2 + Math.cos(toRadian(lat1)) * Math.cos(toRadian(lat2)) * Math.sin(D_LON / 2) ** 2
  const centralAngle = 2 * Math.atan2(Math.sqrt(angle), Math.sqrt(1 - angle))

  return centralAngle * EARTH_RADIUS
}

function renderMessages() {
  const markerUIs = []

  for (let i = 0; i < globalMessages.length; i++) {
    const messageData = globalMessages[i]
    const location = messageData.location.split(" ").map((value: string) => {
      return Number(value)
    }) as [number, number]
    if (typeof(location[0]) != "number" || isNaN(location[0])) continue
    if (typeof(location[1]) != "number" || isNaN(location[1])) continue
  

    const distance = calculateDistance(userLocation as [number, number], location)
    if (distance > MESSAGE_DISPLAY_DISTANCE) continue

    const username = messageData.username
    const message = messageData.message

    const messageMarker = <Marker position={location as LatLngExpression}>
      <Popup>
        username: {username}<br></br>
        message: {message}
      </Popup>
    </Marker>
    markerUIs[i] = messageMarker
  }
  

  return <div>
    {markerUIs}
  </div>
}

function getUserLocation(): Promise<number[]> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position) => {
      resolve([position.coords.latitude, position.coords.longitude])
    }, reject)
  })
}

const userLocation = await getUserLocation()


await loadMessages()
let messagesUI = renderMessages()

export async function displayNewMessage() {
  await loadMessages()
  messagesUI = renderMessages()
  messagePostedObject.call()
}

function App() {
  navigator.geolocation.getCurrentPosition(() => {}) //prompt to get location when website is opened
  const [showSignIn, setShowSignIn] = useState(false) 
  const [showSignUp, setShowSignUp] = useState(false)
  const [showPost, setShowPost] = useState(false)
  const [messagesPosted, setMessagesPosted] = useState(0)
  const userName: string | null = null

  const [_, setSignedIn] = useState(false)

  useEffect(() => {
    signedInClass.onChange(() => {
      setSignedIn(true)
    })
  }, [])

  messagePostedObject.assignCallback(() => {
    setMessagesPosted(messagesPosted + 1)
  })

  function renderSignIn() {
    if (checkSignedIn() === true) {
      if (showPost === true) {
        return <Post></Post>
      }

      return null
    }

    if (showSignIn === true) {
      return <SignIn onClick={() => {setShowSignIn(false); setShowSignUp(true)}}></SignIn>
    }
    if (showSignUp === true) {
      return <SignUp></SignUp>
    }

    return null
  }


  return (
    <div id = "wrapper">
      <MapContainer center={[40.505, -100.09]} zoom={5}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
        <Circle center={userLocation as LatLngExpression} radius={MESSAGE_DISPLAY_DISTANCE * 1609.34}></Circle>
        {messagesUI}
      </MapContainer>
      {renderSignIn()}
      <button id = "placeMessage" onClick = {() => placeMessage(userName, setShowSignIn, showSignIn, setShowSignUp, showSignUp, setShowPost, showPost)}>Post</button>
    </div>
  )
}


export default App