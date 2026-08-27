import DOMPurify from "dompurify";

// Renders Typing-question answers (student-authored HTML from the Tiptap
// editor). The client never trusts stored `answerText` at render time —
// save-answer only validates it as a string server-side, so a crafted
// payload sent directly to the API (bypassing the editor) could otherwise
// carry a script/onerror payload into any admin/faculty review screen that
// renders it via dangerouslySetInnerHTML.
export function sanitizeAnswerHtml(html: string): string {
    return DOMPurify.sanitize(html, { ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'blockquote', 'code'] });
}
