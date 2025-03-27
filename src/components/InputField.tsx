import React, { useState, useRef, useEffect } from 'react';

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
        className="text-sm md:text-base flex-1 basis-4/5 p-2 border border-gray-300 rounded resize-none overflow-hidden leading-relaxed dark:bg-gray-800 dark:text-white dark:border-gray-600"
        placeholder="メモを入力してください"
      />
      <button
        onClick={handleClick}
        className="text-xs md:text-sm basis-1/5 bg-black text-white font-bold rounded px-4 h-[40px] hover:bg-gray-600 dark:bg-white dark:text-black dark:hover:bg-gray-200 whitespace-nowrap"
      >
        追加
      </button>
    </div>
  );
}

export default InputField;
