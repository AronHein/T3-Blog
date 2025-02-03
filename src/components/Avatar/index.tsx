import React from "react";
import Image from "next/image";

type AvatarProps = {
  img: string;
};

const Avatar = ({ img }: AvatarProps) => {
  return <Image src={img} fill className="rounded-full" alt={""} />;
};

export default Avatar;
