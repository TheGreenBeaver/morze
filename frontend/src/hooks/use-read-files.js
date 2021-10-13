import { useDispatch } from 'react-redux';
import { readFilesGeneric } from '../util/misc';
import { pushModal } from '../store/actions/general';
import FileErrorsModal from '../components/modals/file-errors-modal';


function useReadFiles() {
  const dispatch = useDispatch();

  function readFiles(files, onRead, availableExt) {
    readFilesGeneric(
      files,
      onRead,
      errors => dispatch(pushModal({
        title: 'Some files could not be loaded',
        body: <FileErrorsModal errors={errors} />
      })),
      availableExt
    );
  }

  return readFiles;
}

export default useReadFiles;