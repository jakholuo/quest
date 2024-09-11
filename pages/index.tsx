import { html } from "hono/html"
import { Style } from 'hono/css'
import { markdownBodyClass, currentTagsWrapClass, currentTagsClass } from './styles'
import Layout from "./layout";

interface IIndexProps {
  memos: any
}

const Index = (props: IIndexProps) => {
  const fetchPrevList = () => html`
    <script>
      var memoList = document.getElementById('memo-list');
      var lastMemoId = memoList.lastElementChild ? memoList.lastElementChild.id : '' ;
      var fetchButton = document.createElement('div');
      var currentTags = document.getElementById('current-tags');
      var currentTagsWrap = document.getElementById('current-tags-wrap');
      var tag = "";
      fetchButton.textContent = '加载更多';
      fetchButton.className = 'fetch-button';
      function fetchPrev() {
        var params = { prev: lastMemoId };
        if (tag)  params.tags = [tag];
        fetch('/api/memo/list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        })
          .then(response => response.json())
          .then(data => {
            if (data.success && data.data.length > 0) {
              data.data.forEach(memo => {
                var article = document.createElement('article');
                article.id = memo._id;
                article.className = 'memo-item';
                article.innerHTML = "<time><a href='/m/" + memo._id + "' target='_blank'>" + memo.time + "</a></time>" + "<div class='markdown-body'>" + memo.content + "</div>" + "<p class='tag'>" + memo.tags.join('') + "</p>";
                memoList.appendChild(article);
              });
              lastMemoId = data.data[data.data.length - 1]._id;
            } else {
              fetchButton.textContent = '没有更多了';
              fetchButton.disabled = true;
            }
          })
          .catch(error => {
            console.error('Invalid get memo list:', error);
          });
      };
      
      fetchButton.onclick = fetchPrev;
      memoList.parentNode.insertBefore(fetchButton, memoList.nextSibling);

    document.getElementById('memo-list').addEventListener('click', function(event) {
      if (event.target && event.target.className === 'tag-item') {
        tag = event.target.textContent.replace('#', '');
        currentTags.textContent = tag;
        currentTagsWrap.style.display = 'block';
        filterMemosByTag();
      }
    });

    function filterMemosByTag() {
      fetch('/api/memo/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tags: [tag] }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          memoList.innerHTML = '';
          data.data.forEach(memo => {
            var article = document.createElement('article');
            article.id = memo._id;
            article.className = 'memo-item';
            article.innerHTML = "<time><a href='/m/" + memo._id + "' target='_blank'>" + memo.time + "</a></time>" + "<div class='markdown-body'>" + memo.content + "</div>" + "<p class='tag'>" + memo.tags.join('') + "</p>";
            memoList.appendChild(article);
          });
          lastMemoId = data.data.length > 0 ? data.data[data.data.length - 1]._id : null;
          fetchButton.textContent = '加载更多';
          fetchButton.disabled = false;
        } else {
          memoList.innerHTML = '';
        }
      })
      .catch(error => {
        console.error('Invalid get memo tag list:', error);
      });
    }

    currentTags.onclick = function() {
      currentTagsWrap.style.display = 'none';
      memoList.innerHTML = '';
      lastMemoId = "";
      tag = "";
      fetchPrev();
    }
    </script>
  `

  return (
    <Layout>
      <div>
        <div id="current-tags-wrap" class={currentTagsWrapClass}>
          <span>当前选择标签：</span>
          <span id="current-tags" class={currentTagsClass}></span>
        </div>
        <Style>{markdownBodyClass}</Style>
        <div id="memo-list">
          {props.memos.map((item: any) => {
            return (
              <article class="memo-item" id={item._id}>
                <time><a href={`/m/${item._id}`} target="_blank">{item.time}</a></time>
                <div className="markdown-body" dangerouslySetInnerHTML={{ __html: item.content }}></div>
                <p class="tag" dangerouslySetInnerHTML={{ __html: item.tags.join('') }}></p>
              </article>
            )
          })}
        </div>
      </div>
      { fetchPrevList() }
    </Layout>
  )
}

export default Index
