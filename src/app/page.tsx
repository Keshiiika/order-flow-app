import Image from 'next/image'
import Link from 'next/link'
import Navbar from '../app/navbar'

export default function Home() {
  return (
    <main>
      <Navbar/>
      <Link href="/checkout">
        Proceed to Checkout
      </Link>
    </main>
  )
}
