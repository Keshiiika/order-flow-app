import React from 'react'
import { FaGithub } from "react-icons/fa";
const Footer = () => {
  return (
    <footer className="text-center mt-auto" style={{backgroundColor:'#00BFFF'}}>
  <div className="container p-2">
    
    <section className="">
      <p>
        This is the Order Flow Web App.
      </p>
    </section>

    
  </div>

  <div className="text-center">
    <FaGithub />&nbsp;
    <a className="text-dark" href="https://github.com/Keshiiika">Keshika Patwari</a>
  </div>
</footer>

    
  )
}

export default Footer