import { motion } from 'framer-motion';

export default function Tier1Letter({ letter }) {
  const { from_name, to_name, date, content, colors } = letter;

  return (
    <div className="min-h-screen romantic-bg flex items-center justify-center p-6" style={{ backgroundColor: colors.bg }}>
      <div 
        className="max-w-2xl w-full bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-14 border border-pink-100"
        style={{ color: colors.text }}
      >
        <div className="text-center mb-12">
          <p className="text-xl italic" style={{ color: colors.accent }}>{date}</p>
          <div className="text-6xl my-6">💕</div>
        </div>

        <h1 className="text-4xl font-bold text-center mb-10" style={{ color: colors.accent }}>
          Dear {to_name},
        </h1>

        <p className="text-[1.15rem] leading-relaxed whitespace-pre-line mb-12 font-light">
          {content}
        </p>

        <div className="text-right">
          <p className="text-2xl" style={{ color: colors.accent }}>With all my love,</p>
          <p className="text-3xl font-medium mt-2" style={{ color: colors.accent }}>{from_name}</p>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center mt-16 text-5xl"
        >
          ❤️
        </motion.div>
      </div>
    </div>
  );
}