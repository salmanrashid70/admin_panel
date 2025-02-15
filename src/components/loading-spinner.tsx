export function LoadingSpinner() {
  return (
    <div className="grid h-screen place-items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900" />
    </div>
  );
}
