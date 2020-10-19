import styled from 'styled-components';
import tw from 'tailwind.macro';

export const Projects = styled.div`
  ${tw`w-full flex flex-wrap`};
`;

export const Project = styled.div`
  ${tw`w-full sm:w-1/2 p-3`};
`;

export const ProjectWide = styled.div`
  ${tw`w-full p-3`};
`;

export const Card = styled.div`
  ${tw`w-full h-full rounded-lg flex flex-col overflow-hidden border border-gray-300`};
`;

export const CardWide = styled.div`
  ${tw`w-full h-full rounded-lg flex flex-row overflow-hidden border border-gray-300`};
`;

export const Content = styled.div`
  ${tw`p-4 text-indigo-900`};
`;

export const Image = styled.figure`
  ${tw`w-full`};
`;

export const Title = styled.h3`
  ${tw`font-semibold mb-4`};
`;

export const Description = styled.p``;

export const Date = styled.h3`
  ${tw`text-xs text-green-500`};
`;

export const Tags = styled.div`
  ${tw`p-4 pt-2 mt-auto`}
`;

export const Tag = styled.span`
  ${tw`text-xs text-indigo-900 border border-green-500 rounded-full px-2 py-1 mr-2`}
`;
