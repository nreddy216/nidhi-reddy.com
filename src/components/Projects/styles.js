import styled from "styled-components";
import tw from "tailwind.macro";

export const Projects = styled.div`
  ${tw`w-full flex flex-wrap`};
`;

export const Project = styled.div`
  ${tw`p-3`};

  .project-link > div {
    height: 100%;
  }
`;

export const Card = styled.div`
  ${tw`w-full h-full rounded-lg flex flex-col overflow-hidden border border-gray-300`};
`;

export const Content = styled.div`
  ${tw`p-4 text-indigo-900`};
`;

export const Image = styled.figure`
  ${tw`w-full relative overflow-hidden`};

  max-height: 190px;

  &:after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 150%;
    padding-bottom: 120%;
    box-shadow: inset 0px 0px 150px 60px rgba(25, 25, 25, 0.85);
    border-radius: 50%;
  }

  ${({ imageStyle }) => imageStyle};
`;
export const CardWide = styled.div`
  ${tw`w-full h-full rounded-lg flex flex-col sm:flex-row overflow-hidden border border-gray-300 bg-grey-100`};
`;

export const ImageWide = styled.figure`
  ${tw`w-full sm:w-1/3 sm:flex-none`};

  .gatsby-image-wrapper {
    ${tw`h-full`};
  }

  img {
    object-position: 100% 100% !important;
  }
`;

export const Title = styled.h3`
  ${tw`font-semibold mb-4`};
`;

export const Description = styled.p``;

export const Date = styled.h3`
  ${tw`text-xs text-green-500`};
`;

export const Tags = styled.div`
  ${tw`p-4 pt-2 mt-auto overflow-scroll text-overflow-ellipsis`}
`;

export const TagsWide = styled.div`
  ${tw`pt-2 mt-auto overflow-scroll text-overflow-ellipsis`}
`;

export const Tag = styled.span`
  ${tw`text-xs text-indigo-900 border border-green-500 rounded-full px-2 py-1 mr-2 whitespace-no-wrap`}
`;
