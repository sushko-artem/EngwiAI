import { PulseLoader } from "react-spinners";

export const spinner = () => (
  <div className="fixed inset-0 z-100 backdrop-blur-[3px] grid place-items-center">
    <PulseLoader
      cssOverride={{
        display: "block",
      }}
      color="#F1EFEFFF"
      margin={3}
      size={10}
    />
  </div>
);
