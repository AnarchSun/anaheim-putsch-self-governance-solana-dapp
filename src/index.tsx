// index.tsx — si tu buildes en pur React (non-Next.js)
import { createRoot } from 'react-dom/client'
import { useState } from 'react'
function Counter() {
  const [count, setCount] = useState(0)
  return (
    <>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </>
  )
}

const root = createRoot(document.getElementById('root')!)
root.render(<Counter />)
