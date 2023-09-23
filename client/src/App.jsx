import React, { useState } from 'react'
import CodeMirror, { ViewUpdate } from '@uiw/react-codemirror';
import { oneDarkTheme } from '@uiw/react-codemirror';
import { javaLanguage } from '@codemirror/lang-java';
import fileDownload from 'js-file-download';
import './App.css'


function App() {

  const [code, setCode] = useState('');
  const [out, setOut] = useState('');
  const [cst, setCst] = useState('');
  const [ast, setAst] = useState('');

  const onChange = React.useCallback((value, ViewUpdate) => {
    setCode(value);
  }, []);


  const handleClick = () => {
    fetch('http://localhost:3000/analyze', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        "code": code
      })
    }).then(res => res.json())
    .then(data => {
      setOut(data.console);
      setCst(data.cst);
      setAst(data.ast);
    });
  }

  const handleGenerate = () => {
    console.log(cst);
    console.log();
    console.log(ast);

    fileDownload(cst, "cst.dot");
    fileDownload(ast, "ast.dot");
    
  }

  return (
    <div className='container'>
      <div className="editors">
        <CodeMirror
          className='cm1'
          width='100%'
          height='100%'
          theme={oneDarkTheme}
          extensions={[javaLanguage]}
          onChange={onChange}
        />

        <CodeMirror
          className='cm2'
          value={out}
          width='100%'
          height='100%'
          readOnly='true'
          theme={oneDarkTheme}
        />
      </div>
      <div className='button'>
          <button className='btn1' onClick={handleClick}> Analyze </button>
          <button className='btn2' onClick={handleGenerate}> Generate Tree </button>
      </div>
    </div>
  )
}

export default App;
