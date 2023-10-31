import Chat from "./chat/page";

export default function Home() {
  return (
    <main className="flex !bg-white min-h-screen flex-col items-center justify-between p-24">
      <Chat />
    </main>
  );
}
