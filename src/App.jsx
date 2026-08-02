import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <h1 className="text-3xl font-bold text-slate-800">Tailwind is working</h1>
      </div>
  )
}

export default App
