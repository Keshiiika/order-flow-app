let currState: any = undefined;
function useState<T>(init: T): [T, (value: T) => void] {
  if (currState === undefined) {
      currState = {state: init};
  }

  const proxyState = new Proxy(currState, {
      get(target, key: keyof typeof currState) {
          return target[key];
      },
      set(target: { state: T }, p: string | symbol, value: any, receiver: any): boolean {
          if (typeof init !== typeof value) {
              throw new Error("Cannot assign a different type of value");
              return false;
          } else {
              target["state"] = value;
              return true;
          }
      }
  });

  const setState: (value: T) => void = (value) => {
      proxyState.state = value;
  };

  return [proxyState.state, setState];
};

export {useState};