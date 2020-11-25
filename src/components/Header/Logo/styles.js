import styled from "styled-components";
import tw from "tailwind.macro";
import { Link } from "gatsby";

export const Logo = styled(Link)`
  ${tw`flex items-center mr-auto text-indigo-900 hover:text-indigo-900`};
`;

export const Text = styled.span`
  ${tw`text-lg lowercase font-semibold pl-2`};

  letter-spacing: 3px;

  ${({ isFlipped }) => isFlipped && `transform: rotate(-180deg)`};
`;

export const Emoji = styled.span`
  ${tw`text-sm`};
`;

export const Image = styled.figure`
  ${tw`w-16 h-16 mr-3 border border-green-500 rounded-full`};

  img {
    ${tw`border-4 border-white rounded-full`};
  }
`;
