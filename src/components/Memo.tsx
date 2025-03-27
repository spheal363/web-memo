import React, { useState, useEffect, useRef } from 'react';
import { FaTrash } from 'react-icons/fa';
import { SlDocs } from "react-icons/sl";

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
          <li key={index} className="border p-2 rounded shadow flex flex-col dark:border-gray-600 dark:bg-gray-800">
            {editingIndex === index ? (
              <textarea
                ref={editingTextareaRef}
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                className="text-sm md:text-base w-full p-1 border rounded resize-none mb-2 overflow-hidden dark:bg-gray-700 dark:text-white dark:border-gray-500"
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
                    className="text-xs text-blue-600 hover:underline self-start mb-2 dark:text-blue-400"
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

export default Memo;
