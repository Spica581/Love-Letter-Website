import { motion } from 'framer-motion';

export default function Tier1Letter({ letter, isPublic = false }) {
  const { from_name, to_name, date, content, colors } = letter;

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6 romantic-bg"
      style={{ backgroundColor: colors.bg }}
    >
      <div 
        className="max-w-2xl w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-12 border border-pink-200"
        style={{ color: colors.text }}
      >
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="text-6xl mb-4 heart">💌</div>
          <p className="text-xl" style={{ color: colors.accent }}>{date}</p>
        </motion.div>

        <h1 className="text-4xl font-bold mb-8 text-center" style={{ color: colors.accent }}>
          Dear {to_name},
        </h1>

        <p className="text-lg leading-relaxed whitespace-pre-line mb-10">
          {content}
        </p>

        <div className="text-right">
          <p className="text-2xl font-medium" style={{ color: colors.accent }}>
            Forever yours,<br />
            {from_name}
          </p>
        </div>

        <motion.div 
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-5xl text-center mt-12"
        >
          ❤️
        </motion.div>
      </div>
    </div>
  );
}
