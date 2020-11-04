import styled from "styled-components";
import tw from "tailwind.macro";

export const Title = styled.h1`
  ${tw`font-semibold mb-4`};
`;

export const Image = styled.figure`
  ${tw`w-full rounded-lg overflow-hidden mt-8 mb-10`};
`;

export const Links = styled.div`
  ${tw`w-full flex justify-between mt-10 lowercase`};
`;
