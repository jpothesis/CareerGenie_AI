const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-purple-100 text-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        Welcome to <span className="text-purple-600">CareerGenie.AI</span> 💡
      </h1>
      <p className="text-lg text-gray-600 max-w-xl">
        Your smart career companion — helping you make informed decisions with the power of AI.
      </p>
    </div>
  );
};

export default Home;
