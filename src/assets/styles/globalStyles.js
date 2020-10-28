import { createGlobalStyle } from "styled-components";
import tw from "tailwind.macro";

export default createGlobalStyle`
  body {
    ${tw`m-0 text-indigo-900 bg-gray-100`};
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

  ol > li {
    ${tw`list-decimal`}
  }

  li {
    ${tw`pl-2 ml-6 mb-2`}
  }

  ul, ol {
    ${tw`mb-8`}
  }

  h2 {
    ${tw`mb-4 text-xl`}
  }

  .format-html img, .format-html video {
    ${tw`mb-4 w-full`}
  }

  .format-html h2 {
    ${tw`mt-8`}
  }

  a > svg {
    ${tw`ml-3`}
  }

  .twitter-tweet {
    max-width: 350px !important;
  }

  .flex-row {
    ${tw`flex flex-col sm:flex-row`}

    > * {
      ${tw`mr-4`}
    }
  }
`;
