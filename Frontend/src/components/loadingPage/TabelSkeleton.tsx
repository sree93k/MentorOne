const TableSkeleton = () => (
  <div className="rounded-md border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50 dark:bg-gray-800">
            {[...Array(7)].map((_, i) => (
              <th key={i} className="px-4 py-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, i) => (
            <tr key={i} className="border-b">
              {[...Array(7)].map((_, j) => (
                <td key={j} className="px-4 py-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default TableSkeleton;
