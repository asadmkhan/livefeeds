type ErrorMessageProps = {
  msg: string;
};

export default function ErrorMessage({ msg }: ErrorMessageProps) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-2 rounded-lg shadow-md">
      {msg}
    </div>
  );
}
