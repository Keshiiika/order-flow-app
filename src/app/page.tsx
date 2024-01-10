import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <Link href="/checkout">
        Proceed to Checkout
      </Link>
    </main>
  )
}
