import React from 'react';
import { motion } from 'framer-motion';

const FadeUpSection = ({ children, delay = 0 }) => {
  return (
    <motion.div
      // 1. Initial State: Invisible and pushed down by 40px
      initial={{ opacity: 0, y: 40 }}
      
      // 2. Animate State: Fully visible and in its original position
      whileInView={{ opacity: 1, y: 0 }}
      
      // 3. Viewport: Trigger once when the element is 100px into the screen
      viewport={{ once: true, margin: "-100px" }}
      
      // 4. Transition: Smooth easing with an optional delay
      transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default FadeUpSection;