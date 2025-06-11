const Home = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="blob w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] top-[-100px] left-[-100px] bg-blue-800" />

      <div className="blob w-[40vw] h-[40vw] bottom-[-150px] right-[-150px] bg-blue-800" />

      <div className="blob w-[450px] h-[450px] top-[30%] left-[50%] bg-[#6EACDA]" />

      <div id="text-animation" className="w-full text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
        <h1 className="text-[8vw] md:text-[4vw] font-medium">
          Book Appointment
        </h1>
        <p className="text-gray-300 text-[12px] md:text-[14px] text-center mt-2">
          One Solution for online appointment booking
        </p>
        <div className="space-x-3 mt-8">
          <a href="/book-appointment">
          <button className="border border-gray-200 w-[100px] h-[50px] rounded-3xl cursor-pointer">Book</button>
          </a>
          <a href="/list-appointments">
          <button className="border border-gray-200 w-[100px] h-[50px] rounded-3xl cursor-pointer">Check</button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
