import { headerStyle } from "../styles"

const Header = () => {
  return (
    <div class={headerStyle}>
      <h1><a href="/">{Bun.env.TITLE}</a></h1>
      <p>{Bun.env.DESCRIPTION}</p>
    </div>
  )
}

export default Header