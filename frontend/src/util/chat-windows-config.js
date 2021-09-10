/* eslint-disable default-case */
import { CHAT_WINDOWS_CONFIG, LINKS } from './constants';
import { cloneDeep, isEqual } from 'lodash';


/**
 *
 * @param {Array<Array<any>>} matrix
 * @returns {Array<Array<any>>}
 */
function rotate90Clockwise(matrix) {
  const height = matrix.length;
  const width = matrix[0].length;

  const result = new Array(height);
  for (let i = 0; i < width; i++) {
    result[i] = new Array(width);
  }

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      result[i][j] = cloneDeep(matrix[height - j - 1][i]);
    }
  }

  return result;
}

/**
 *
 * @param {Array<Array<any>>} matrix
 * @param {number} n
 * @returns {Array<Array<any>>}
 */
function rotateNClockwise(matrix, n) {
  const times = n / 90;
  let currentMatrix = cloneDeep(matrix);
  for (let i = 0; i < times; i++) {
    currentMatrix = cloneDeep(rotate90Clockwise(currentMatrix));
  }

  return currentMatrix;
}

/**
 *
 * @param {number} rotationDegrees
 * @param {number} slotsAmount
 * @returns {string}
 */
function makeTemplateFromRotation(rotationDegrees, slotsAmount) {
  const { baseAreaName } = CHAT_WINDOWS_CONFIG;
  const areaNames = [...Array(5)].map((_, idx) => `${baseAreaName}${idx + 1}`);
  let matrix;
  switch (slotsAmount) {
    case 1:
      matrix = [
        [0, 0],
        [0, 0]
      ];
      break;
    case 2:
      matrix = [
        [0, 1],
        [0, 1]
      ];
      break;
    case 3:
      matrix = [
        [0, 1],
        [0, 2]
      ];
      break;
    case 4:
      matrix = [
        [0, 1],
        [2, 3]
      ];
  }

  const rotatedMatrix = rotateNClockwise(matrix, rotationDegrees);
  const getRow = row => rotatedMatrix[row].map(areaIdx => areaNames[areaIdx]).join(' ');
  return `"${getRow(0)}" "${getRow(1)}"`;
}

/**
 *
 * @param {string|undefined} config
 * @param {Array<number>} availableChatIds
 * @param {boolean} screenIsSmall
 * @returns {{ redirect: string=, chatIds: Array<number|null>=, template: string=, rotationDegrees: number= }}
 */
function parseConfig(config, availableChatIds, screenIsSmall) {
  if (config === undefined) {
    return {
      chatIds: [],
      rotationDegrees: 0
    };
  }

  if (!Object.values(CHAT_WINDOWS_CONFIG.patterns).some(pattern => pattern.test(config))) {
    return { redirect: LINKS.chats };
  }

  const [chatIdsConfig, rotationConfig] = config.split('&');
  const chatIds = chatIdsConfig
    .split('=')[1]
    .split(',')
    .map(strId => strId === '_' ? null : +strId);

  const slotsAmount = chatIds.length;
  const acceptedChatIds = chatIds.map(id => availableChatIds.includes(id) ? id : null);

  const unnecessaryRotation = (slotsAmount === 1 || screenIsSmall) && !!rotationConfig;
  const invalidIds = !isEqual(acceptedChatIds, chatIds);
  const smallScreenLargeConfig = screenIsSmall && !CHAT_WINDOWS_CONFIG.patterns.small.test(config);

  if (unnecessaryRotation || invalidIds || smallScreenLargeConfig) {
    const newRotationConfig = unnecessaryRotation ? '' : `&${rotationConfig}`;
    const newChatIdsConfig = `id=${makeChatIdsConfig(smallScreenLargeConfig
      ? acceptedChatIds.slice(0, 2)
      : acceptedChatIds
    )}`;

    return { redirect: `${LINKS.chats}/${newChatIdsConfig}${newRotationConfig}` };
  }

  const defaultRotation = screenIsSmall ? 90 : 0;
  const rotationDegrees = rotationConfig ? +(rotationConfig.split('=')[1]) : defaultRotation;
  const template = makeTemplateFromRotation(rotationDegrees, slotsAmount);

  return { chatIds, template, rotationDegrees };
}

function makeChatIdsConfig(chatIds) {
  return chatIds
    .map(id => id == null ? '_' : id)
    .join(',');
}

function makeRotationConfig(rotation, chatIds, screenIsSmall) {
  return rotation === 0 || chatIds.length === 1 || screenIsSmall ? '' : `&rotation=${rotation}`;
}

// a) Close the chat, leaving an empty slot
// b) Push it into the first available slot; if none are available, message
/**
 *
 * @param {Array<number|null>} currentChatIds
 * @param {number} currentRotation
 * @param {boolean} screenIsSmall
 * @param {number} chatId
 * @returns {{ redirect: string=, message: string= }}
 */
function addOrRemoveChat(
  currentChatIds, currentRotation, screenIsSmall,
  chatId
) {
  const rotationConfig = makeRotationConfig(currentRotation, currentChatIds, screenIsSmall);

  if (currentChatIds.includes(chatId)) {
    const emptySlot = currentChatIds.indexOf(chatId);
    const newChatIds = [...currentChatIds];
    newChatIds[emptySlot] = null;
    const newChatIdsConfig = makeChatIdsConfig(newChatIds);
    return {
      redirect: `${LINKS.chats}/id=${newChatIdsConfig}${rotationConfig}`
    };
  }

  const max = screenIsSmall ? CHAT_WINDOWS_CONFIG.maxSlots.small : CHAT_WINDOWS_CONFIG.maxSlots.large;
  const slotsAmount = currentChatIds.length;
  if (slotsAmount === max && !currentChatIds.some(slot => slot == null)) {
    return { message: 'You need to free some slot' };
  }

  const emptySlotIdx = currentChatIds.findIndex(slot => slot == null);
  const newChatIds = [...currentChatIds];
  if (emptySlotIdx === -1) {
    newChatIds.push(chatId);
  } else {
    newChatIds[emptySlotIdx] = chatId;
  }
  const newChatIdsConfig = makeChatIdsConfig(newChatIds);
  return {
    redirect: `${LINKS.chats}/id=${newChatIdsConfig}${rotationConfig}`
  };
}

/**
 *
 * @param {Array<number|null>} currentChatIds
 * @param {number} currentRotation
 * @param {boolean} screenIsSmall
 * @param {number} chatId
 * @param {number} newSlot
 * @returns string
 */
function insertOrMoveChat(
  currentChatIds, currentRotation, screenIsSmall,
  chatId, newSlot
) {
  const rotationConfig = makeRotationConfig(currentRotation, currentChatIds, screenIsSmall);

  const chatIsSelected = currentChatIds.includes(chatId);

  let newChatIds;
  if (!chatIsSelected) { // Replace smth in the slot or put in an empty one
    newChatIds = [...currentChatIds];
    newChatIds[newSlot] = chatId;
  } else { // Swap or move
    newChatIds = [...currentChatIds];
    const currentSlot = newChatIds.indexOf(chatId);
    newChatIds[currentSlot] = newChatIds[newSlot];
    newChatIds[newSlot] = chatId;
  }

  return `${LINKS.chats}/id=${makeChatIdsConfig(newChatIds)}${rotationConfig}`;
}

/**
 *
 * @param {Array<number|null>} currentChatIds
 * @param {number|null} chatId null if just a slot is added
 */
function addSlot(currentChatIds, chatId = null) {
  const newChatIds = [...currentChatIds, chatId];
  return `${LINKS.chats}/id=${makeChatIdsConfig(newChatIds)}`;
}

function removeSlot(currentChatIds, removedSlot) {
  const newChatIds = currentChatIds.filter((_, idx) => idx !== removedSlot);
  return `${LINKS.chats}/id=${makeChatIdsConfig(newChatIds)}`;
}

/**
 *
 * @param {Array<number|null>} currentChatIds
 * @param {number} currentRotation
 * @param {number} direction
 */
function rotate(currentChatIds, currentRotation, direction) {
  const chatIdsConfig = makeChatIdsConfig(currentChatIds);
  const raw = currentRotation + 90 * direction;
  let newRotation;
  if (raw > 270) {
    newRotation = 0;
  } else if (raw < 0) {
    newRotation = 270;
  } else {
    newRotation = raw;
  }

  return `${LINKS.chats}/id=${chatIdsConfig}${makeRotationConfig(newRotation, currentChatIds)}`;
}

export {
  parseConfig,

  addOrRemoveChat,
  insertOrMoveChat,
  addSlot,
  removeSlot,
  rotate
};