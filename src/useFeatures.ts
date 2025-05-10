import { useEffect, useState } from 'react';
import type { WebAssemblyFeature } from './WebAssemblyFeatureSupportTable';
import {
  bigInt,
  bulkMemory,
  exceptions,
  exceptionsFinal,
  extendedConst,
  gc,
  jsStringBuiltins,
  jspi,
  memory64,
  multiMemory,
  multiValue,
  mutableGlobals,
  referenceTypes,
  relaxedSimd,
  saturatedFloatToInt,
  signExtensions,
  simd,
  streamingCompilation,
  tailCall,
  threads,
  typeReflection,
  typedFunctionReferences
} from 'wasm-feature-detect';

type FeatureDef = Omit<WebAssemblyFeature, 'status'> & {
  detector: () => Promise<boolean>;
};

// Initial dummy data for WebAssembly features.
// Some features will start in a 'loading' state.
const featureDefs: FeatureDef[] = [
  {
    id: 'webAssembly',
    name: 'WebAssembly',
    description: 'The core WebAssembly feature.',
    detector: () => globalThis.WebAssembly ? Promise.resolve(true) : Promise.resolve(false),
    url: 'https://webassembly.org/'
  },
  {
    id: 'bigInt',
    name: 'BigInt integration',
    description: 'Integration with JavaScript BigInt type.',
    detector: bigInt,
    url: 'https://github.com/WebAssembly/JS-BigInt-integration'
  },
  {
    id: 'bulkMemory',
    name: 'Bulk memory operations',
    description: 'Efficient operations for large blocks of memory.',
    detector: bulkMemory,
    url: 'https://github.com/webassembly/bulk-memory-operations'
  },
  {
    id: 'exceptions',
    name: 'Legacy Exception Handling',
    description: 'Older proposal for exception handling.',
    detector: exceptions,
    url: 'https://github.com/WebAssembly/exception-handling'
  },
  {
    id: 'exceptionsFinal',
    name: 'Exception Handling with exnref',
    description: 'Current standard for exception handling using exnref.',
    detector: exceptionsFinal,
    url: 'https://github.com/WebAssembly/exception-handling'
  },
  {
    id: 'extendedConst',
    name: 'Extended Const Expressions',
    description: 'Allows more complex expressions in constant contexts.',
    detector: extendedConst,
    url: 'https://github.com/WebAssembly/extended-const'
  },
  {
    id: 'gc',
    name: 'Garbage Collection',
    description: 'Support for garbage collected languages.',
    detector: gc,
    url: 'https://github.com/WebAssembly/gc'
  },
  {
    id: 'jsStringBuiltins',
    name: 'JS String Builtins Proposal for WebAssembly',
    description: 'Built-in functions for common string operations.',
    detector: jsStringBuiltins,
    url: 'https://github.com/WebAssembly/js-string-builtins'
  },
  {
    id: 'jspi',
    name: 'JavaScript Promise Integration',
    description: 'Integration with JavaScript Promises for async operations.',
    detector: jspi,
    url: 'https://github.com/WebAssembly/js-promise-integration'
  },
  {
    id: 'memory64',
    name: 'Memory64',
    description: 'Support for 64-bit memory addressing.',
    detector: memory64,
    url: 'https://github.com/WebAssembly/memory64'
  },
  {
    id: 'multiMemory',
    name: 'Multiple Memories',
    description: 'Ability to use multiple independent memory regions.',
    detector: multiMemory,
    url: 'https://github.com/WebAssembly/multi-memory'
  },
  {
    id: 'multiValue',
    name: 'Multi-value',
    description: 'Functions can return multiple values.',
    detector: multiValue,
    url: 'https://github.com/WebAssembly/multi-value'
  },
  {
    id: 'mutableGlobals',
    name: 'Importable/Exportable mutable globals',
    description: 'Allows mutable global variables to be imported and exported.',
    detector: mutableGlobals,
    url: 'https://github.com/WebAssembly/mutable-global'
  },
  {
    id: 'referenceTypes',
    name: 'Reference Types',
    description: 'Allows WebAssembly to hold references to host objects.',
    detector: referenceTypes,
    url: 'https://github.com/WebAssembly/reference-types'
  },
  {
    id: 'relaxedSimd',
    name: 'Relaxed SIMD',
    description: 'More flexible SIMD operations.',
    detector: relaxedSimd,
    url: 'https://github.com/webassembly/relaxed-simd'
  },
  {
    id: 'saturatedFloatToInt',
    name: 'Non-trapping float-to-int conversions',
    description: 'Float-to-integer conversions that saturate instead of trapping.',
    detector: saturatedFloatToInt,
    url: 'https://github.com/WebAssembly/nontrapping-float-to-int-conversions'
  },
  {
    id: 'signExtensions',
    name: 'Sign-extension operators',
    description: 'Operators for sign-extending integer values.',
    detector: signExtensions,
    url: 'https://github.com/WebAssembly/sign-extension-ops'
  },
  {
    id: 'simd',
    name: 'Fixed-Width SIMD',
    description: 'Single Instruction, Multiple Data operations for parallel processing.',
    detector: simd,
    url: 'https://github.com/webassembly/simd'
  },
  {
    id: 'streamingCompilation',
    name: 'Streaming Compilation',
    description: 'Compile WebAssembly modules as they are being downloaded.',
    detector: streamingCompilation,
    url: 'https://webassembly.github.io/spec/web-api/index.html#streaming-modules'
  },
  {
    id: 'tailCall',
    name: 'Tail call',
    description: 'Optimization for tail-recursive function calls.',
    detector: tailCall,
    url: 'https://github.com/webassembly/tail-call'
  },
  {
    id: 'threads',
    name: 'Threads',
    description: 'Support for multi-threaded execution.',
    detector: threads,
    url: 'https://github.com/webassembly/threads'
  },
  {
    id: 'typeReflection',
    name: 'Type Reflection',
    description: 'Ability to inspect types at runtime.',
    detector: typeReflection,
    url: 'https://github.com/WebAssembly/js-types'
  },
  {
    id: 'typedFunctionReferences',
    name: 'Typed function references',
    description: 'Function references that carry type information.',
    detector: typedFunctionReferences,
    url: 'https://github.com/WebAssembly/function-references'
  },
];

export const useFeatures = (): WebAssemblyFeature[] => {
  function updateFeatureStatus(featureId: string, status: boolean) {
    setFeatures((prevFeatures) => ({
      ...prevFeatures,
      [featureId]: status,
    }));
  }
  const [features, setFeatures] = useState<{ [featureId: string]: null | true | false }>(
    Object.fromEntries(
      featureDefs.map((feature) => [feature.id, null])
    )
  );

  useEffect(() => {
    featureDefs.forEach((feature) =>
      feature.detector().then((status) => {
        updateFeatureStatus(feature.id, status);
      })
    );
  }, []);

  return featureDefs.map((feature) => ({
    ...feature,
    status: features[feature.id] === null ? 'loading' : features[feature.id] ? 'supported' : 'unsupported',
  }));
};