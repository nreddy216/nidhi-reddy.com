import styled from "styled-components";
import tw from "tailwind.macro";

export const Title = styled.h1`
  ${tw`font-semibold mb-4`};
`;

export const Image = styled.figure`
  ${tw`w-full rounded-lg overflow-hidden mt-8 mb-10`};
`;

export const Links = styled.div`
  ${tw`w-full flex sm:flex-row flex-col md:justify-between items-center mt-10 lowercase text-sm sm:text-base`};

  span {
    margin-bottom: 1rem;
  }
`;

export const LinksNoMargin = styled.div`
  ${tw`w-full flex justify-between lowercase text-sm sm:text-base`};
`;
