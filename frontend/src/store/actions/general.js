import { general } from './action-types';


const setError = error => ({
  type: general.SET_ERROR,
  error,
});

const clearError = () => setError(null);

/**
 * @typedef ModalContent
 * @type {Object}
 * @property {string|undefined} title
 * @property {object} body
 */
/**
 *
 * @param {ModalContent|null} modalContent
 * @returns {{modalContent, type: string}}
 */
const pushModal = modalContent => ({
  type: general.PUSH_MODAL,
  modalContent
});

const closeModal = () => ({
  type: general.CLOSE_MODAL
});

const setSidebarOpen = open => ({
  type: general.SET_SIDEBAR_OPEN,
  open
});

export {
  setError,
  clearError,
  pushModal,
  closeModal,
  setSidebarOpen
};