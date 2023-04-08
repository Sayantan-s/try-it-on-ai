import { ChangeEventHandler, useState } from 'react';

export const useHandleInput = <T>(
  initialValue: T
): [T, ChangeEventHandler<HTMLInputElement>] => {
  const [state, setState] = useState(initialValue);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (eve) => {
    const target = eve.target as HTMLInputElement;
    if (typeof state === 'string') {
      setState(target.value as T);
      return;
    }
    if (typeof state === 'object' && state !== null && !Array.isArray(state)) {
      const { name, value } = target;
      setState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  return [state, handleChange];
};
