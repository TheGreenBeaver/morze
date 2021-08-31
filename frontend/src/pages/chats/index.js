import Chats from './chats';
import ChatsContext from '../../contexts/chats-context';

function WrappedChats() {
  return (
    <ChatsContext>
      <Chats />
    </ChatsContext>
  );
}
export default WrappedChats;