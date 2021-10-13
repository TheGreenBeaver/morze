function getSliceSizes(totalSize) {
  const sliceSizes = [];
  
  function makeFragments(size) {
    if (size <= 6) {
      sliceSizes.push(size);
      return;
    }

    const half = Math.ceil(size / 2);
    makeFragments(half);
    makeFragments(size - half);
  }

  makeFragments(totalSize);
  return sliceSizes.sort((a, b) => b - a); // descending
}

function getSlices(array) {
  const sliceSizes = getSliceSizes(array.length);
  let sliceStart = 0;
  return sliceSizes.map(sliceSize => {
    const oneSlice = array.slice(sliceStart, sliceStart + sliceSize);
    sliceStart += sliceSize;
    return oneSlice;
  });
}

export { getSlices };