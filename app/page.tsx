import LeftSidebar from '@/components/leftSidebar/LeftSidebar';
import MainChatArea from '@/components/mainChatArea/MainChatArea';



export default function Home() {
  return (
    <div className="flex h-screen mx-auto bg-white max-h-screen overflow-hidden">
      <LeftSidebar />
      <div className='flex-1 overflow-y-auto'>
        <MainChatArea />
      </div>
    </div>
  );
}
