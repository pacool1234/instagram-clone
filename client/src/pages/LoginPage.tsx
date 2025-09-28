// src/pages/LoginPage.tsx
import { useState, useContext } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext/AuthState";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

	if (!authContext) {
		throw new Error("This component must be used within an AuthProvider");
	}
	const { login } = authContext;

  const goToRegister = () => {
    navigate("/register");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const request = { email, password };

      await login(request);

      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to log in");
    }
  };

  return (
    <div className="d-flex h-100">
      <div className="d-flex flex-column align-items-center justify-content-center p-5">
        <span>Mira los momentos cotidianos de tus mejores amigos.</span>
        <img src="images/login.png" className="img-fluid w-75" />
      </div>

      <div className="bg-danger flex-grow-1 p-5">
        <h2>Login</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Login
          </Button>

          <Button variant="primary" type="button" onClick={goToRegister}>
            Create an account
          </Button>
        </Form>
      </div>
    </div>
  );
}
