import { footerClass } from "../styles"

const Footer = () => {
  return (
    <footer className={footerClass}>
      <p>© {new Date().getFullYear()} <a href="/">{Bun.env.TITLE}</a>. Powered by <a href="https://github.com/jakholuo/quest" target="_blank">Quest</a> &amp; <a href="https://www.yige.me" target="_blank">YIGE</a>.</p>
    </footer>
  )
}

export default Footer