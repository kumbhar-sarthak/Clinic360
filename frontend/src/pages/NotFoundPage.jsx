import { useNavigate } from "react-router";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-[120px] font-extrabold leading-none mb-8">Oops!</h1>
      <p className="text-gray-400 text-base mb-8 max-w-md text-center">
        The page you're looking for doesn’t exist or may have been moved.
      </p>
      <button
        onClick={() => navigate("/")}
        className="relative border border-white font-semibold px-6 py-3 rounded-full cursor-pointer overflow-hidden transition-all duration-300 group"
      >
        <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></span>
        <span className="relative z-10 text-white group-hover:text-black transition-colors duration-300">
          Go Home
        </span>
      </button>
    </div>
  );
}
