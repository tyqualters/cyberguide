'use client';

import MDEditor from '@uiw/react-md-editor';

export default function MarkdownEditor({
    value,
    onChange,
    disabled,
}: {
    value: string;
    onChange: (val: string | undefined) => void;
    disabled?: boolean;
}) {
    return (
        <div
            style={{
                height: 'calc(100vh - 20em)',
                minHeight: '300px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                opacity: disabled ? 0.6 : 1,
                pointerEvents: disabled ? 'none' : 'auto',
            }}
        >
            <MDEditor
                value={value}
                onChange={onChange}
                style={{ flexGrow: 1, minHeight: 0 }}
                textareaProps={{ style: { height: '100%' } }}
            />
        </div>
    );
}
