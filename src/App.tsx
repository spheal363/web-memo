import React from 'react';
import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import './App.css';

function InputField({ setMemos }: { setMemos: React.Dispatch<React.SetStateAction<string[]>> }) {
  const [memo, setMemo] = useState<string>('');
  function handleClick() {
    if (memo.trim() !== '') {
      setMemos((prevMemos) => [...prevMemos, memo]);
      setMemo('');
    }
  }

  return (
    <div>
      <input
        type="text"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
      />
      <button onClick={handleClick}>追加</button>
    </div>
  );
}

function Memo({
  memos,
  setMemos,
}: {
  memos: string[];
  setMemos: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  function handleDelete(index: number) {
    setMemos((prevMemos) => prevMemos.filter((_, i) => i !== index));
  }
  function copyTextToClipboard(text: string) {
    navigator.clipboard.writeText(text)
      .then(function () {
        console.log('Async: Copying to clipboard was successful!');
      }, function (err) {
        console.error('Async: Could not copy text: ', err);
      });
  }

  return (
    <div>
      <ul>
        {memos.map((memo, index) => (
          <li key={index}>
            {memo}
            <button onClick={() => copyTextToClipboard(memo)}>
              Copy!
            </button>
            <button onClick={() => handleDelete(index)}>
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  const [memos, setMemos] = useState<string[]>([]);

  return (
    <div>
      <h1>WEBメモ帳</h1>
      <InputField setMemos={setMemos} />
      <Memo memos={memos} setMemos={setMemos} />
    </div>
  );
}
