import styled from "styled-components";
import tw from "tailwind.macro";

export const Banner = styled.section`
  ${tw`border-b border-indigo-200 `};
`;

export const Title = styled.h2`
  ${tw`uppercase w-full text-center font-black text-4xl sm:text-5xl lg:text-6xl tracking-widest`};

  margin-top: -3rem;
  background: linear-gradient(135deg, #48bb78, #ffdb58, #3c366b, #48bb78);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;
`;

export const SubTitle = styled.h2`
  ${tw`mt-4 lowercase text-2xl sm:text-3xl font-semibold w-full text-center sm:text-left`};
  ${({ center }) => center && tw`text-center`};
`;

export const Content = styled.p`
  ${tw`mb-8`};
`;
