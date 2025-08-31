import { StartAnimation } from "@features/animation/containers/animation";

export const AnimationPage = () => (
  <div className="flex justify-center items-center min-h-[100vh]">
    <div className="lg:w-[300px] md:w-[230px] w-[180px]">
      <StartAnimation />;
    </div>
  </div>
);
