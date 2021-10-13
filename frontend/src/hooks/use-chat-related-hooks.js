import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useScreenIsSmall from './use-screen-is-small';
import { forceOpenChat, parseConfig } from '../util/chat-windows-config';
import useCommonStyles from '../theme/common';



function useChatRelatedHooks() {
  const history = useHistory();
  const { pathname } = useLocation();
  const chats = useSelector(state => state.chats);
  const screenIsSmall = useScreenIsSmall();
  const commonStyles = useCommonStyles();
  const dispatch = useDispatch();

  const chatWindowsConfig = pathname.split('/')[2];
  const { chatIds, rotationDegrees } =
    parseConfig(chatWindowsConfig, Object.keys(chats).map(key => +key), screenIsSmall);

  function goToChat(chatId) {
    history.push(forceOpenChat(chatIds, rotationDegrees, screenIsSmall, chatId));
  }

  return { goToChat, commonStyles, dispatch };
}

export default useChatRelatedHooks;