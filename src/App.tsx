import './globals.css';
import React, { useState, useRef, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { SlDocs } from "react-icons/sl";

function InputField({ setMemos }: { setMemos: React.Dispatch<React.SetStateAction<string[]>> }) {
  const [memo, setMemo] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [memo]);

  function handleClick() {
    if (memo.trim() !== '') {
      setMemos((prevMemos) => [...prevMemos, memo]);
      setMemo('');
    }
  }

  return (
    <div className="flex gap-2 my-4 w-1/3 mx-auto items-end">
      <textarea
        ref={textareaRef}
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        className="flex-1 basis-4/5 p-2 border border-gray-300 rounded resize-none overflow-hidden leading-relaxed"
        placeholder="メモを入力してください"
      />
      <button
        onClick={handleClick}
        className="basis-1/5 bg-black text-white font-bold rounded px-4 h-[40px] hover:bg-gray-600"
      >
        追加
      </button>


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
    <div className="w-2/3 mx-auto my-4">
      <ul className="grid grid-cols-2 gap-2">
        {memos.map((memo, index) => (
          <li key={index} className="border p-2 rounded shadow flex flex-col justify-between">
            <span className="whitespace-pre-wrap break-words flex-1 mb-2">{memo}</span>
            <div className="flex justify-between">
              <button
                onClick={() => copyTextToClipboard(memo)}
                className="text-sm bg-blue-400 text-white px-2 py-1 rounded hover:bg-blue-300"
              >
                <SlDocs />
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="text-sm bg-red-400 text-white px-2 py-1 rounded hover:bg-red-300"
              >
                <FaTrash />
              </button>
            </div>
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
      <h1 className="text-2xl font-bold text-center my-4">
        WEBメモ帳
      </h1>
      <InputField setMemos={setMemos} />
      <Memo memos={memos} setMemos={setMemos} />
    </div>
  );
}
