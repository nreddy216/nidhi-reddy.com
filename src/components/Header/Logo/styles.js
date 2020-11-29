import styled from "styled-components";
import tw from "tailwind.macro";
import { Link } from "gatsby";

export const Logo = styled(Link)`
  ${tw`flex items-center mr-auto text-indigo-900 hover:text-indigo-900`};
`;

export const Text = styled.span`
  ${tw`text-lg lowercase font-bold`};

  letter-spacing: 3px;
  background: linear-gradient(135deg,#48bb78,#3c366b,#48bb78);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;

  ${({ isVerticallyFlipped }) => isVerticallyFlipped && `transform: rotate(-180deg);`};
`;

export const Emoji = styled.span`
  ${tw`text-sm text-gray-500 pr-4 pl-4`};

  ${({ isHorizontallyFlipped }) => isHorizontallyFlipped && `transform: scale(-1, 1);`};
`;

export const Image = styled.figure`
  ${tw`w-16 h-16 mr-3 border border-green-500 rounded-full`};

  img {
    ${tw`border-4 border-white rounded-full`};
  }
`;
