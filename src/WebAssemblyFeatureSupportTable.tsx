// Define the type for a WebAssembly feature
export interface WebAssemblyFeature {
  id: string; // Unique ID for React key
  name: string; // Display name of the feature
  description: string; // Brief description of the feature
  status: 'supported' | 'unsupported' | 'loading'; // Support status, now includes loading
  url: string; // URL for more information
}

// Component to render each feature row
interface FeatureRowProps {
  feature: WebAssemblyFeature;
}

// const FeatureRow: React.FC<FeatureRowProps> = ({ feature }) => {
//   // Determine text and background color based on support status
//   let statusColor = '';
//   let statusBgColor = '';
//   let statusText = feature.status.toUpperCase();
// 
//   switch (feature.status) {
//     case 'supported':
//       statusColor = 'text-green-600';
//       statusBgColor = 'bg-green-100';
//       break;
//     case 'unsupported':
//       statusColor = 'text-red-600';
//       statusBgColor = 'bg-red-100';
//       break;
//     case 'loading':
//       statusColor = 'text-yellow-600';
//       statusBgColor = 'bg-yellow-100';
//       statusText = 'LOADING...';
//       break;
//     default:
//       statusColor = 'text-gray-600';
//       statusBgColor = 'bg-gray-100';
//   }
// 
//   return (
//     <tr className="border-b border-gray-200 hover:bg-gray-50">
//       {/* Feature name and description cell */}
//       <td className="py-3 px-6 text-left">
//         <div className="font-medium text-gray-800">{feature.name}</div>
//         <div className="text-xs text-gray-500">{feature.description}</div>
//       </td>
//       {/* Status cell */}
//       <td className="py-3 px-6 text-center">
//         <span
//           className={`py-1 px-3 rounded-full text-xs font-semibold ${statusColor} ${statusBgColor}`}
//         >
//           {statusText}
//         </span>
//       </td>
//     </tr>
//   );
// };
const FeatureRow: React.FC<FeatureRowProps> = ({ feature }) => {
  // Determine text and background color based on support status
  let statusColor = '';
  let statusBgColor = '';
  let statusText = feature.status.toUpperCase();

  switch (feature.status) {
    case 'supported':
      statusColor = 'text-green-600';
      statusBgColor = 'bg-green-100';
      break;
    case 'unsupported':
      statusColor = 'text-red-600';
      statusBgColor = 'bg-red-100';
      break;
    case 'loading':
      statusColor = 'text-yellow-600';
      statusBgColor = 'bg-yellow-100';
      statusText = 'LOADING...';
      break;
    default:
      statusColor = 'text-gray-600';
      statusBgColor = 'bg-gray-100';
  }

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      {/* Feature name and description cell */}
      <td className="py-3 px-6 text-left">
        <div className="font-medium text-gray-800">
          {feature.url ? (
            <a
              href={feature.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-current no-underline"
            >
              {feature.name}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 inline-block ml-1 align-baseline"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          ) : (
            feature.name
          )}
        </div>
        <div className="text-xs text-gray-500">{feature.description}</div>
      </td>
      {/* Status cell */}
      <td className="py-3 px-6 text-center">
        <span
          className={`py-1 px-3 rounded-full text-xs font-semibold ${statusColor} ${statusBgColor}`}
        >
          {statusText}
        </span>
      </td>
    </tr>
  );
};

// Props for the WebAssemblyFeatureSupportTable component
interface WebAssemblyFeatureSupportTableProps {
  features: WebAssemblyFeature[];
}

// Component for the WebAssembly feature support status table
export const WebAssemblyFeatureSupportTable: React.FC<WebAssemblyFeatureSupportTableProps> = ({ features }) => {
  return (
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto">
          {/* Table header */}
          <thead className="bg-gray-100 border-b-2 border-gray-300">
            <tr>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Feature
              </th>
              <th className="py-3 px-6 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          {/* Table body */}
          <tbody className="text-gray-700">
            {features.map((feature) => (
              <FeatureRow key={feature.id} feature={feature} />
            ))}
            {/* Message if no features are available */}
            {features.length === 0 && (
              <tr>
                <td colSpan={2} className="py-4 px-6 text-center text-gray-500">
                  No features to display.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
  );
};