import {motion} from 'framer-motion';
import styled from 'styled-components';

const Wrap = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 20px;
  background: rgba(40, 40, 50, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 0.9rem;
  z-index: 999;
`;

export function FloatingAchievement({
  text,
  onDone,
}: {
  text: string;
  onDone: () => void;
}) {
  return (
    <motion.div
      initial={{opacity: 0, y: -10}}
      animate={{opacity: 1, y: 0}}
      exit={{opacity: 0, y: -10}}
      transition={{duration: 0.4}}>
      <Wrap>{text}</Wrap>
    </motion.div>
  );
}
