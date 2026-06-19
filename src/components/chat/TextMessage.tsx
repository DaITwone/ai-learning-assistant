type TextMessageProps = {
  content: string;
};

export function TextMessage({ content }: TextMessageProps) {
  return (
    <p className="whitespace-pre-wrap text-sm leading-6">
      {content}
    </p>
  );
}