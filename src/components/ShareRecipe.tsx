import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  EmailShareButton,
  EmailIcon,
} from "next-share";
export default function ShareRecipe({
  link,
  name,
}: {
  link: string;
  name: string;
}) {
  const transformedLink =
    process.env.NODE_ENV === "development"
      ? `http://localhost:3000${link}`
      : `https://recipe-book-five-theta.vercel.app/${link}`;

  return (
    <div className="flex gap-5 mx-auto  w-fit">
      <FacebookShareButton
        url={transformedLink}
        quote={
          "Recipe Share is a platfrom using that you can share your recipes to other peoples !"
        }
        hashtag={`#${name}`}
      >
        <FacebookIcon size={32} round />
      </FacebookShareButton>

      <WhatsappShareButton url={transformedLink} title={name} separator=":: ">
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>

      <EmailShareButton
        url={transformedLink}
        subject={`Recipe : ${name}`}
        body="body"
      >
        <EmailIcon size={32} round />
      </EmailShareButton>
    </div>
  );
}
