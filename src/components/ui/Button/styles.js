import styled from "styled-components";
import tw from "tailwind.macro";
import { motion } from "framer-motion";

export const Button = motion.custom(styled.button`
  outline: none !important;
  ${tw`py-2 px-8 rounded-full border border-green-500 text-white`};

  ${({ primary }) =>
    primary
      ? tw`bg-green-500 hover:text-white focus:text-white focus:shadow-outline active:text-white`
      : tw`text-green-500`};

  ${({ block }) => block && tw`w-full`};
`);
