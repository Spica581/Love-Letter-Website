import { motion } from 'framer-motion';

export default function Tier1Letter({ letter }) {
  const { content, names, date, colors } = letter;

  return (
    <div style={{ backgroundColor: colors.bg, color: colors.text }} className="p-8 font-cursive space-y-4">
      <h1 className="text-3xl">Dear {names.to},</h1>
      <p>{content}</p>
      <p>From {names.from}, {date}</p>
      {/* Heart icons, dividers */}
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity }}>❤️</motion.div>
    </div>
  );
}
