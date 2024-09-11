import Header from './header'
import Footer from './footer'
import { Style } from 'hono/css'
import { bodyStyle } from '../styles'

interface SiteData {
  title?: string
  keywords?: string
  description?: string
  image?: string
  children?: any
}

const Layout = (props: SiteData) => {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{props.title ? `${props.title} - ${Bun.env.TITLE}` : `${Bun.env.TITLE} - ${Bun.env.SUB_TITLE}` }</title>
        <meta name="keywords" content={props.keywords ? props.keywords : `${Bun.env.SUB_TITLE} - ${Bun.env.DESCRIPTION}`} />
        <meta name="description" content={props.description ? props.description : `${Bun.env.SUB_TITLE} - ${Bun.env.DESCRIPTION}`} />
        <link rel="icon" href="/public/favicon.png" />
        <link rel="stylesheet" href="/public/normalize.css" />
        <link rel="stylesheet" href="/public/github-markdown.css" />
        <Style>{bodyStyle}</Style>
        {
          Bun.env.UMAMI_WEBSITE_ID && (
            <script defer src={Bun.env.UMAMI_URL} data-website-id={Bun.env.UMAMI_WEBSITE_ID}></script>
          )
        }
        {
          Bun.env.FONT_SCRIPT_URL && (
            <link href={Bun.env.TFONT_SCRIPT_URL} rel='stylesheet' />
          )
        }
      </head>
      <body>
        <Header />
          {props?.children}
        <Footer />
      </body>
    </html>
  )
}

export default Layout