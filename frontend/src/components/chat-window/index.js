import ChatWindow from './chat-window';
import ChatWindowContext from '../../contexts/chat-window-context';

function WrappedChatWindow(props) {

  return (
    <ChatWindowContext chatId={props.chatId} idx={props.idx}>
      <ChatWindow {...props} />
    </ChatWindowContext>
  )
}

WrappedChatWindow.propTypes = ChatWindow.propTypes;

export default WrappedChatWindow;