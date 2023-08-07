import DocumentList from '@/components/document-list';
import MainTextArea from '@/components/main-text-area';
import StorageContextProvider from '@/context/storage-context';


export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden flex flex-col items-center justify-between bg-slate-900 relative">
      <StorageContextProvider>
        <DocumentList />
        <MainTextArea />
      </StorageContextProvider>
    </main>
  )
}
