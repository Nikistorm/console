/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable react/jsx-key */
import { Row, TableBodyPropGetter, TableBodyProps } from 'react-table';
import { Tbody, Td, Text, Tr } from '@chakra-ui/react';

type Props<D extends object> = {
  page: Row<D>[];
  getTableBodyProps: (
    propGetter?: TableBodyPropGetter<D> | undefined
  ) => TableBodyProps;
  prepareRow: (row: Row<D>) => void;
  scroll:
    | {
        y: string;
      }
    | undefined;
  isShowStripe: boolean;
};

type BodyStyle = {
  height: string;
  overflowY: string;
};

function Body<D extends object>({
  page,
  getTableBodyProps,
  prepareRow,
  scroll,
  isShowStripe,
}: Props<D>) {
  const bodyStyle = {};
  if (scroll && scroll.y) {
    (bodyStyle as BodyStyle).height = scroll.y;
    (bodyStyle as BodyStyle).overflowY = 'scroll';
  }

  return (
    <Tbody {...bodyStyle} {...getTableBodyProps()}>
      {page.map((row, i) => {
        prepareRow(row);
        let backgroundColor = 'transparent';
        if (isShowStripe && i % 2 === 1) {
          backgroundColor = 'gray.50';
        }
        return (
          <Tr backgroundColor={backgroundColor} {...row.getRowProps()}>
            {row.cells.map((cell) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const funcName = (cell.column.Cell as any).name;
              return (
                <Td
                  display="flex"
                  alignItems="center"
                  height="40px"
                  padding="0 10px"
                  color="grayAlternatives.300"
                  fontSize="14px"
                  borderColor={
                    isShowStripe ? 'transparent' : 'grayAlternatives.50'
                  }
                  {...cell.getCellProps()}
                >
                  {funcName === 'defaultRenderer' ? (
                    <Text title={String(cell.value)} isTruncated>
                      {cell.value}
                    </Text>
                  ) : (
                    cell.render('Cell')
                  )}
                </Td>
              );
            })}
          </Tr>
        );
      })}
    </Tbody>
  );
}

export default Body;
