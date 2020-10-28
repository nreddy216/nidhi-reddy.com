import styled from "styled-components";
import tw from "tailwind.macro";

export const Banner = styled.section`
  ${tw`border-b border-indigo-200 `};
`;

export const Title = styled.h2`
  ${tw`text-3xl text-green-500 font-bold w-full text-left`};
  ${({ center }) => center && tw`text-center`};
`;

export const SubTitle = styled.h2`
  ${tw`text-3xl font-bold w-full text-left`};
  ${({ center }) => center && tw`text-center`};
`;

export const Content = styled.p`
  ${tw`mb-8`};
`;
