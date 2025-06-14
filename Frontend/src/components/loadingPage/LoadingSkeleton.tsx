import { Card } from "@/components/ui/card";

const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {[...Array(5)].map((_, i) => (
        <Card key={i} className="p-2 h-20 bg-gray-50 dark:bg-gray-800">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </Card>
      ))}
    </div>
    <div className="rounded-md border border-gray-200 dark:border-gray-700">
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
  </div>
);

export default LoadingSkeleton;
