export function Toast({ message }: { message: string }) {
  return <div role="status">{message}</div>;
}

export function ConfirmDialog({ title }: { title: string }) {
  return <div role="dialog">Confirm: {title}</div>;
}
