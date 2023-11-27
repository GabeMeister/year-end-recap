import { faCheck, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import copy from "copy-to-clipboard";
import { useRef, useState } from "react";

type ClipboardCopyInputProps = {
  text: string;
};

export default function ClipboardCopyInput({ text }: ClipboardCopyInputProps) {
  const ref = useRef<any>();
  const [copied, setCopied] = useState(false);

  return (
    <div className="border-[1px] border-white rounded-md flex">
      <input
        readOnly
        ref={ref}
        className="w-full overflow-hidden p-1 mx-2 bg-transparent outline-none"
        type="text"
        value={window.location.href}
        onFocus={() => {
          ref?.current?.select();
        }}
      />
      <div
        className="bg-gray-700 py-1 px-2 rounded-r-md cursor-pointer flex items-center justify-center"
        onClick={() => {
          copy(text);
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
          }, 2000);
        }}
      >
        {copied ? (
          <FontAwesomeIcon className="h-4 w-4 text-green-500" icon={faCheck} />
        ) : (
          <FontAwesomeIcon className="h-4 w-4" icon={faCopy} />
        )}
      </div>
    </div>
  );
}
