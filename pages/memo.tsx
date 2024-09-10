import { markdownBodyClass } from "./styles"
import { Style } from "hono/css"
import Layout from "./layout"

interface IMemoProps {
  title: string
  keywords: string
  description: string
  memo: any
}

const Memo = (props: IMemoProps) => {
  const item = props.memo
  return (
    <Layout title={props.title} keywords={props.keywords} description={props.description}>
      <Style>{markdownBodyClass}</Style>
      <article class="memo-item" id={item._id}>
        <time><a href={`/m/${item._id}`} target="_blank">{item.time}</a></time>
        <div className="markdown-body" dangerouslySetInnerHTML={{ __html: item.content }}></div>
        <p class="tag" dangerouslySetInnerHTML={{ __html: item.tags.join('') }}></p>
      </article>
    </Layout>
  )
}

export default Memo
