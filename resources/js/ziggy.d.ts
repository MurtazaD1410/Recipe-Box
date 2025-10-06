// This is the Laravel 12 way.
// We are creating a TypeScript declaration file to inform the compiler
// about the global `route` function provided by Ziggy.

import { Config, RouteParam, RouteParamsWithQueryOverload } from 'ziggy-js';

declare global {
    // This function is declared globally by the @routes Blade directive.
    // We are defining its signature here for TypeScript to understand.
    function route(
        name: string,
        params?: RouteParamsWithQueryOverload | RouteParam,
        absolute?: boolean,
        config?: Config,
    ): string;
}

// It's good practice to add this line to ensure the file is treated as a module.
export {};
