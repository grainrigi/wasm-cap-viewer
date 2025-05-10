import { useFeatures } from './useFeatures';
import { WebAssemblyFeatureSupportTable } from './WebAssemblyFeatureSupportTable';



const App: React.FC = () => {
  const features = useFeatures();

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* Table title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
        WebAssembly Capability Viewer
      </h1>
      <WebAssemblyFeatureSupportTable features={features} />
      <p className="text-xs text-gray-500 mt-4 text-center">
        Powered by <a href="https://github.com/GoogleChromeLabs/wasm-feature-detect">wasm-feature-detect</a>
      </p>
    </div>
  );
};

export default App
