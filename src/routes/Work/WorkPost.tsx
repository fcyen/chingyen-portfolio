import { useParams } from "react-router-dom";

export default function WorkPost() {
  const { slug } = useParams<{ slug: string }>();
  return <main>Work post: {slug}</main>;
}
