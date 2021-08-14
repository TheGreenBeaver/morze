import { general } from './action-types';


const setError = error => ({
  type: general.SET_ERROR,
  error,
});

const clearError = () => setError(null);

/**
 * @typedef ModalContent
 * @type {Object}
 * @property {string} title
 * @property {object} body
 */
/**
 *
 * @param {ModalContent|null} modalContent
 * @returns {{modalContent, type: string}}
 */
const setModalContent = modalContent => ({
  type: general.SET_MODAL_CONTENT,
  modalContent
});

const closeModal = () => setModalContent(null);

export {
  setError,
  clearError,
  setModalContent,
  closeModal
};