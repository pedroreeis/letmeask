import { Link } from 'react-router-dom'

import '../styles/404.scss'

export function NotFound() {
  return (
    <div className="body">
      <section className="notFound">
      <div className="img">
        <img src="https://assets.codepen.io/5647096/backToTheHomepage.png" alt="Back to the Homepage"/>
        <img src="https://assets.codepen.io/5647096/Delorean.png" alt="El Delorean, El Doc y Marti McFly"/>
      </div>
      <div className="text">
        <h1>404</h1>
        <h2>PAGE NOT FOUND</h2>
        <h3>BACK TO HOME?</h3>
        <p className="yes"><Link to="/">YES</Link></p>
        <p><Link to="/">NO</Link></p>
      </div>
      </section> 
    </div>
  )  
}