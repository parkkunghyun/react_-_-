import './App.css';
import { useState } from 'react';

function Header(props) {
  return (
    <h1><a href='/' onClick={(event) => {
      event.preventDefault()
      props.onChangeMode()
    }}>WEB</a></h1>
  )
}
function Nav(props) {
  const lis = []
  for(let i =0; i<props.topics.length; i++) {
    let t = props.topics[i]
    lis.push(<li key={t.id}><a id={t.id} href='{t.id}'
    onClick={(event)=> {
      event.preventDefault()
      props.onChangeMode(Number(event.target.id))
    }}
    >{t.title}</a></li>)
  }

  return (
    <nav>
        <ol>
          {lis}
        </ol>
      </nav>
  )
}
function Article(props) {
  return (
    <article>
        <h2>{props.title}</h2>
        {props.body}
      </article>
  )
}
function Create(props) {
  return (
    <article>
      <h2>Create</h2>
      <form onSubmit={(event)=> {
        //onSubmit하면 기본적으로 페이지가 자동 리로딩 되버림!
        event.preventDefault()
        const title = event.target.title.value;
        const body = event.target.body.value
        props.onCreate(title,body)

      }}>
        <p><input type="text" name="title" placeholder='title'></input></p>
        <p><textarea name="body" placeholder='body'></textarea></p>
        <input type='submit' value='create'></input>
      </form>
    </article>
  )

}
function Update(props) {
  const [title, setTitle] = useState(props.title)
  const [body, setBody] = useState(props.body)
  return (
    <article>
      <h2>UPDATE</h2>
      <form onSubmit={(event)=> {
        //onSubmit하면 기본적으로 페이지가 자동 리로딩 되버림!
        event.preventDefault()
        const title = event.target.title.value;
        const body = event.target.body.value
        props.onUpdate(title,body)

      }}>
        <p><input type="text" name="title" placeholder='title' value={title} onChange={(event)=> {
          //뭐누를때마다 변경됨!
          setTitle(event.target.value)
        }}></input></p>
        <p><textarea name="body" placeholder='body' value={body} onChange={(e)=> {
          setBody(e.target.value)
        }}></textarea></p>
        <input type='submit' value='update'></input>
      </form>
    </article>
  )
}

function App() {
  const [mode,setMode] = useState('WELCOME') //배열을 리턴하고 0번째는 값 1번째는 그상태변경함수!
  const [id, setId] = useState(null)
  const [nextId, setNextId] = useState(4)

  const [topics,setTopics] = useState([
    {id: 1, title:'html', body:'html is ~~'},
    {id: 2, title:'css', body:'css is ~~'},
    {id: 3, title:'JSdd', body:'JS is ~~'},
  ])
  let contextControl = null;
  let content = null

  if(mode === 'WELCOME') {
    content = <Article title="welcom" body="hello, web"></Article>
    
  } else if (mode === 'READ') {
    
    let title , body = null
    for(let i =0; i<topics.length; i++){
      if(topics[i].id === id) {
         title = topics[i].title
         body = topics[i].body
      }
    }
      content = <Article title= {title} body={body}></Article>
      contextControl = <>
      <li><a href={'/update/'+ id } onClick={(e)=> {
        e.preventDefault()
        setMode('UPDATE')
      }}>Update</a></li>
      <li><input type="button" value="Delete" onClick={()=>{
        const newTopics = []
        for(let i =0; i<topics.length; i++) {
          if(topics[i].id !== id) {
            newTopics.push(topics[i])
          }
        }
        setTopics(newTopics)
        setMode('WELCOME')
      }}></input></li>
      </>
  }
  else if(mode === 'CREATE') {
    content = <Create onCreate = {(title,body)=> {
      const newTopic = {id: nextId, title: title, body: body}
      const newTopics = [...topics]
      newTopics.push(newTopic)
      setTopics(newTopics)

      setMode('READ')
      setId(nextId)
      setNextId(nextId + 1)
    }}></Create>
  } else if(mode === 'UPDATE') {
    let title , body = null
    for(let i =0; i<topics.length; i++){
      if(topics[i].id === id) {
         title = topics[i].title
         body = topics[i].body
      }
    }
      content = <Update title={title} body={body} onUpdate={(title,body)=> {
        const newTopics = [...topics]
        const updateTopic = {id:id, title:title, body:body }
        
        for(let i =0; i<newTopics.length; i++) {
          if(newTopics[i].id === id) {
            newTopics[i] = updateTopic
            break
          }
        }
        setTopics(newTopics)
        setMode('READ')
      
      }}></Update>
  }
  return (
    <div>
      <Header onChangeMode={()=> setMode('WELCOME')}></Header>
      
      <Nav topics = {topics} 
      onChangeMode = {(_id)=> {
        setMode('READ')
        setId(_id) 
        }}>
      </Nav>

      {content}
      <ul>
      <li>
        <a href='/create' onClick={(event)=>
         {event.preventDefault()
        setMode('CREATE')
        }}>CREATE </a>
      </li>
        {contextControl}
      </ul>
    </div>
  );
}

export default App;
