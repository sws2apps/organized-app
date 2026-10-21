import { RowPagesType } from './index.types';

// a row opens or closes the table when its neighbour sits on another page
const rowEdges = (ids: string[], index: number, rowPages?: RowPagesType) => {
  const page = rowPages?.[ids[index]];

  return {
    overlap: index > 0,
    first: index === 0 || rowPages?.[ids[index - 1]] !== page,
    last: index === ids.length - 1 || rowPages?.[ids[index + 1]] !== page,
  };
};

export default rowEdges;
