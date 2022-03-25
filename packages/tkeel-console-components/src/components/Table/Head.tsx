import { Box, StyleProps, Th, Thead, Tr } from '@chakra-ui/react';
import { HeaderGroup } from 'react-table';

type Props<D extends object> = {
  headerGroups: HeaderGroup<D>[];
  fixHead: boolean;
  canSort: boolean;
  isShowStripe: boolean;
  styles?: {
    head?: StyleProps;
    tr?: StyleProps;
  };
};

function Head<D extends object>({
  headerGroups,
  fixHead,
  canSort,
  isShowStripe,
  styles,
}: Props<D>) {
  return (
    <Thead
      backgroundColor={isShowStripe ? 'gray.100' : 'transparent'}
      {...styles?.head}
    >
      {headerGroups.map((headerGroup) => {
        return (
          // eslint-disable-next-line react/jsx-key
          <Tr
            {...headerGroup.getHeaderGroupProps()}
            height="34px"
            borderBottom="1px"
            borderColor={isShowStripe ? 'transparent' : 'grayAlternatives.50'}
            {...styles?.tr}
          >
            {headerGroup.headers.map((column: HeaderGroup<D>) => {
              const headerProps = column.getHeaderProps(
                canSort ? column.getSortByToggleProps() : {}
              );

              let sortIcon = '';
              if (column.isSorted) {
                sortIcon = column.isSortedDesc ? ' 🔽' : ' 🔼';
              }

              return (
                // eslint-disable-next-line react/jsx-key
                <Th
                  display="flex"
                  alignItems="center"
                  height="100%"
                  padding="0 20px"
                  position={fixHead ? 'sticky' : 'static'}
                  color="grayAlternatives.400"
                  fontSize="12px"
                  border="none"
                  {...headerProps}
                >
                  {column.render('Header')}
                  {canSort && <Box>{sortIcon}</Box>}
                </Th>
              );
            })}
          </Tr>
        );
      })}
    </Thead>
  );
}

export default Head;
