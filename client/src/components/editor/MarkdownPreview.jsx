import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeSanitize from "rehype-sanitize";

function MarkdownPreview({ content }) {
    return (
        <div className="markdown-preview">
            <ReactMarkdown
                rehypePlugins={[rehypeSanitize]}
                components={{
                    code({
                        inline,
                        className,
                        children,
                        ...props
                    }) {
                        const match = /language-(\w+)/.exec(
                            className || ""
                        );

                        if (!inline && match) {
                            return (
                                <SyntaxHighlighter
                                    style={oneDark}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                            );
                        }

                        return (
                            <code
                                className={className}
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}

export default MarkdownPreview;