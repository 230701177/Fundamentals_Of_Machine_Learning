import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', animate = false }) => {
  const content = (
    <div className={`card ${className}`}>
      {children}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

export default Card;
