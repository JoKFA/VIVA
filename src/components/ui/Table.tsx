import React from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  hoverable?: boolean;
  striped?: boolean;
}

export default function Table<T extends Record<string, any>>({
  data,
  columns,
  className = '',
  hoverable = true,
  striped = false,
}: TableProps<T>) {
  const renderCell = (row: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    return row[column.accessor];
  };

  const getAlignment = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  return (
    <div className={`overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-soft ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={`px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider ${getAlignment(column.align)}`}
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`divide-y divide-gray-200 ${striped ? 'bg-white' : ''}`}>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`
                  ${hoverable ? 'hover:bg-gray-50 transition-colors duration-150' : ''}
                  ${striped && rowIndex % 2 === 1 ? 'bg-gray-50' : 'bg-white'}
                `}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-6 py-4 text-sm text-gray-900 ${getAlignment(column.align)}`}
                  >
                    {renderCell(row, column)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
