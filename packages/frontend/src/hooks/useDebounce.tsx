import {useEffect, DependencyList} from "react";


export default function useDebounce(
    effect:() => void,
    dependencies: DependencyList,
    delay:number
) {
    useEffect(() => {
        const timeout = setTimeout(effect, delay);
        return () => clearTimeout(timeout);
      }, [...dependencies, delay]);
}