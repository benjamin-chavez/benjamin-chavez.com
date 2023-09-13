// src/components/code-block-title.tsx

import 'server-only';
import CodeCopyButton from './code-copy-button';

const CodeBlockTitle = ({ ...props }) => {
  return (
    <div className="flex p-0">
      <div className="code-header flex h-12 w-full items-center justify-between  rounded-t-lg border-b !border-b-gray-700 bg-red-800 px-4 py-3 font-mono text-sm font-medium text-neutral-200">
        {props.title}
        <CodeCopyButton text={props.__rawstring__} isTitle />
      </div>
    </div>
  );
};

export default CodeBlockTitle;
