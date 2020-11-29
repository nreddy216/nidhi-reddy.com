import { createGlobalStyle } from "styled-components";
import tw from "tailwind.macro";

export default createGlobalStyle`
  body {
    ${tw`m-0 text-indigo-900 bg-gray-100`};
  }

  b, strong {
    ${tw`font-semibold`};
  }

  a {
    ${tw`text-indigo-600 hover:text-indigo-700 focus:border-blue-200`};
  }

  p + p {
    ${tw`mt-3`};
  }

  ul {
    ${tw`my-3`};
  }

  ul > li {
    ${tw`list-disc`}
  }

  ul > li li {
    ${tw`list-circle`}
  }

  ol > li {
    ${tw`list-decimal`}
  }

  li {
    ${tw`pl-2 ml-6 mb-2`}
  }

  ul, ol {
    ${tw`mb-8`}
  }

  ul ul, ol ol {
    ${tw`mb-0`}
  }

  h2 {
    ${tw`mb-4 text-xl`}
  }

  .format-html img,
  .format-html video,
  .format-html .iframe-video {
    ${tw`mb-6 mt-6 w-full`}
  }

  .format-html .iframe-video,
  .format-html .gatsby-resp-image-wrapper {
    ${tw`w-full relative rounded-2xl overflow-hidden border-gray-300 border p-0`}
  }

  .format-html h2:not(:first-child) {
    ${tw`mt-8`}
  }

  a > svg {
    ${tw`ml-3`}
  }

  .twitter-tweet {
    max-width: 350px !important;
  }
  
  .twitter-tweet iframe {
    max-width: 100%;
  }

  .flex-row {
    ${tw`flex flex-col sm:flex-row`}

    > * {
      ${tw`mr-4`}
    }
  }

  /* TODO: Grid not working from tailwind */
  .grid-row {
    display: grid;
    grid-template-columns: repeat(3,minmax(0,1fr));
    grid-gap: .5rem;
    gap: .5rem;

    @media only screen and (max-width: 600px) {
      grid-template-columns: repeat(1,minmax(0,1fr));
    }

    > span {
      margin-left: 0 !important;
      margin-right: 0 !important;
    }
  }
`;
