import MarkdownPreview from "./MarkdownPreview";

function MarkdownEditor({ value, onChange }) {
    return (
        <div>
            <div>
                <h3>Markdown</h3>

                <textarea
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder="Write your article in Markdown..."
                    rows={20}
                />
            </div>

            <div>
                <h3>Preview</h3>

                <MarkdownPreview content={value} />
            </div>
        </div>
    );
}

export default MarkdownEditor;