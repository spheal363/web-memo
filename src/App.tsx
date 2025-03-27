import './globals.css';
import React, { useState, useRef, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { SlDocs } from "react-icons/sl";
import { AiOutlineEdit } from "react-icons/ai";

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
    <div className="flex gap-2 my-4 w-2/3 md:w-1/3 mx-auto items-end">
      <textarea
        ref={textareaRef}
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        className="text-sm md:text-base flex-1 basis-4/5 p-2 border border-gray-300 rounded resize-none overflow-hidden leading-relaxed"
        placeholder="メモを入力してください"
      />
      <button
        onClick={handleClick}
        className="text-xs md:text-sm basis-1/5 bg-black text-white font-bold rounded px-4 h-[40px] hover:bg-gray-600 whitespace-nowrap"
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
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>('');
  const [expandedMemos, setExpandedMemos] = useState<boolean[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const editingTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setExpandedMemos(Array(memos.length).fill(false));
  }, [memos]);

  useEffect(() => {
    if (editingTextareaRef.current) {
      editingTextareaRef.current.style.height = 'auto';
      editingTextareaRef.current.style.height = `${editingTextareaRef.current.scrollHeight}px`;
    }
  }, [editingText]);

  function handleDelete(index: number) {
    setMemos((prevMemos) => prevMemos.filter((_, i) => i !== index));
  }

  function copyTextToClipboard(text: string, index: number) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    }).catch((err) => {
      console.error('Async: Could not copy text: ', err);
    });
  }

  function handleDoubleClick(index: number, text: string) {
    setEditingIndex(index);
    setEditingText(text);
  }

  function handleEditSave(index: number) {
    if (editingText.trim() !== '') {
      setMemos((prevMemos) =>
        prevMemos.map((memo, i) => (i === index ? editingText : memo))
      );
    }
    setEditingIndex(null);
    setEditingText('');
  }

  function handleCancelEdit() {
    setEditingIndex(null);
    setEditingText('');
  }

  function toggleExpand(index: number) {
    setExpandedMemos((prev) =>
      prev.map((val, i) => (i === index ? !val : val))
    );
  }

  return (
    <div className="w-2/3 md:w-1/3 mx-auto my-4">
      <ul className="grid grid-cols-1 gap-2 auto-rows-auto">
        {memos.map((memo, index) => (
          <li key={index} className="border p-2 rounded shadow flex flex-col">
            {editingIndex === index ? (
              <textarea
                ref={editingTextareaRef}
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                className="text-sm md:text-base w-full p-1 border rounded resize-none mb-2 overflow-hidden"
                autoFocus
              />
            ) : (
              <>
                <span
                  onDoubleClick={() => handleDoubleClick(index, memo)}
                  className={`text-sm md:text-base whitespace-pre-wrap break-words mb-2 cursor-pointer ${expandedMemos[index] ? '' : 'line-clamp-2'}`}
                >
                  {memo}
                </span>
                {(memo.length > 40 || memo.split('\n').length > 3) && (
                  <button
                    onClick={() => toggleExpand(index)}
                    className="text-xs text-blue-600 hover:underline self-start mb-2"
                  >
                    {expandedMemos[index] ? '閉じる' : 'もっと見る'}
                  </button>
                )}
              </>
            )}

            <div className="flex justify-between mt-auto">
              {editingIndex === index ? (
                <>
                  <button
                    onClick={() => handleEditSave(index)}
                    className="text-sm bg-green-500 text-white px-2 py-1 rounded hover:bg-green-400"
                  >
                    更新
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="text-sm bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-300"
                  >
                    キャンセル
                  </button>
                </>
              ) : (
                <>
                  <div className="relative flex items-center gap-2">
                    <button
                      onClick={() => copyTextToClipboard(memo, index)}
                      className="text-sm bg-blue-400 text-white px-2 py-1 rounded hover:bg-blue-300"
                    >
                      <SlDocs />
                    </button>
                    {copiedIndex === index && (
                      <span className="absolute -right-12 text-green-600 text-xs font-bold">
                        Copied!
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-sm bg-red-400 text-white px-2 py-1 rounded hover:bg-red-300"
                  >
                    <FaTrash />
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  const [memos, setMemos] = useState<string[]>(() => {
    const stored = localStorage.getItem('memos');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    const storedMemos = localStorage.getItem('memos');
    if (storedMemos) {
      setMemos(JSON.parse(storedMemos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('memos', JSON.stringify(memos));
  }, [memos]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-center my-4">
        <div className="flex items-center justify-center gap-2 text-2xl font-bold my-4">
          <AiOutlineEdit />
          WEBメモ帳
        </div>
      </h1>
      <p className="text-center text-sm md:text-base mb-4 text-gray-500">
        ※メモはダブルクリックで編集できます
      </p>
      <InputField setMemos={setMemos} />
      <Memo memos={memos} setMemos={setMemos} />
    </div>
  );
}
