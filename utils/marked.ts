import { marked } from 'marked'

const renderer = new marked.Renderer()

renderer.link = function(href: string, title: string, text: string) {
  var link = marked.Renderer.prototype.link.apply(this, arguments)
  return link.replace("<a","<a target='_blank'")
}

marked.setOptions({
  renderer: renderer
})

export default marked