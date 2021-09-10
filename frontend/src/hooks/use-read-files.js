import { useDispatch } from 'react-redux';
import { readFilesGeneric } from '../util/misc';
import { setModalContent } from '../store/actions/general';
import FileErrorsModal from '../components/modals/file-errors-modal';


function useReadFiles() {
  const dispatch = useDispatch();

  function readFiles(files, onRead) {
    readFilesGeneric(
      files,
      onRead,
      errors => dispatch(setModalContent({
        title: 'Some files could not be loaded',
        body: <FileErrorsModal errors={errors} />
      }))
    );
  }

  return readFiles;
}

export default useReadFiles;