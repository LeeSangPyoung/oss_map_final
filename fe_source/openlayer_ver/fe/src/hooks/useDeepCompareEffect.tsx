import { useRef } from 'react';
import { DependencyList, useEffect, useLayoutEffect } from 'react';
import isEqual from 'react-fast-compare';

export const depsEqual = (aDeps: DependencyList = [], bDeps: DependencyList = []) => isEqual(aDeps, bDeps);

type EffectHookType = typeof useEffect | typeof useLayoutEffect;
type CreateUpdateEffect = (hook: EffectHookType) => EffectHookType;

export const createDeepCompareEffect: CreateUpdateEffect = hook => (effect, deps) => {
  const ref = useRef<DependencyList>();
  const signalRef = useRef<number>(0);

  if (deps === undefined || !depsEqual(deps, ref.current)) {
    signalRef.current += 1;
  }
  ref.current = deps;

  hook(effect, [signalRef.current]);
};
export default createDeepCompareEffect(useEffect);
