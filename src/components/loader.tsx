export const Loader = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      {/* Modern Ring Spinner */}
      <div className="relative">
        {/* Outer glow */}
        <div className="absolute -inset-2 bg-purple-500/30 blur-lg animate-pulse"></div>

        {/* Main spinner */}
        <div
          className="w-12 h-12 border-4 border-purple-500/20 rounded-full animate-spin 
          border-t-purple-600 border-r-purple-600"
        ></div>
      </div>
    </div>
  );
};

// Fancy Gradient Spinner
export const GradientLoader = () => {
  return (
    <div className="relative w-16 h-16">
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 
        animate-spin blur-[2px]"
      ></div>
      <div className="absolute inset-[3px] bg-white rounded-full"></div>
    </div>
  );
};

// Bouncing Dots Loader
export const BouncingLoader = () => {
  return (
    <div className="flex space-x-2">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="w-4 h-4 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full
            animate-bounce"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
};

// Neon Glow Spinner
export const NeonLoader = () => {
  return (
    <div className="relative w-14 h-14">
      <div
        className="absolute inset-0 border-4 border-blue-400 rounded-full animate-spin
        shadow-neon-glow"
      ></div>
      <div
        className="absolute inset-2 border-4 border-transparent rounded-full animate-reverse-spin
        border-t-pink-400"
      ></div>
    </div>
  );
};
