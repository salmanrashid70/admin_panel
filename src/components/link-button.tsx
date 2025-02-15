import { useRouter } from "next/navigation";

interface LinkButtonProps {
  title: string;
  url: string;
}

const LinkButton = ({ title, url }: LinkButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(url);
  };

  return (
    <div
      className="cursor-pointer text-sm hover:bg-gray-100 p-1"
      onClick={handleClick}
    >
      <span className="pr-1">{title}</span>
    </div>
  );
};

export default LinkButton;
