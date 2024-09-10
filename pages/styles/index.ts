import { css } from 'hono/css'

export const bodyStyle = css`
  body {
    box-sizing: border-box;
    min-width: 200px;
    max-width: 980px;
    margin: 0 auto;
    font-family: monospace;
  }

  @media (max-width: 980px) {
    body {
      padding: 15px;
    }
  }
`

export const headerStyle = css`
h1 {
  font-size: 32px;
  margin: 0;
  padding: 40px 0 0 0;
  a {
    color: #000;
    text-decoration: none;
  }
}
p {
  font-size: 18px;
  margin: 0;
  padding: 20px 0;
}
@media (max-width: 767px) {
  h1 {
    padding-top: 20px;
  }
}
`

export const markdownBodyClass = css`
.fetch-button {
  display: inline-block;
  padding: 10px 15px;
  margin: 20px 0;
  background-color: #f0f0f0;
  color: #333;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-align: center;
}

.fetch-button:hover {
  background-color: #e0e0e0;
}

.markdown-body {
  border: 1px solid #eaecef;
  padding: 20px;
  border-radius: 5px;
  margin-bottom: 20px;
}
.markdown-body:hover {
  border: 1px solid #000;
  background-color: #f0f0f0;
}
.tag {
  font-size: 14px;
  color: #999;
}
.tag .tag-item {
  display: inline-block;
  font-size: 14px;
  color: #666;
  padding-right: 10px;
  cursor: pointer;

}
.tag .tag-item:hover {
  text-decoration: underline;
} 
time {
  display: inline-block;
  font-size: 14px;
  color: #999;
  padding: 10px 0;
}
time a {
  color: #999;
  text-decoration: none;
}
time a:hover {
  text-decoration: underline;
}
`

export const currentTagsWrapClass = css`
  display: none;
  font-size: 16px;
  color: #666;
  padding: 20px 0;
`

export const currentTagsClass = css`
  border: 1px solid #999999;
  background-color: #f0f0f0;
  padding: 4px;
  border-radius: 5px;
  margin-bottom: 20px;
  &:hover {
    background-color: #666;
    border-color: #666;
    color: #fff;
    cursor: pointer;
  }
`

export const footerClass = css`
  p {
    font-size: 14px;
  }
  a {
    font-size: 14px;
    color: #000;
    text-decoration: underline;
  }
`