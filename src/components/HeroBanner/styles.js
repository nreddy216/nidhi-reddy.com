import styled from "styled-components";
import tw from "tailwind.macro";

export const Banner = styled.section`
  ${tw`border-b border-indigo-200 `};
`;

export const SubTitle = styled.h2`
  ${tw`mt-2 lowercase text-md sm:text-xl font-semibold w-full text-center`};
`;

export const Content = styled.p`
  ${tw`mb-8`};
`;

export const CurvedPath = styled.svg`
  ${tw`w-full h-full`}

  transform: scale(1.25);
  fill: url(#curved-path-gradient);
`;

export const CurvedText = styled.text`
 ${tw`font-bold text-2xl sm:text-2xl tracking-wide text-center uppercase sm:lowercase`};
`;

export const Title = styled.div`
  ${tw`w-full overflow-hidden`}
  margin: -8em auto -2em;
`;