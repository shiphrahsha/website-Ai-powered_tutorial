import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import '../Dashboard/CodingPlatform.css';

const CodingPlatform = ({navigate}) => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);

  const goBack = () => {
    navigate('dashboard');
  };

  const runCode = async () => {
    try {
      const response = await fetch('https://your-backend-api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code }),
      });

      const result = await response.json();
      setOutput(response.ok ? result.output : result.error);
    } catch (error) {
      setOutput('An error occurred: ' + error.message);
    }
  };


  return (
    <div className="coding-container">
        <button onClick={goBack} className="back-button">Back</button>

      {questionIndex !== 'submitted' && (
        <div className="coding-content">
          <div className="code-editor-section">
            <div className="editor-header">
              <label htmlFor="language-select">Select Language:</label>
              <select
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python 3</option>
                <option value="java">Java</option>
                <option value="php">PHP</option>
              </select>
            </div>
            <Editor
              height="60vh"
              language={language}
              value={code}
              onChange={(value) => setCode(value)}
              theme="vs-dark"
            />
            <div className="button-group">
              <button onClick={runCode} className="run-button">Run Code</button>
              <button className="submit-button">Submit Answer</button>
            </div>
          </div>
          <div className="output-section">
            <h3>Output:</h3>
            <pre className="output">{output}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodingPlatform;