import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { type IPost } from "../domain/interfaces.js";

interface PostItemProps {
  item: IPost;
}

export default function PostItem(props: PostItemProps) {
  return (
    <Card style={{ width: "28rem" }}>
      <Card.Header>
        <Link to={`/profile/${props.item.author._id}`} className="fw-bold text-dark text-decoration-none">
          {props.item.author.username}
        </Link>
      </Card.Header>

      <Card.Img variant="top" src={props.item.imageUrl} />
			
      <Card.Body>
        <Card.Text>{props.item.caption}</Card.Text>
      </Card.Body>
    </Card>
  );
}
