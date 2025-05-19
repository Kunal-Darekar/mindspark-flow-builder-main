import * as React from "react"

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export function useIsMobile() {
  const matches = useMediaQuery(`(max-width: ${BREAKPOINTS.md - 1}px)`);
  return matches;
}

export function useIsTablet() {
  const isMobile = useIsMobile();
  const isDesktop = useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
  return !isMobile && !isDesktop;
}

export function useIsDesktop() {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
}

export function useBreakpoint(breakpoint: Breakpoint): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS[breakpoint]}px)`);
}

export function useBreakpointValue<T>(values: Record<Breakpoint, T>): T {
  const [value, setValue] = React.useState<T>(values.xs);

  React.useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      let currentBreakpoint: Breakpoint = 'xs';

      if (windowWidth >= BREAKPOINTS['2xl']) {
        currentBreakpoint = '2xl';
      } else if (windowWidth >= BREAKPOINTS.xl) {
        currentBreakpoint = 'xl';
      } else if (windowWidth >= BREAKPOINTS.lg) {
        currentBreakpoint = 'lg';
      } else if (windowWidth >= BREAKPOINTS.md) {
        currentBreakpoint = 'md';
      } else if (windowWidth >= BREAKPOINTS.sm) {
        currentBreakpoint = 'sm';
      }

      setValue(values[currentBreakpoint]);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [values]);

  return value;
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Check if window is defined (for SSR)
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);
    
    // Create an event listener that updates the state
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    
    // Add the event listener
    mediaQuery.addEventListener("change", handler);
    
    // Remove the event listener on cleanup
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
