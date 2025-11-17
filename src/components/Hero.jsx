import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <section className="relative w-full h-[56vh] md:h-[64vh] lg:h-[72vh] overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/QblYNXAoH6zf7SHu/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <div className="backdrop-blur-sm bg-white/40 rounded-2xl p-6 md:p-10 shadow-lg">
            <h1 className="text-3xl md:text-5xl font-bold text-slate-800 tracking-tight">
              Bioethics Forum
            </h1>
            <p className="mt-3 md:mt-4 text-slate-700 md:text-lg">
              Thoughtful debate on ethical questions in medicine, AI, and society.
              Share topics, agree or disagree, and contribute with posts and comments.
            </p>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white"></div>
    </section>
  );
}
