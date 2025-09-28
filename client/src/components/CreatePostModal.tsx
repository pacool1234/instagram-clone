import { useState } from "react";
import { Form, Button, ProgressBar, Modal } from "react-bootstrap";
import axios from "axios";
import { addPost } from "../services/post.api.js";

const CLOUDINARY_CLOUD_NAME = "dvbftvhl0";
const CLOUDINARY_UPLOAD_PRESET = "instagram_clone";

interface Props {
  show: boolean;
  handleClose: () => void;
}

export default function CreatePostModal(props: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) return alert("Please select an image to upload.");

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percentCompleted);
            }
          },
        }
      );
      const imageUrl = cloudinaryResponse.data.secure_url;

      await addPost(imageUrl, caption);

      alert("Post created successfully!");
      props.handleClose();
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Modal show={props.show} onHide={props.handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Post</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleFileChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Caption</Form.Label>
              <Form.Control as="textarea" rows={3} value={caption} onChange={(e) => setCaption(e.target.value)} />
            </Form.Group>

            {uploading && <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} className="mb-3" />}
						
            <Button variant="primary" type="submit" disabled={uploading}>
              {uploading ? "Uploading..." : "Create Post"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
