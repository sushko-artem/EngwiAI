import { memo } from "react";
import { Link } from "react-router-dom";

export const AuthLink = memo(
  ({
    text,
    url,
    linkText,
  }: {
    text: string;
    url: string;
    linkText: string;
  }) => (
    <div className="flex justify-center mt-4 text-amber-50">
      <p className="mr-2.5">{text}</p>
      <Link className="underline hover:text-gray-500 transition-all" to={url}>
        {linkText}
      </Link>
    </div>
  )
);
