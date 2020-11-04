import styled from "styled-components";
import tw from "tailwind.macro";

export const Player = styled.section`
  ${tw`w-full mb-8 mt-4 relative rounded-2xl overflow-hidden bg-white border-gray-300 border`};

  padding: 56.25% 0 0 0;
`;

export const Iframe = styled.iframe`
  ${tw`w-full h-full absolute top-0 left-0 `};
`;
